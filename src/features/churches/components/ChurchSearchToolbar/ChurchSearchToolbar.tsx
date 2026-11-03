import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export type ChurchDiscoveryView = "list" | "map";

export type ChurchSearchToolbarProps = {
  canShowMap: boolean;
  errorMessage: string | null;
  hasSearched: boolean;
  isSearching: boolean;
  onChangeText: (value: string) => void;
  onSearch: () => void;
  onViewChange: (view: ChurchDiscoveryView) => void;
  searchTerm: string;
  view: ChurchDiscoveryView;
};

/** Presents unified U.S. church search and reveals the map/list control after successful discovery. */
export function ChurchSearchToolbar({
  canShowMap,
  errorMessage,
  hasSearched,
  isSearching,
  onChangeText,
  onSearch,
  onViewChange,
  searchTerm,
  view,
}: ChurchSearchToolbarProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const viewToggleDisabled = !hasSearched || (view === "list" && !canShowMap);

  /** Submits the unified field from the software or hardware keyboard search action. */
  function submitSearch(): void {
    onSearch();
  }

  /** Switches to the alternate results representation when that destination is available. */
  function toggleDiscoveryView(): void {
    if (!viewToggleDisabled) onViewChange(view === "map" ? "list" : "map");
  }

  return (
    <View style={styles.toolbarSurface}>
      <View style={styles.toolbarRow} testID="church-search-toolbar-row">
        <View style={styles.inputSurface}>
          <TextInput
            accessibilityLabel={t("churches.search.unifiedLabel")}
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={onChangeText}
            onSubmitEditing={submitSearch}
            placeholder={t("churches.search.unifiedPlaceholder")}
            placeholderTextColor={theme.colors.text.muted}
            returnKeyType="search"
            style={styles.input}
            value={searchTerm}
          />
          <Text numberOfLines={1} style={styles.countryNote}>
            {t("churches.search.usOnly")}
          </Text>
        </View>

        <Pressable
          accessibilityLabel={t("churches.search.action")}
          accessibilityRole="button"
          accessibilityState={{ busy: isSearching, disabled: isSearching }}
          disabled={isSearching}
          onPress={submitSearch}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && !isSearching && styles.pressed,
            isSearching && styles.disabled,
          ]}
        >
          {isSearching ? (
            <ActivityIndicator color={theme.colors.icon.primary} size="small" />
          ) : (
            <Feather accessible={false} color={theme.colors.icon.primary} name="search" size={20} />
          )}
        </Pressable>

        {hasSearched ? (
          <Pressable
            accessibilityLabel={t(view === "map" ? "churches.results.showList" : "churches.results.showMap")}
            accessibilityRole="button"
            accessibilityState={{ disabled: viewToggleDisabled }}
            disabled={viewToggleDisabled}
            onPress={toggleDiscoveryView}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && !viewToggleDisabled && styles.pressed,
              viewToggleDisabled && styles.disabled,
            ]}
          >
            <Feather
              accessible={false}
              color={theme.colors.icon.primary}
              name={view === "map" ? "list" : "map"}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>

      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  countryNote: { ...theme.typography.caption, color: theme.colors.text.secondary },
  disabled: { opacity: theme.opacity.disabled },
  errorText: {
    ...theme.typography.bodySmall,
    backgroundColor: theme.colors.semantic.dangerSurface,
    borderRadius: theme.radii.sm,
    color: theme.colors.semantic.danger,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.hairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    position: "relative",
    width: theme.sizes.touchTarget,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    minHeight: 26,
    minWidth: 0,
    padding: 0,
  },
  inputSurface: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flex: 1,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    minWidth: 0,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  pressed: { opacity: theme.opacity.pressed },
  toolbarRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: theme.spacing[1],
    width: "100%",
  },
  toolbarSurface: {
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[2],
    padding: theme.spacing[1],
    width: "100%",
    ...theme.shadows.medium,
  },
}));
