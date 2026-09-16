import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { CountryFlagBadge } from "@/components/ui";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { filterCountriesWithFlags } from "./country-selector-data";
import type { Country } from "./onboarding.types";

type CountrySelectorProps = {
  onSelect: (country: Country) => void;
  selectedCode: string | null;
  selectedName: string | null;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function CountrySelector({ onSelect, selectedCode, selectedName }: CountrySelectorProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { isDesktop } = useResponsiveLayout();
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const countries = useMemo(() => filterCountriesWithFlags(query), [query]);

  const dismiss = () => {
    setVisible(false);
    setQuery("");
  };

  return (
    <>
      <Pressable
        accessibilityLabel={t("onboarding.country.accessibilityLabel", {
          country: selectedName ?? t("onboarding.country.notSelected"),
        })}
        accessibilityRole="button"
        accessibilityState={{ expanded: visible }}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
      >
        <View style={styles.flagWrap}>
          {selectedCode ? (
            <CountryFlagBadge countryCode={selectedCode} size={28} />
          ) : (
            <Feather color={theme.colors.icon.muted} name="globe" size={28} />
          )}
        </View>
        <View style={styles.selectedCopy}>
          <Text style={styles.fieldLabel}>{t("onboarding.country.fieldLabel")}</Text>
          <Text style={[styles.selectedName, !selectedName && styles.placeholder]}>
            {selectedName ?? t("onboarding.country.select")}
          </Text>
        </View>
        <Feather color={theme.colors.icon.secondary} name="chevron-down" size={theme.sizes.iconMedium} />
      </Pressable>

      <Modal animationType="slide" onRequestClose={dismiss} transparent visible={visible}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.modalBackdrop}>
          <View accessibilityViewIsModal style={[styles.sheet, isDesktop && styles.sheetDesktop]}>
            <View style={styles.sheetHeader}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>
                {t("onboarding.country.sheetTitle")}
              </Text>
              <Pressable
                accessibilityLabel={t("onboarding.country.close")}
                accessibilityRole="button"
                onPress={dismiss}
                style={styles.closeButton}
              >
                <Feather color={theme.colors.icon.primary} name="x" size={theme.sizes.iconMedium} />
              </Pressable>
            </View>
            <View style={styles.searchWrap}>
              <Feather color={theme.colors.icon.muted} name="search" size={theme.sizes.iconSmall} />
              <TextInput
                accessibilityLabel={t("onboarding.country.searchLabel")}
                autoCapitalize="words"
                onChangeText={setQuery}
                placeholder={t("onboarding.country.searchPlaceholder")}
                placeholderTextColor={theme.colors.text.subtle}
                style={styles.searchInput}
                value={query}
              />
            </View>
            <FlatList
              contentContainerStyle={styles.list}
              data={countries}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(country) => country.code}
              ListEmptyComponent={<Text style={styles.empty}>{t("onboarding.country.empty")}</Text>}
              renderItem={({ item }) => {
                const selected = item.code === selectedCode;
                return (
                  <Pressable
                    accessibilityLabel={item.name}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onSelect(item);
                      dismiss();
                    }}
                    style={({ pressed }) => [
                      styles.result,
                      selected && styles.selectedResult,
                      pressed && styles.pressed,
                    ]}
                  >
                    <CountryFlagBadge countryCode={item.code} size={24} />
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.countryCode}>{item.code}</Text>
                    {selected ? (
                      <Feather color={theme.colors.text.success} name="check" size={theme.sizes.iconSmall} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  closeButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  countryCode: { ...theme.typography.labelSmall, color: theme.colors.text.muted },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    paddingVertical: theme.spacing[6],
    textAlign: "center",
  },
  fieldLabel: { ...theme.typography.labelSmall, color: theme.colors.text.muted },
  flagWrap: { alignItems: "center", justifyContent: "center", width: theme.spacing[10] },
  list: { padding: theme.spacing[4] },
  modalBackdrop: { backgroundColor: theme.colors.background.overlay, flex: 1, justifyContent: "flex-end" },
  placeholder: { color: theme.colors.text.subtle },
  pressed: { opacity: theme.opacity.pressed },
  result: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: 58,
    paddingHorizontal: theme.spacing[2],
  },
  resultName: { ...theme.typography.bodyMedium, color: theme.colors.text.primary, flex: 1 },
  searchInput: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    flex: 1,
    minHeight: theme.sizes.touchTarget,
  },
  searchWrap: {
    alignItems: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    paddingHorizontal: theme.spacing[3],
  },
  selectedCopy: { flex: 1, gap: theme.spacing[0.5], minWidth: 0 },
  selectedName: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  selectedResult: { backgroundColor: theme.colors.surface.green },
  selector: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: 76,
    padding: theme.spacing[3],
  },
  sheet: {
    alignSelf: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.strong,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    maxHeight: "88%",
    maxWidth: 640,
    minHeight: "60%",
    width: "100%",
  },
  sheetDesktop: {
    borderRadius: theme.radii.xl,
    marginBottom: theme.spacing[6],
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  sheetTitle: { ...theme.typography.heading3, color: theme.colors.text.primary },
}));
