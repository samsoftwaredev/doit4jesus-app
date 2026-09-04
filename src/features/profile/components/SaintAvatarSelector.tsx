import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { saintAvatars } from "@/features/profile/saints";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type SaintAvatarSelectorProps = {
  onDismiss: () => void;
  onSelect: (saintAvatarId: string) => Promise<boolean>;
  selectedSaintAvatarId: string | null;
  visible: boolean;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function SaintAvatarSelector({ onDismiss, onSelect, selectedSaintAvatarId, visible }: SaintAvatarSelectorProps) {
  const styles = useThemedStyles(styleSheet);
  const { isDesktop, isLargeText, isNarrowPhone, isTablet } = useResponsiveLayout();
  const [selectedId, setSelectedId] = useState(selectedSaintAvatarId);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) setSelectedId(selectedSaintAvatarId);
  }, [selectedSaintAvatarId, visible]);

  const chooseSaint = async (saintAvatarId: string) => {
    if (isSaving) return;

    setSelectedId(saintAvatarId);
    setIsSaving(true);
    const didSave = await onSelect(saintAvatarId);
    setIsSaving(false);
    if (didSave) onDismiss();
  };

  return (
    <Modal animationType="slide" onRequestClose={onDismiss} transparent visible={visible}>
      <SafeAreaView edges={["bottom"]} style={styles.backdrop}>
        <Pressable accessibilityLabel="Close avatar selector" onPress={onDismiss} style={StyleSheet.absoluteFill} />
        <View
          accessibilityLabel="Choose your saint"
          accessibilityViewIsModal
          style={[styles.sheet, isDesktop && styles.sheetDesktop]}
        >
          <View style={styles.header}>
            <View>
              <Text accessibilityRole="header" style={styles.title}>
                Choose Your Saint
              </Text>
              <Text style={styles.subtitle}>Select a saint to accompany your journey.</Text>
            </View>
            <Pressable
              accessibilityLabel="Close avatar selector"
              accessibilityRole="button"
              hitSlop={theme.spacing[2]}
              onPress={onDismiss}
              style={styles.closeButton}
            >
              <Feather accessible={false} color={theme.colors.text.secondary} name="x" size={theme.sizes.iconMedium} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {saintAvatars.map((saint) => {
              const isSelected = saint.id === selectedId;
              return (
                <Pressable
                  accessibilityLabel={`${saint.name}${isSelected ? ", selected" : ""}`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSaving, selected: isSelected }}
                  disabled={isSaving}
                  key={saint.id}
                  onPress={() => void chooseSaint(saint.id)}
                  style={({ pressed }) => [
                    styles.option,
                    (isLargeText || isNarrowPhone) && styles.optionLargeText,
                    isTablet && !isLargeText && styles.optionTablet,
                    isDesktop && !isLargeText && styles.optionDesktop,
                    isSelected && styles.selectedOption,
                    pressed && !isSaving && styles.pressed,
                  ]}
                >
                  <Image accessible={false} contentFit="cover" source={saint.image} style={styles.optionImage} />
                  <Text numberOfLines={2} style={styles.optionName}>
                    {saint.name.replace("St. ", "")}
                  </Text>
                  {isSelected ? (
                    <View style={styles.checkBadge}>
                      {isSaving ? (
                        <ActivityIndicator color={theme.colors.text.inverse} size="small" />
                      ) : (
                        <Feather
                          accessible={false}
                          color={theme.colors.text.inverse}
                          name="check"
                          size={theme.sizes.iconXs}
                        />
                      )}
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  backdrop: {
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  checkBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.gold.pale,
    borderRadius: theme.radii.pill,
    height: theme.spacing[6],
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing[1],
    top: theme.spacing[1],
    width: theme.spacing[6],
  },
  closeButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    marginRight: -theme.spacing[2],
    width: theme.sizes.touchTarget,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
    paddingTop: theme.spacing[4],
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    alignItems: "center",
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[2],
    position: "relative",
    width: "30.5%",
  },
  optionDesktop: { width: "18%" },
  optionLargeText: { width: "47%" },
  optionTablet: { width: "22%" },
  optionImage: {
    borderRadius: theme.radii.pill,
    height: 74,
    width: 74,
  },
  optionName: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
    minHeight: theme.lineHeights.xs * 2,
    textAlign: "center",
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  selectedOption: {
    backgroundColor: "rgba(230, 186, 100, 0.08)",
    borderColor: theme.colors.gold.pale,
  },
  sheet: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.strong,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    maxHeight: "86%",
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[5],
    width: "100%",
  },
  sheetDesktop: {
    alignSelf: "center",
    borderRadius: theme.radii.xl,
    marginBottom: theme.spacing[6],
    maxWidth: 760,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
  },
}));
