import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { PageHeader } from "@/components";
import { Button } from "@/components/ui";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { ChurchApiError, getChurchDetails, resolvePostalCode, searchChurches } from "../churches.api";
import type { ChurchDetails, ChurchSummary, ResolvedPostalCode } from "../churches.types";
import {
  ChurchDiscoveryGlobe,
  ChurchMap,
  ChurchResultsSheet,
  ChurchSearchToolbar,
  type ChurchDiscoveryView,
  type ChurchResultsSheetSnap,
  SelectedChurchesModal,
  useChurchReminderSetup,
} from "../components";

type ClassifiedChurchSearch =
  | { kind: "empty" }
  | { kind: "invalidPostalCode" }
  | { kind: "postalCode"; value: string }
  | { kind: "query"; value: string };

const SEARCH_PAGE_SIZE = 20;
const DEFAULT_RADIUS_MILES = 25;

/** Classifies one explicit submission without guessing whether backend q text is a name or an address. */
export function classifyChurchSearchTerm(searchTerm: string): ClassifiedChurchSearch {
  const value = searchTerm.trim();
  if (!value) return { kind: "empty" };
  if (/^\d{5}$/u.test(value)) return { kind: "postalCode", value };
  if (/^\d+$/u.test(value)) return { kind: "invalidPostalCode" };
  return { kind: "query", value };
}

/** Builds one readable address line without exposing blank optional fields. */
function formatChurchAddress(church: ChurchSummary): string {
  return [church.addressLine1, church.addressLine2, church.city, church.regionName, church.postalCode]
    .filter(Boolean)
    .join(", ");
}

/** Formats a recurring local HH:mm value for the active app language. */
function formatRecurringTime(value: string, locale: string): string {
  const match = /^(\d{1,2}):(\d{2})/u.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(2020, 0, 1, Number(match[1]), Number(match[2])));
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(date);
}

