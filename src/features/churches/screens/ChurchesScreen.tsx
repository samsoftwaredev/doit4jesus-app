import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { useAchievement } from "@/features/achievements";
import { useResponsiveLayout } from "@/hooks";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import {
  ChurchApiError,
  createChurchSubscription,
  deleteChurchSubscription,
  getChurchDetails,
  getChurchSubscriptions,
  resolvePostalCode,
  searchChurches,
  updateChurchSubscription,
} from "../churches.api";
import { buildSubscriptionOperations, type ChurchReminderDraft } from "../churches.setup";
import {
  CHURCH_SERVICE_TYPES,
  NOTIFICATION_WEEKDAYS,
  type ChurchDetails,
  type ChurchServiceType,
  type ChurchSubscription,
  type ChurchSummary,
  type NotificationWeekday,
  type ResolvedPostalCode,
} from "../churches.types";
import { ChurchDiscoveryGlobe, ChurchMap, ChurchResultsSheet, type ChurchResultsSheetSnap } from "../components";

type DiscoveryView = "list" | "map";
type ScreenStage = "discover" | "preferences";
type MutationFailure = { churchId: string; message: string; name: string };

const SEARCH_PAGE_SIZE = 20;
const DEFAULT_RADIUS_MILES = 25;
const MAX_SUBSCRIPTIONS = 3;

/** Builds one readable address line without exposing blank optional fields. */
function formatChurchAddress(church: ChurchSummary): string {
  return [church.addressLine1, church.addressLine2, church.city, church.regionName, church.postalCode]
    .filter(Boolean)
    .join(", ");
}

/** Converts subscriptions into editable drafts while preserving their saved choices. */
function subscriptionsToDrafts(subscriptions: readonly ChurchSubscription[]): ChurchReminderDraft[] {
  return subscriptions.map((subscription) => ({
    church: subscription.church,
    notificationWeekdays: [...subscription.notificationWeekdays],
    serviceTypes: [...subscription.serviceTypes],
  }));
}

/** Formats a recurring local HH:mm value for the active app language. */
function formatRecurringTime(value: string, locale: string): string {
  const match = /^(\d{1,2}):(\d{2})/u.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(2020, 0, 1, Number(match[1]), Number(match[2])));
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(date);
}

