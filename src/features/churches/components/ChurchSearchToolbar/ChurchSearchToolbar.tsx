import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { ResolvedPostalCode } from "../../churches.types";

export type ChurchDiscoveryView = "list" | "map";

export type ChurchFilterSelection = {
  city: string;
  dioceseId: string;
};

export type ChurchSearchToolbarProps = {
  canShowMap: boolean;
  errorMessage: string | null;
  hasSearched: boolean;
  isSearching: boolean;
  onApplyFilters: (selection: ChurchFilterSelection) => void;
  onChangeText: (value: string) => void;
  onSearch: () => void;
  onViewChange: (view: ChurchDiscoveryView) => void;
  resolvedPostalCode: ResolvedPostalCode | null;
  searchTerm: string;
  selectedCity: string;
  selectedDioceseId: string;
  view: ChurchDiscoveryView;
};

/** Presents unified U.S. church search and reveals filter and view controls after successful discovery. */
export function ChurchSearchToolbar({
  canShowMap,
  errorMessage,
  hasSearched,
  isSearching,
  onApplyFilters,
  onChangeText,
  onSearch,
  onViewChange,
  resolvedPostalCode,
  searchTerm,
  selectedCity,
  selectedDioceseId,
  view,
}: ChurchSearchToolbarProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [draftCity, setDraftCity] = useState(selectedCity);
  const [draftDioceseId, setDraftDioceseId] = useState(selectedDioceseId);
  const filtersAvailable = resolvedPostalCode !== null;
  const activeFilterCount = Number(Boolean(selectedCity)) + Number(Boolean(selectedDioceseId));
  const viewToggleDisabled = !hasSearched || (view === "list" && !canShowMap);

  useEffect(
    /** Closes a stale filter dropdown when editing removes its resolved ZIP context. */
    function closeUnavailableFilters() {
      if (!filtersAvailable) setFiltersVisible(false);
    },
    [filtersAvailable],
  );

  /** Toggles the filter dropdown and refreshes its draft whenever it opens. */
  function toggleFilters(): void {
    if (!resolvedPostalCode) return;
    if (filtersVisible) {
      setFiltersVisible(false);
      return;
    }
    setDraftCity(selectedCity);
    setDraftDioceseId(selectedDioceseId);
    setFiltersVisible(true);
  }

  /** Closes the filter dropdown without changing the applied location filters. */
  function dismissFilters(): void {
    setFiltersVisible(false);
  }

  /** Applies the staged city and diocese together so one explicit action triggers one search. */
  function applyFilters(): void {
    onApplyFilters({ city: draftCity, dioceseId: draftDioceseId });
    setFiltersVisible(false);
  }

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
          <>
            <Pressable
              accessibilityHint={!filtersAvailable ? t("churches.filters.unavailable") : undefined}
              accessibilityLabel={t("churches.filters.open")}
              accessibilityRole="button"
              accessibilityState={{ disabled: !filtersAvailable, expanded: filtersVisible }}
              disabled={!filtersAvailable}
              onPress={toggleFilters}
              style={({ pressed }) => [
                styles.iconButton,
                activeFilterCount > 0 && styles.iconButtonSelected,
                pressed && filtersAvailable && styles.pressed,
                !filtersAvailable && styles.disabled,
              ]}
            >
              <Feather
                accessible={false}
                color={activeFilterCount > 0 ? theme.colors.icon.active : theme.colors.icon.primary}
                name="sliders"
                size={20}
              />
              {activeFilterCount > 0 ? <View accessible={false} style={styles.activeFilterDot} /> : null}
            </Pressable>

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
          </>
        ) : null}
      </View>

      {filtersVisible && resolvedPostalCode ? (
        <View style={styles.filterDropdown} testID="church-filter-dropdown">
          <View style={styles.sheetHeader}>
            <Text accessibilityRole="header" style={styles.sheetTitle}>
              {t("churches.filters.title")}
            </Text>
            <Pressable
              accessibilityLabel={t("common.close")}
              accessibilityRole="button"
              onPress={dismissFilters}
              style={styles.iconButton}
            >
              <Feather accessible={false} color={theme.colors.icon.primary} name="x" size={22} />
            </Pressable>
          </View>

          <Text style={styles.locationText}>
            {t("churches.search.resolved", {
              city: resolvedPostalCode.primaryCity,
              region: resolvedPostalCode.regionCodes[0] ?? "",
            })}
          </Text>
          <ScrollView
            contentContainerStyle={styles.filterContent}
            keyboardShouldPersistTaps="handled"
            style={styles.filterScroll}
          >
            <Text style={styles.filterLabel}>{t("churches.filters.city")}</Text>
            <View style={styles.chips}>
              {[{ name: "" }, ...resolvedPostalCode.cities].map((city) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: draftCity === city.name }}
                  key={city.name || "all-cities"}
                  onPress={() => setDraftCity(city.name)}
                  style={[styles.chip, draftCity === city.name && styles.chipSelected]}
                >
                  <Text style={styles.chipText}>{city.name || t("churches.filters.allCities")}</Text>
                </Pressable>
              ))}
            </View>

            {resolvedPostalCode.dioceses.length > 0 ? (
              <>
                <Text style={styles.filterLabel}>{t("churches.filters.diocese")}</Text>
                <View style={styles.chips}>
                  {[{ id: "", name: t("churches.filters.allDioceses") }, ...resolvedPostalCode.dioceses].map(
                    (diocese) => (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: draftDioceseId === diocese.id }}
                        key={diocese.id || "all-dioceses"}
                        onPress={() => setDraftDioceseId(diocese.id)}
                        style={[styles.chip, draftDioceseId === diocese.id && styles.chipSelected]}
                      >
                        <Text style={styles.chipText}>{diocese.name}</Text>
                      </Pressable>
                    ),
                  )}
                </View>
              </>
            ) : null}
          </ScrollView>

          <View style={styles.sheetActions}>
            <Button disabled={isSearching} onPress={dismissFilters} style={styles.sheetAction} variant="ghost">
              {t("common.cancel")}
            </Button>
            <Button disabled={isSearching} onPress={applyFilters} style={styles.sheetAction}>
              {t("churches.filters.apply")}
            </Button>
          </View>
        </View>
      ) : null}

      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  activeFilterDot: {
    backgroundColor: theme.colors.icon.active,
    borderRadius: theme.radii.pill,
    height: 7,
    position: "absolute",
    right: 8,
    top: 7,
    width: 7,
  },
  chip: {
    alignItems: "center",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  chipSelected: { backgroundColor: theme.colors.surface.green, borderColor: theme.colors.border.interactive },
  chipText: { ...theme.typography.bodySmall, color: theme.colors.text.primary, textAlign: "center" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] },
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
  filterContent: { gap: theme.spacing[3], paddingVertical: theme.spacing[3] },
  filterDropdown: {
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[2],
    maxHeight: 360,
    overflow: "hidden",
    padding: theme.spacing[3],
    width: "100%",
  },
  filterLabel: { ...theme.typography.label, color: theme.colors.text.primary },
  filterScroll: { flexShrink: 1 },
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
  iconButtonSelected: { backgroundColor: theme.colors.surface.green, borderColor: theme.colors.border.interactive },
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
  locationText: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  pressed: { opacity: theme.opacity.pressed },
  sheetAction: { flex: 1 },
  sheetActions: { flexDirection: "row", gap: theme.spacing[2] },
  sheetHeader: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  sheetTitle: { ...theme.typography.heading3, color: theme.colors.text.primary, flex: 1 },
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