/** Renders full-bleed church discovery while route-scoped reminder drafts remain available to review. */
export function ChurchesScreen() {
  const router = useRouter();
  const styles = useThemedStyles(styleSheet);
  const { i18n, t } = useTranslation();
  const { height: viewportHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const setup = useChurchReminderSetup();
  const [searchTerm, setSearchTerm] = useState("");
  const [resolvedPostalCode, setResolvedPostalCode] = useState<ResolvedPostalCode | null>(null);
  const [results, setResults] = useState<ChurchSummary[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [view, setView] = useState<ChurchDiscoveryView>("list");
  const [hasSearched, setHasSearched] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<ChurchResultsSheetSnap>("peek");
  const [selectedDetails, setSelectedDetails] = useState<ChurchDetails | null>(null);
  const [detailsLoadFailed, setDetailsLoadFailed] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pageHeight, setPageHeight] = useState(viewportHeight);
  const [bottomActionHeight, setBottomActionHeight] = useState(76);
  const [topOverlayHeight, setTopOverlayHeight] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);

  /** Returns the localized user-facing message for known church API failures. */
  function translateApiError(error: unknown, fallbackKey: string): string {
    if (error instanceof ChurchApiError) {
      if (error.status === 401) return t("churches.errors.authentication");
      if (error.status === 404) return t("churches.errors.unavailable");
    }
    return t(fallbackKey);
  }

  /** Clears submitted discovery state as soon as the unified search term is edited. */
  function handleSearchTermChange(value: string): void {
    setSearchTerm(value);
    setSearchError(null);
    setup.clearError();
    if (!hasSearched && !resolvedPostalCode && results.length === 0) return;
    setResolvedPostalCode(null);
    setResults([]);
    setNextOffset(null);
    setSelectedDetails(null);
    setHasSearched(false);
    setView("list");
    setSheetSnap("peek");
  }

  /** Performs either ZIP discovery or backend-authoritative name/address search at the requested offset. */
  async function runSearch(offset = 0): Promise<void> {
    const classifiedSearch = classifyChurchSearchTerm(searchTerm);
    if (classifiedSearch.kind === "invalidPostalCode") {
      setSearchError(t("churches.search.invalidZip"));
      return;
    }
    if (classifiedSearch.kind === "empty") {
      setSearchError(t("churches.search.invalid"));
      return;
    }
    const isPostalSearch = classifiedSearch.kind === "postalCode";
    const loadingMore = offset > 0;
    if (loadingMore) setIsLoadingMore(true);
    else setIsSearching(true);
    setSearchError(null);
    try {
      if (isPostalSearch && (!resolvedPostalCode || resolvedPostalCode.postalCode !== classifiedSearch.value)) {
        setResolvedPostalCode(await resolvePostalCode(classifiedSearch.value));
      }
      const page = await searchChurches({
        country: "US",
        ...(isPostalSearch
          ? { postalCode: classifiedSearch.value, radiusMiles: DEFAULT_RADIUS_MILES }
          : { q: classifiedSearch.value }),
        limit: SEARCH_PAGE_SIZE,
        offset,
      });
      setResults((current) => (loadingMore ? [...current, ...page.data] : page.data));
      setNextOffset(page.meta.nextOffset);
      setSelectedDetails(null);
      setHasSearched(true);
      if (!loadingMore) {
        setView(isPostalSearch ? "map" : "list");
        setSheetSnap(isPostalSearch ? (page.data.length === 0 ? "middle" : "peek") : "expanded");
      }
    } catch (error) {
      logDevelopmentError("searching churches", error);
      setSearchError(translateApiError(error, "churches.errors.search"));
    } finally {
      if (loadingMore) setIsLoadingMore(false);
      else setIsSearching(false);
    }
  }

  /** Loads and selects a church from either the map marker or list row. */
  async function selectChurch(churchId: string): Promise<void> {
    const summary =
      results.find((church) => church.id === churchId) ??
      setup.selectedChurches.find((church) => church.id === churchId);
    if (!summary) return;
    setIsDetailsLoading(true);
    setDetailsLoadFailed(false);
    setSearchError(null);
    setup.clearError();
    setSheetSnap("expanded");
    try {
      setSelectedDetails(await getChurchDetails(churchId));
    } catch (error) {
      logDevelopmentError("loading church details", error);
      setSelectedDetails({
        ...summary,
        isActive: false,
        liveStatus: { adorationInProgress: false, confessionInProgress: false, massInProgress: false },
        serviceTimes: [],
      });
      setDetailsLoadFailed(true);
      setSearchError(translateApiError(error, "churches.errors.details"));
    } finally {
      setIsDetailsLoading(false);
    }
  }

  /** Keeps the full map visible at peek and expands the sheet when list browsing is selected. */
  function changeDiscoveryView(nextView: ChurchDiscoveryView): void {
    if (nextView === "map" && !resolvedPostalCode && results.length === 0) return;
    setSelectedDetails(null);
    setView(nextView);
    setSheetSnap(nextView === "map" ? "peek" : "expanded");
  }

  /** Returns from church details to the current result mode without discarding search state. */
  function closeChurchDetails(): void {
    setSelectedDetails(null);
    setSheetSnap(view === "map" ? "middle" : "expanded");
  }

  const mapCenter = resolvedPostalCode
    ? { latitude: resolvedPostalCode.latitude, longitude: resolvedPostalCode.longitude }
    : results[0]
      ? { latitude: results[0].latitude, longitude: results[0].longitude }
      : { latitude: 39.8283, longitude: -98.5795 };
  const mapMarkers = results.map((church) => ({
    address: formatChurchAddress(church),
    id: church.id,
    latitude: church.latitude,
    longitude: church.longitude,
    name: church.name,
  }));
  const canShowMap = resolvedPostalCode !== null || mapMarkers.length > 0;
  const shouldShowMap = resolvedPostalCode !== null || (hasSearched && view === "map" && mapMarkers.length > 0);
  // The sheet must end below the header and search bar so its content is never hidden behind them.
  const resultsPanelHeight = Math.max(240, pageHeight - bottomActionHeight - topOverlayHeight);

  return (
    <SafeAreaView
      edges={["top"]}
      onLayout={(event) => setPageHeight(event.nativeEvent.layout.height)}
      style={styles.safeArea}
      testID="church-discovery-page"
    >
      <View pointerEvents="box-none" style={styles.discoveryBackground} testID="church-discovery-background">
        {shouldShowMap ? (
          <ChurchMap
            center={mapCenter}
            dom={{ scrollEnabled: false, style: { height: pageHeight } }}
            markers={mapMarkers}
            onSelectChurch={selectChurch}
            selectedChurchId={selectedDetails?.id}
          />
        ) : (
          <ChurchDiscoveryGlobe />
        )}
      </View>

      <View
        accessibilityElementsHidden={selectedDetails !== null}
        importantForAccessibility={selectedDetails ? "no-hide-descendants" : "auto"}
        onLayout={(event) => setTopOverlayHeight(event.nativeEvent.layout.height)}
        pointerEvents="box-none"
        style={styles.topOverlay}
      >
        {/* Absolute children ignore the SafeAreaView padding, so the status-bar inset is applied here. */}
        <View style={[styles.headerSurface, { paddingTop: insets.top }]}>
          <PageHeader
            backAccessibilityLabel={t("common.back")}
            description={t("churches.search.description")}
            onBack={() => router.back()}
            title={t("churches.search.title")}
            variant="compact"
          />
        </View>
        <View style={styles.searchOverlay}>
          <ChurchSearchToolbar
            canShowMap={canShowMap}
            errorMessage={searchError ?? (selectedDetails ? null : setup.errorMessage)}
            hasSearched={hasSearched}
            isSearching={isSearching}
            onChangeText={handleSearchTermChange}
            onSearch={() => void runSearch()}
            onViewChange={changeDiscoveryView}
            searchTerm={searchTerm}
            view={view}
          />
        </View>
      </View>

      {hasSearched ? (
        <ChurchResultsSheet
          bottomInset={bottomActionHeight}
          onSnapChange={setSheetSnap}
          overlaysControls={selectedDetails !== null}
          panelHeight={resultsPanelHeight}
          snap={sheetSnap}
          summary={t("churches.results.selectedCount", { count: setup.selectedChurches.length })}
          title={t("churches.results.title")}
        >
          {isDetailsLoading ? <ActivityIndicator color={theme.colors.brand.primaryLight} /> : null}
          {selectedDetails ? (
            <View style={styles.formStack}>
              <Button fullWidth onPress={closeChurchDetails} variant="outline">
                {t("churches.results.backToResults")}
              </Button>
              <View>
                <Text accessibilityRole="header" style={styles.resultName}>
                  {selectedDetails.name}
                </Text>
                <Text style={styles.muted}>{formatChurchAddress(selectedDetails)}</Text>
              </View>
              <Text style={styles.statusText}>
                {t(
                  selectedDetails.directoryVerificationStatus === "verified"
                    ? "churches.status.directoryVerified"
                    : "churches.status.directoryCandidate",
                )}
              </Text>
              <Text style={styles.statusText}>
                {t(
                  selectedDetails.scheduleStatus === "verified"
                    ? "churches.status.scheduleVerified"
                    : selectedDetails.scheduleStatus === "unavailable"
                      ? "churches.status.scheduleUnavailable"
                      : "churches.status.schedulePending",
                )}
              </Text>
              {!detailsLoadFailed && !selectedDetails.isActive ? (
                <Text style={styles.errorText}>{t("churches.status.inactive")}</Text>
              ) : null}
              {selectedDetails.liveStatus.massInProgress ? (
                <Text style={styles.liveText}>{t("churches.status.liveMass")}</Text>
              ) : null}
              {selectedDetails.liveStatus.confessionInProgress ? (
                <Text style={styles.liveText}>{t("churches.status.liveConfession")}</Text>
              ) : null}
              {selectedDetails.liveStatus.adorationInProgress ? (
                <Text style={styles.liveText}>{t("churches.status.liveAdoration")}</Text>
              ) : null}
              {selectedDetails.serviceTimes.length > 0 ? (
                <View style={styles.formStack}>
                  <Text style={styles.label}>{t("churches.status.recurringSchedule")}</Text>
                  {selectedDetails.serviceTimes.map((service) => (
                    <Text key={service.id} style={styles.muted}>
                      {`${t(`churches.weekdays.${service.weekday}`)} · ${t(`churches.services.${service.serviceType}`)} · ${formatRecurringTime(service.startTime, i18n.resolvedLanguage === "es" ? "es-MX" : "en-US")}`}
                    </Text>
                  ))}
                </View>
              ) : null}
              {detailsLoadFailed ? (
                <Button fullWidth onPress={() => void selectChurch(selectedDetails.id)} variant="outline">
                  {t("churches.errors.retryDetails")}
                </Button>
              ) : (
                <>
                  {setup.errorMessage ? (
                    <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.errorText}>
                      {setup.errorMessage}
                    </Text>
                  ) : null}
                  {setup.limitReached ? (
                    <Button onPress={() => setIsListOpen(true)} variant="ghost">
                      {t("churches.selected.review")}
                    </Button>
                  ) : null}
                  <Button
                    disabled={!selectedDetails.isActive || setup.pendingChurchIds.has(selectedDetails.id)}
                    fullWidth
                    loading={setup.pendingChurchIds.has(selectedDetails.id)}
                    onPress={() => setup.toggleSelectedChurch(selectedDetails)}
                    variant={setup.selectedChurchIds.has(selectedDetails.id) ? "outline" : "primary"}
                  >
                    {t(
                      setup.selectedChurchIds.has(selectedDetails.id)
                        ? "churches.results.remove"
                        : "churches.results.select",
                    )}
                  </Button>
                </>
              )}
            </View>
          ) : view === "list" ? (
            <View style={styles.formStack}>
              {results.length > 0 ? (
                results.map((church) => (
                  <Pressable
                    accessibilityLabel={t("churches.results.details", { name: church.name })}
                    accessibilityRole="button"
                    key={church.id}
                    onPress={() => void selectChurch(church.id)}
                    style={styles.resultRow}
                  >
                    <View style={styles.resultCopy}>
                      <Text style={styles.resultName}>{church.name}</Text>
                      <Text style={styles.muted}>{formatChurchAddress(church)}</Text>
                      {church.distanceMiles !== null ? (
                        <Text style={styles.muted}>
                          {t("churches.results.distance", { distance: church.distanceMiles })}
                        </Text>
                      ) : null}
                    </View>
                    <Feather accessible={false} color={theme.colors.icon.active} name="chevron-right" size={22} />
                  </Pressable>
                ))
              ) : (
                <Text style={styles.empty}>{t("churches.results.empty")}</Text>
              )}
              {nextOffset !== null ? (
                <Button loading={isLoadingMore} onPress={() => void runSearch(nextOffset)} variant="outline">
                  {t("churches.results.loadMore")}
                </Button>
              ) : null}
            </View>
          ) : (
            <Text style={styles.empty}>{t("churches.results.mapPrompt")}</Text>
          )}
        </ChurchResultsSheet>
      ) : null}

      <View
        onLayout={(event) => setBottomActionHeight(event.nativeEvent.layout.height)}
        style={[styles.bottomAction, { paddingBottom: theme.spacing[3] + insets.bottom }]}
        testID="church-discovery-bottom-action"
      >
        <Button
          disabled={setup.isLoadingSubscriptions}
          fullWidth
          leftIcon={<Feather accessible={false} color={theme.colors.text.primary} name="list" size={20} />}
          loading={setup.isLoadingSubscriptions}
          onPress={() => setIsListOpen(true)}
          variant="secondary"
        >
          {setup.isLoadingSubscriptions
            ? t("churches.setup.loading")
            : t("churches.selected.button", { count: setup.selectedChurches.length })}
        </Button>
      </View>
      <SelectedChurchesModal
        churches={setup.selectedChurches}
        errorMessage={setup.errorMessage}
        maxChurches={3}
        onClose={() => setIsListOpen(false)}
        onRemove={setup.toggleSelectedChurch}
        pendingChurchIds={setup.pendingChurchIds}
        visible={isListOpen}
      />
    </SafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  bottomAction: {
    backgroundColor: theme.colors.surface.primary,
    borderTopColor: theme.colors.border.default,
    borderTopWidth: theme.borderWidths.thin,
    bottom: 0,
    left: 0,
    padding: theme.spacing[3],
    position: "absolute",
    right: 0,
    zIndex: theme.zIndex.drawer,
  },
  discoveryBackground: { ...StyleSheet.absoluteFill },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    padding: theme.spacing[4],
    textAlign: "center",
  },
  errorText: { ...theme.typography.bodySmall, color: theme.colors.semantic.danger },
  formStack: { gap: theme.spacing[3] },
  headerSurface: { backgroundColor: theme.colors.surface.primary },
  label: { ...theme.typography.label, color: theme.colors.text.primary },
  liveText: { ...theme.typography.bodySmall, color: theme.colors.semantic.success, fontWeight: "700" },
  muted: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  resultCopy: { flex: 1, gap: theme.spacing[1], minWidth: 0 },
  resultName: { ...theme.typography.body, color: theme.colors.text.primary, fontWeight: "700" },
  resultRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
    paddingVertical: theme.spacing[2],
  },
  safeArea: { backgroundColor: theme.colors.background.secondary, flex: 1, position: "relative" },
  searchOverlay: { paddingBottom: theme.spacing[2], paddingHorizontal: theme.spacing[3] },
  statusText: { ...theme.typography.bodySmall, color: theme.colors.semantic.info },
  topOverlay: { left: 0, position: "absolute", right: 0, top: 0, zIndex: theme.zIndex.drawer },
}));