/** Renders persistent discovery and reminder tabs with a full-panel map or globe background. */
export function ChurchesScreen() {
  const router = useRouter();
  const styles = useThemedStyles(styleSheet);
  const { i18n, t } = useTranslation();
  const { queueAchievement } = useAchievement();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const { height: viewportHeight } = useWindowDimensions();
  const [stage, setStage] = useState<ScreenStage>("discover");
  const [postalCode, setPostalCode] = useState("");
  const [query, setQuery] = useState("");
  const [resolvedPostalCode, setResolvedPostalCode] = useState<ResolvedPostalCode | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDioceseId, setSelectedDioceseId] = useState("");
  const [results, setResults] = useState<ChurchSummary[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [view, setView] = useState<DiscoveryView>("list");
  const [hasSearched, setHasSearched] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<ChurchResultsSheetSnap>("peek");
  const [selectedDetails, setSelectedDetails] = useState<ChurchDetails | null>(null);
  const [detailsLoadFailed, setDetailsLoadFailed] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingSubscriptions, setExistingSubscriptions] = useState<ChurchSubscription[]>([]);
  const [drafts, setDrafts] = useState<ChurchReminderDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mutationFailures, setMutationFailures] = useState<MutationFailure[]>([]);
  const mayCelebrateInitialSetupRef = useRef(false);
  const discoveryPanelHeight = Math.max(520, viewportHeight - (isDesktop ? 210 : isTablet ? 190 : 170));
  const selectedChurchIds = useMemo(() => new Set(drafts.map((draft) => draft.church.id)), [drafts]);

  useEffect(
    /** Loads existing subscriptions once and uses them as both the mutation baseline and selected drafts. */
    function loadInitialSubscriptions() {
      let active = true;
      void getChurchSubscriptions()
        .then((subscriptions) => {
          if (!active) return;
          setExistingSubscriptions(subscriptions);
          setDrafts(subscriptionsToDrafts(subscriptions));
          mayCelebrateInitialSetupRef.current = subscriptions.length === 0;
        })
        .catch((error) => {
          logDevelopmentError("loading church subscriptions", error);
          if (active) {
            setErrorMessage(
              error instanceof ChurchApiError && error.status === 401
                ? t("churches.errors.authentication")
                : t("churches.errors.load"),
            );
          }
        })
        .finally(() => {
          if (active) setIsLoadingSubscriptions(false);
        });
      return () => {
        active = false;
      };
    },
    [t],
  );

  /** Returns the localized user-facing message for known church API failures. */
  function translateApiError(error: unknown, fallbackKey: string): string {
    if (error instanceof ChurchApiError) {
      if (
        error.code?.includes("DUPLICATE") ||
        error.code?.includes("ALREADY_SUBSCRIBED") ||
        error.code?.includes("ALREADY_EXISTS")
      ) {
        return t("churches.errors.duplicate");
      }
      if (error.code === "CHURCH_SUBSCRIPTION_LIMIT" || error.status === 409) return t("churches.errors.limit");
      if (error.status === 401) return t("churches.errors.authentication");
      if (error.status === 404) return t("churches.errors.unavailable");
    }
    return t(fallbackKey);
  }

  /** Resets stale map and result state whenever the ZIP no longer matches the submitted location. */
  function handlePostalCodeChange(value: string): void {
    setPostalCode(value);
    if (!hasSearched && !resolvedPostalCode) return;
    if (value.trim() === resolvedPostalCode?.postalCode) return;
    setResolvedPostalCode(null);
    setSelectedCity("");
    setSelectedDioceseId("");
    setResults([]);
    setNextOffset(null);
    setSelectedDetails(null);
    setHasSearched(false);
    setView("list");
    setSheetSnap("peek");
  }

  /** Performs either ZIP-based discovery or a q-only anywhere search at the requested offset. */
  async function runSearch(offset = 0): Promise<void> {
    const cleanPostalCode = postalCode.trim();
    const cleanQuery = query.trim();
    if (cleanPostalCode && !/^\d{5}$/u.test(cleanPostalCode)) {
      setErrorMessage(t("churches.search.invalidZip"));
      return;
    }
    if (!cleanPostalCode && !cleanQuery) {
      setErrorMessage(t("churches.search.invalid"));
      return;
    }
    const loadingMore = offset > 0;
    if (loadingMore) setIsLoadingMore(true);
    else setIsSearching(true);
    setErrorMessage(null);
    try {
      let location = resolvedPostalCode;
      if (cleanPostalCode && (!location || location.postalCode !== cleanPostalCode)) {
        location = await resolvePostalCode(cleanPostalCode);
        setResolvedPostalCode(location);
        setSelectedCity("");
        setSelectedDioceseId("");
      }
      const page = await searchChurches({
        ...(cleanPostalCode
          ? {
              country: "US",
              ...(selectedCity ? { city: selectedCity } : {}),
              ...(selectedDioceseId ? { dioceseId: selectedDioceseId } : {}),
              postalCode: cleanPostalCode,
              radiusMiles: DEFAULT_RADIUS_MILES,
            }
          : {}),
        ...(cleanQuery ? { q: cleanQuery } : {}),
        limit: SEARCH_PAGE_SIZE,
        offset,
      });
      setResults((current) => (loadingMore ? [...current, ...page.data] : page.data));
      setNextOffset(page.meta.nextOffset);
      setSelectedDetails(null);
      setHasSearched(true);
      if (!loadingMore) {
        setView(cleanPostalCode ? "map" : "list");
        setSheetSnap(cleanPostalCode ? (page.data.length === 0 ? "middle" : "peek") : "expanded");
      }
    } catch (error) {
      logDevelopmentError("searching churches", error);
      setErrorMessage(translateApiError(error, "churches.errors.search"));
    } finally {
      if (loadingMore) setIsLoadingMore(false);
      else setIsSearching(false);
    }
  }

  /** Loads and selects a church from either the map marker or list row. */
  async function selectChurch(churchId: string): Promise<void> {
    const summary =
      results.find((church) => church.id === churchId) ?? drafts.find((draft) => draft.church.id === churchId)?.church;
    if (!summary) return;
    setIsDetailsLoading(true);
    setDetailsLoadFailed(false);
    setErrorMessage(null);
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
      setErrorMessage(translateApiError(error, "churches.errors.details"));
    } finally {
      setIsDetailsLoading(false);
    }
  }

  /** Keeps the full map visible at peek and expands the sheet when list browsing is selected. */
  function changeDiscoveryView(nextView: DiscoveryView): void {
    if (nextView === "map" && !resolvedPostalCode) return;
    setSelectedDetails(null);
    setView(nextView);
    setSheetSnap(nextView === "map" ? "peek" : "expanded");
  }

  /** Returns from church details to the current result mode without discarding search state. */
  function closeChurchDetails(): void {
    setSelectedDetails(null);
    setSheetSnap(view === "map" ? "middle" : "expanded");
  }

  /** Switches primary church tabs while preserving search results and reminder drafts. */
  function changeStage(nextStage: ScreenStage): void {
    setErrorMessage(null);
    setStage(nextStage);
  }

  /** Adds or removes the selected church while enforcing the backend's three-subscription maximum locally. */
  function toggleSelectedChurch(church: ChurchSummary): void {
    if (selectedChurchIds.has(church.id)) {
      setDrafts((current) => current.filter((draft) => draft.church.id !== church.id));
      return;
    }
    if (drafts.length >= MAX_SUBSCRIPTIONS) {
      setErrorMessage(t("churches.errors.limit"));
      return;
    }
    setErrorMessage(null);
    setDrafts((current) => [...current, { church, notificationWeekdays: [], serviceTypes: [] }]);
  }

  /** Toggles one service preference without changing other church drafts. */
  function toggleServiceType(churchId: string, serviceType: ChurchServiceType): void {
    setDrafts((current) =>
      current.map((draft) =>
        draft.church.id !== churchId
          ? draft
          : {
              ...draft,
              serviceTypes: draft.serviceTypes.includes(serviceType)
                ? draft.serviceTypes.filter((value) => value !== serviceType)
                : [...draft.serviceTypes, serviceType],
            },
      ),
    );
  }

  /** Toggles one notification weekday without changing other church drafts. */
  function toggleWeekday(churchId: string, weekday: NotificationWeekday): void {
    setDrafts((current) =>
      current.map((draft) =>
        draft.church.id !== churchId
          ? draft
          : {
              ...draft,
              notificationWeekdays: draft.notificationWeekdays.includes(weekday)
                ? draft.notificationWeekdays.filter((value) => value !== weekday)
                : [...draft.notificationWeekdays, weekday],
            },
      ),
    );
  }

  /** Executes one normalized subscription mutation against the matching public endpoint. */
  async function executeOperation(
    operation: ReturnType<typeof buildSubscriptionOperations>[number],
  ): Promise<ChurchSubscription | null> {
    if (operation.kind === "delete") {
      await deleteChurchSubscription(operation.church.id);
      return null;
    } else if (operation.kind === "create") {
      return createChurchSubscription({
        churchId: operation.church.id,
        notificationWeekdays: operation.notificationWeekdays,
        serviceTypes: operation.serviceTypes,
      });
    } else {
      return updateChurchSubscription(operation.church.id, {
        notificationWeekdays: operation.notificationWeekdays,
        serviceTypes: operation.serviceTypes,
      });
    }
  }

  /** Applies one fulfilled mutation to the local comparison baseline used by partial retries. */
  function applySuccessfulOperation(
    baseline: ChurchSubscription[],
    operation: ReturnType<typeof buildSubscriptionOperations>[number],
    response: ChurchSubscription | null | undefined,
  ): ChurchSubscription[] {
    const withoutChurch = baseline.filter((subscription) => subscription.churchId !== operation.church.id);
    if (operation.kind === "delete") return withoutChurch;
    const previous = baseline.find((subscription) => subscription.churchId === operation.church.id);
    const subscription = response ?? {
      church: operation.church,
      churchId: operation.church.id,
      notificationWeekdays: [...operation.notificationWeekdays],
      scheduleReady: previous?.scheduleReady ?? operation.church.scheduleStatus === "verified",
      serviceTypes: [...operation.serviceTypes],
    };
    return [...withoutChurch, subscription];
  }

  /** Saves the minimal subscription diff and celebrates only an entirely successful first-time setup. */
  async function completeSetup(): Promise<void> {
    if (drafts.some((draft) => draft.serviceTypes.length === 0 || draft.notificationWeekdays.length === 0)) {
      setErrorMessage(t("churches.setup.validation"));
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    setMutationFailures([]);
    const operations = buildSubscriptionOperations(existingSubscriptions, drafts);
    const resultsByOperation = await Promise.allSettled(operations.map(executeOperation));
    let nextBaseline = [...existingSubscriptions];
    const failures: MutationFailure[] = [];
    resultsByOperation.forEach((result, index) => {
      const operation = operations[index]!;
      if (result.status === "fulfilled") {
        nextBaseline = applySuccessfulOperation(nextBaseline, operation, result.value);
      } else {
        failures.push({
          churchId: operation.church.id,
          message: translateApiError(result.reason, "churches.errors.save"),
          name: operation.church.name,
        });
      }
    });
    setExistingSubscriptions(nextBaseline);
    if (failures.length > 0) {
      setMutationFailures(failures);
      setIsSaving(false);
      return;
    }
    if (mayCelebrateInitialSetupRef.current && drafts.length > 0) {
      queueAchievement({ type: "church-reminders-configured" });
      mayCelebrateInitialSetupRef.current = false;
    } else {
      queueAchievement({ type: "church-reminders-updated" });
    }
    setIsSaving(false);
    router.replace("/home");
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

  return (
    <ScreenShell
      backAccessibilityLabel={t("common.back")}
      contentContainerStyle={styles.content}
      description={t("churches.description")}
      headerVariant="compact"
      onBack={() => router.back()}
      title={t("churches.title")}
    >
      <View accessibilityRole="tablist" style={styles.primaryTabs}>
        {(["discover", "preferences"] as const).map((option) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: stage === option }}
            key={option}
            onPress={() => changeStage(option)}
            style={[styles.primaryTab, stage === option && styles.primaryTabSelected]}
          >
            <Text style={styles.primaryTabText}>
              {t(option === "discover" ? "churches.search.title" : "churches.setup.review")}
            </Text>
          </Pressable>
        ))}
      </View>

      {stage === "discover" ? (
        <View style={[styles.discoveryPanel, { height: discoveryPanelHeight }]}>
          <View style={styles.discoveryBackground}>
            {resolvedPostalCode ? (
              <ChurchMap
                center={mapCenter}
                dom={{ scrollEnabled: false, style: { height: discoveryPanelHeight } }}
                markers={mapMarkers}
                onSelectChurch={selectChurch}
                selectedChurchId={selectedDetails?.id}
              />
            ) : (
              <ChurchDiscoveryGlobe />
            )}
          </View>

          <View style={styles.searchOverlay}>
            <Card subtitle={t("churches.search.description")}>
              <View style={styles.formStack}>
                <View style={[styles.searchFields, isDesktop && styles.searchFieldsDesktop]}>
                  <View style={styles.searchField}>
                    <Text style={styles.label}>{t("churches.search.zipLabel")}</Text>
                    <TextInput
                      accessibilityLabel={t("churches.search.zipLabel")}
                      inputMode="numeric"
                      maxLength={5}
                      onChangeText={handlePostalCodeChange}
                      placeholder={t("churches.search.zipPlaceholder")}
                      placeholderTextColor={theme.colors.text.muted}
                      style={styles.input}
                      value={postalCode}
                    />
                  </View>
                  <View style={styles.searchField}>
                    <Text style={styles.label}>{t("churches.search.queryLabel")}</Text>
                    <TextInput
                      accessibilityLabel={t("churches.search.queryLabel")}
                      onChangeText={setQuery}
                      placeholder={t("churches.search.queryPlaceholder")}
                      placeholderTextColor={theme.colors.text.muted}
                      style={styles.input}
                      value={query}
                    />
                  </View>
                </View>
                <Button fullWidth loading={isSearching} onPress={() => void runSearch()}>
                  {isSearching ? t("churches.search.searching") : t("churches.search.action")}
                </Button>
                {resolvedPostalCode ? (
                  <View style={styles.filterStack}>
                    <Text style={styles.locationText}>
                      {t("churches.search.resolved", {
                        city: resolvedPostalCode.primaryCity,
                        region: resolvedPostalCode.regionCodes[0],
                      })}
                    </Text>
                    <Text style={styles.label}>{t("churches.filters.city")}</Text>
                    <View style={styles.chips}>
                      {[{ name: "" }, ...resolvedPostalCode.cities].map((city) => (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ checked: selectedCity === city.name }}
                          key={city.name || "all-cities"}
                          onPress={() => setSelectedCity(city.name)}
                          style={[styles.chip, selectedCity === city.name && styles.chipSelected]}
                        >
                          <Text style={styles.chipText}>{city.name || t("churches.filters.allCities")}</Text>
                        </Pressable>
                      ))}
                    </View>
                    {resolvedPostalCode.dioceses.length > 0 ? (
                      <>
                        <Text style={styles.label}>{t("churches.filters.diocese")}</Text>
                        <View style={styles.chips}>
                          {[{ id: "", name: t("churches.filters.allDioceses") }, ...resolvedPostalCode.dioceses].map(
                            (diocese) => (
                              <Pressable
                                accessibilityRole="radio"
                                accessibilityState={{ checked: selectedDioceseId === diocese.id }}
                                key={diocese.id || "all-dioceses"}
                                onPress={() => setSelectedDioceseId(diocese.id)}
                                style={[styles.chip, selectedDioceseId === diocese.id && styles.chipSelected]}
                              >
                                <Text style={styles.chipText}>{diocese.name}</Text>
                              </Pressable>
                            ),
                          )}
                        </View>
                      </>
                    ) : null}
                  </View>
                ) : null}
                {errorMessage ? (
                  <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.errorText}>
                    {errorMessage}
                  </Text>
                ) : null}
              </View>
            </Card>
          </View>

          {hasSearched ? (
            <ChurchResultsSheet
              onSnapChange={setSheetSnap}
              panelHeight={discoveryPanelHeight}
              snap={sheetSnap}
              summary={t("churches.results.selectedCount", { count: drafts.length })}
              title={t("churches.results.title")}
            >
              {resolvedPostalCode && !selectedDetails ? (
                <View accessibilityRole="tablist" style={styles.tabs}>
                  {(["map", "list"] as const).map((option) => (
                    <Pressable
                      accessibilityRole="tab"
                      accessibilityState={{ selected: view === option }}
                      key={option}
                      onPress={() => changeDiscoveryView(option)}
                      style={[styles.tab, view === option && styles.tabSelected]}
                    >
                      <Text style={styles.tabText}>{t(`churches.results.${option}`)}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

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
                          {`${t(`churches.weekdays.${service.weekday}`)} · ${t(`churches.services.${service.serviceType}`)} · ${formatRecurringTime(
                            service.startTime,
                            i18n.resolvedLanguage === "es" ? "es-MX" : "en-US",
                          )}`}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                  {detailsLoadFailed ? (
                    <Button fullWidth onPress={() => void selectChurch(selectedDetails.id)} variant="outline">
                      {t("churches.errors.retryDetails")}
                    </Button>
                  ) : (
                    <Button
                      disabled={!selectedDetails.isActive}
                      fullWidth
                      onPress={() => toggleSelectedChurch(selectedDetails)}
                      variant={selectedChurchIds.has(selectedDetails.id) ? "outline" : "primary"}
                    >
                      {t(
                        selectedChurchIds.has(selectedDetails.id)
                          ? "churches.results.remove"
                          : "churches.results.select",
                      )}
                    </Button>
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
        </View>
      ) : (
        <View style={[styles.screenStack, styles.reviewPanel]}>
          {isLoadingSubscriptions ? <ActivityIndicator color={theme.colors.brand.primaryLight} /> : null}
          {!isLoadingSubscriptions && drafts.length === 0 ? (
            <Card title={t("churches.setup.emptyTitle")}>
              <View style={styles.formStack}>
                <Text style={styles.muted}>{t("churches.setup.none")}</Text>
                <Button fullWidth onPress={() => changeStage("discover")} variant="outline">
                  {t("churches.setup.backToSearch")}
                </Button>
              </View>
            </Card>
          ) : null}
          {drafts.length > 0 ? (
            <Card subtitle={t("churches.setup.description")} title={t("churches.setup.title")}>
              <View style={styles.screenStack}>
                {drafts.map((draft) => (
                  <View key={draft.church.id} style={styles.preferenceCard}>
                    <View style={styles.preferenceHeader}>
                      <View style={styles.resultCopy}>
                        <Text style={styles.resultName}>{draft.church.name}</Text>
                        <Text style={styles.muted}>{formatChurchAddress(draft.church)}</Text>
                      </View>
                      <Pressable
                        accessibilityLabel={`${t("churches.results.remove")} ${draft.church.name}`}
                        accessibilityRole="button"
                        hitSlop={theme.spacing[2]}
                        onPress={() => toggleSelectedChurch(draft.church)}
                        style={styles.iconButton}
                      >
                        <Feather accessible={false} color={theme.colors.semantic.danger} name="trash-2" size={20} />
                      </Pressable>
                    </View>
                    {draft.church.scheduleStatus !== "verified" ? (
                      <Text style={styles.warningText}>{t("churches.setup.schedulePending")}</Text>
                    ) : null}
                    <Text style={styles.label}>{t("churches.setup.serviceTypes")}</Text>
                    <View style={styles.chips}>
                      {CHURCH_SERVICE_TYPES.map((serviceType) => (
                        <Pressable
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: draft.serviceTypes.includes(serviceType) }}
                          key={serviceType}
                          onPress={() => toggleServiceType(draft.church.id, serviceType)}
                          style={[styles.chip, draft.serviceTypes.includes(serviceType) && styles.chipSelected]}
                        >
                          <Text style={styles.chipText}>{t(`churches.services.${serviceType}`)}</Text>
                        </Pressable>
                      ))}
                    </View>
                    <Text style={styles.label}>{t("churches.setup.weekdays")}</Text>
                    <View style={styles.chips}>
                      {NOTIFICATION_WEEKDAYS.map((weekday) => (
                        <Pressable
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: draft.notificationWeekdays.includes(weekday) }}
                          key={weekday}
                          onPress={() => toggleWeekday(draft.church.id, weekday)}
                          style={[styles.chip, draft.notificationWeekdays.includes(weekday) && styles.chipSelected]}
                        >
                          <Text style={styles.chipText}>{t(`churches.weekdays.${weekday}`)}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ) : null}
          {errorMessage ? (
            <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}
          {mutationFailures.map((failure) => (
            <Text
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
              key={failure.churchId}
              style={styles.errorText}
            >
              {`${failure.name}: ${failure.message}`}
            </Text>
          ))}
          {!isLoadingSubscriptions && (drafts.length > 0 || existingSubscriptions.length > 0) ? (
            <Button fullWidth loading={isSaving} onPress={() => void completeSetup()}>
              {isSaving
                ? t("churches.setup.saving")
                : mutationFailures.length > 0
                  ? t("churches.errors.retrySave")
                  : t("churches.setup.complete")}
            </Button>
          ) : null}
        </View>
      )}
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  chip: {
    alignItems: "center",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  chipSelected: { backgroundColor: theme.colors.surface.green, borderColor: theme.colors.semantic.successBorder },
  chipText: { ...theme.typography.bodySmall, color: theme.colors.text.primary, textAlign: "center" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] },
  content: { maxWidth: 1100 },
  discoveryBackground: { height: "100%", width: "100%" },
  discoveryPanel: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    padding: theme.spacing[4],
    textAlign: "center",
  },
  errorText: { ...theme.typography.bodySmall, color: theme.colors.semantic.danger },
  filterStack: { gap: theme.spacing[2] },
  formStack: { gap: theme.spacing[3] },
  iconButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text.primary,
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  label: { ...theme.typography.label, color: theme.colors.text.primary },
  liveText: { ...theme.typography.bodySmall, color: theme.colors.semantic.success, fontWeight: "700" },
  locationText: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  muted: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  preferenceCard: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[3],
    padding: theme.spacing[3],
  },
  preferenceHeader: { alignItems: "flex-start", flexDirection: "row", gap: theme.spacing[2] },
  primaryTab: {
    alignItems: "center",
    borderRadius: theme.radii.md,
    flex: 1,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[2],
  },
  primaryTabSelected: { backgroundColor: theme.colors.surface.green },
  primaryTabText: { ...theme.typography.label, color: theme.colors.text.primary, textAlign: "center" },
  primaryTabs: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.lg,
    flexDirection: "row",
    gap: theme.spacing[1],
    marginBottom: theme.spacing[3],
    padding: theme.spacing[1],
  },
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
  reviewPanel: { paddingBottom: theme.spacing[4] },
  searchField: { flex: 1, gap: theme.spacing[1], minWidth: 0 },
  searchFields: { gap: theme.spacing[2] },
  searchFieldsDesktop: { flexDirection: "row" },
  searchOverlay: {
    left: theme.spacing[3],
    maxWidth: 720,
    position: "absolute",
    right: theme.spacing[3],
    top: theme.spacing[3],
    zIndex: theme.zIndex.sticky,
  },
  screenStack: { gap: theme.spacing[4] },
  statusText: { ...theme.typography.bodySmall, color: theme.colors.semantic.info },
  tab: {
    alignItems: "center",
    borderRadius: theme.radii.md,
    flex: 1,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
  },
  tabSelected: { backgroundColor: theme.colors.surface.green },
  tabText: { ...theme.typography.label, color: theme.colors.text.primary },
  tabs: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.md,
    flexDirection: "row",
    gap: theme.spacing[1],
    padding: theme.spacing[1],
  },
  warningText: { ...theme.typography.bodySmall, color: theme.colors.semantic.warning },
}));
