import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView, View } from "react-native";

import { PageHeader } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { SacredAtmosphere } from "@/components/ui";
import { LeaderboardCard } from "@/features/dashboard/components";
import {
  getWeeklyGlobalLeaderboard,
  getYearlyGlobalLeaderboard,
  parseGlobalLeaderboardData,
} from "@/features/dashboard/dashboard.api";
import type { LeaderboardEntryViewModel } from "@/features/dashboard/dashboard.types";
import { AllMysteries, GlobalRosaryStatsCard, MomentForPrayer, PrayersByOthers } from "@/features/prayer/components";
import { getGlobalRosaryStats } from "@/features/prayer/data/globalRosaryStats.api";
import type { GlobalRosaryStats } from "@/features/prayer/data/globalRosaryStats.api";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import {
  cacheApprovedPrayerIntentions,
  fetchApprovedPrayerIntentions,
  parseApprovedPrayerIntentionsPage,
} from "@/features/prayer/intentions";
import { fetchScreenData } from "@/features/screen-data";
import type { ScreenDataResponse } from "@/features/screen-data";
import { logDevelopmentError } from "@/lib/development-logger";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { getRosaryMysterySetFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import { getTodayRosaryMysteryType, getWeekdayLabel } from "@/features/prayer/rosary/data/schedule";
import { RosaryGardenSection } from "@/features/prayer/rosary/garden/components";
import { useRosaryArtStylePreference } from "@/features/prayer/rosary/hooks/useRosaryArtStylePreference";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useCurrentLocalDate, useResponsiveLayout } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const previewLimit = 10;

/** Parses an ISO calendar date as local noon so weekday selection never crosses a timezone boundary. */
function localIsoDateToDate(localIsoDate: string) {
  const [year, month, day] = localIsoDate.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

/** Appends newly fetched intentions without duplicating cards when pages overlap. */
function appendUniqueIntentions(
  currentIntentions: ApprovedPrayerIntention[],
  incomingIntentions: ApprovedPrayerIntention[],
) {
  const currentIds = new Set(currentIntentions.map((intention) => intention.id));
  return [...currentIntentions, ...incomingIntentions.filter((intention) => !currentIds.has(intention.id))];
}

/** Renders the daily Prayer page with its Rosary Garden, global activity, mysteries, and intentions. */
export function PrayerScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language, locale } = useAppLanguage();
  const { rosaryArtStyle } = useRosaryArtStylePreference();
  const router = useRouter();
  const { contentWidth, gutter, isDesktop, isLargeText, isNarrowPhone, isTablet, width } = useResponsiveLayout();
  const [intentions, setIntentions] = useState<ApprovedPrayerIntention[]>([]);
  const [isLoadingIntentions, setIsLoadingIntentions] = useState(true);
  const [isLoadingMoreIntentions, setIsLoadingMoreIntentions] = useState(false);
  const [intentionsError, setIntentionsError] = useState<string>();
  const [globalStats, setGlobalStats] = useState<GlobalRosaryStats | null>(null);
  const [globalStatsError, setGlobalStatsError] = useState(false);
  const [isGlobalStatsLoading, setIsGlobalStatsLoading] = useState(true);
  const [isWeeklyLeaderboardLoading, setIsWeeklyLeaderboardLoading] = useState(true);
  const [isYearlyLeaderboardLoading, setIsYearlyLeaderboardLoading] = useState(true);
  const [hasMoreIntentions, setHasMoreIntentions] = useState(false);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntryViewModel[] | null>(null);
  const [yearlyLeaderboard, setYearlyLeaderboard] = useState<LeaderboardEntryViewModel[] | null>(null);
  const [weeklyLeaderboardError, setWeeklyLeaderboardError] = useState(false);
  const [yearlyLeaderboardError, setYearlyLeaderboardError] = useState(false);
  const [nextIntentionsOffset, setNextIntentionsOffset] = useState<number | null>(null);
  const [initialScreenData, setInitialScreenData] = useState<ScreenDataResponse>();
  const [isInitialScreenLoadSettled, setIsInitialScreenLoadSettled] = useState(false);
  const isLoadingMoreIntentionsRef = useRef(false);
  const globalStatsLayoutRef = useRef<{ height: number; y: number } | null>(null);
  const globalStatsRequestIdRef = useRef(0);
  const hasRequestedGlobalStatsRef = useRef(false);
  const scrollViewportRef = useRef({ height: 0, offsetY: 0 });
  const weeklyLeaderboardRequestIdRef = useRef(0);
  const yearlyLeaderboardRequestIdRef = useRef(0);
  const currentLocalDate = useCurrentLocalDate();
  const today = useMemo(() => localIsoDateToDate(currentLocalDate), [currentLocalDate]);
  const todayMysteryType = getTodayRosaryMysteryType(today);
  const rosaryContent = useMemo(() => getRosaryContent(language), [language]);
  const todaySet = useMemo(
    () => getRosaryMysterySetFromContent(rosaryContent, todayMysteryType, rosaryArtStyle),
    [rosaryArtStyle, rosaryContent, todayMysteryType],
  );
  const columnGap = theme.spacing[2];
  const containerMaxWidth = isDesktop ? 960 : isTablet ? 760 : width;
  const usableWidth = Math.max(0, Math.min(contentWidth, containerMaxWidth) - gutter * 2);
  const mysteryColumns = isDesktop ? 4 : isLargeText || isNarrowPhone ? 1 : 2;
  const mysteryCardWidth = Math.max(
    theme.sizes.touchTarget * 3,
    (usableWidth - columnGap * (mysteryColumns - 1)) / mysteryColumns,
  );

  /** Loads Prayer's first visible sections in a single authenticated request. */
  useEffect(() => {
    let active = true;
    void fetchScreenData({ screen: "prayer", selectedMonth: today.getMonth() + 1, selectedYear: today.getFullYear() })
      .then((data) => {
        if (active) setInitialScreenData(data);
      })
      .catch((error) => {
        logDevelopmentError("loading Prayer aggregate data", error);
        // Individual initial loaders retain the existing offline and retry behavior.
      })
      .finally(() => {
        if (active) setIsInitialScreenLoadSettled(true);
      });
    return () => {
      active = false;
    };
  }, [today]);

  /** Loads the approved prayer intentions shown in the home-screen preview. */
  const loadIntentions = useCallback(async () => {
    setIntentionsError(undefined);
    setIsLoadingIntentions(true);
    setHasMoreIntentions(false);
    setNextIntentionsOffset(null);
    try {
      const section = initialScreenData?.sections.prayerIntentions;
      const page = section
        ? parseApprovedPrayerIntentionsPage(section.data, section.meta)
        : await fetchApprovedPrayerIntentions({ limit: previewLimit });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions(page.data);
      setHasMoreIntentions(page.meta.hasMore);
      setNextIntentionsOffset(page.meta.nextOffset);
    } catch (error) {
      logDevelopmentError("loading approved prayer intentions", error);
      setIntentionsError(error instanceof Error ? error.message : t("prayerHome.intentionsLoadError"));
    } finally {
      setIsLoadingIntentions(false);
    }
  }, [initialScreenData, t]);

  useEffect(() => {
    if (isInitialScreenLoadSettled) void loadIntentions();
  }, [isInitialScreenLoadSettled, loadIntentions]);

  /** Loads global Rosary statistics after the card has entered the visible scroll viewport. */
  const loadGlobalStats = useCallback(async () => {
    const requestId = ++globalStatsRequestIdRef.current;
    setIsGlobalStatsLoading(true);
    setGlobalStatsError(false);
    setGlobalStats(null);

    try {
      const nextStats = await getGlobalRosaryStats();
      if (requestId !== globalStatsRequestIdRef.current) return;
      setGlobalStats(nextStats);
    } catch (error) {
      logDevelopmentError("loading global Rosary statistics", error);
      if (requestId !== globalStatsRequestIdRef.current) return;
      setGlobalStatsError(true);
    } finally {
      if (requestId === globalStatsRequestIdRef.current) setIsGlobalStatsLoading(false);
    }
  }, []);

  /** Starts the one-time deferred request when any part of the statistics card is visible. */
  const loadGlobalStatsIfVisible = useCallback(() => {
    if (hasRequestedGlobalStatsRef.current) return;

    const cardLayout = globalStatsLayoutRef.current;
    const viewport = scrollViewportRef.current;
    if (!cardLayout || viewport.height <= 0) return;

    const viewportBottom = viewport.offsetY + viewport.height;
    const cardBottom = cardLayout.y + cardLayout.height;
    if (cardLayout.y >= viewportBottom || cardBottom <= viewport.offsetY) return;

    hasRequestedGlobalStatsRef.current = true;
    void loadGlobalStats();
  }, [loadGlobalStats]);

  /** Records the visible height of the Prayer page's vertical scroll viewport. */
  const handleScrollLayout = useCallback(
    (event: LayoutChangeEvent) => {
      scrollViewportRef.current.height = event.nativeEvent.layout.height;
      loadGlobalStatsIfVisible();
    },
    [loadGlobalStatsIfVisible],
  );

  /** Tracks vertical scrolling and evaluates whether the deferred statistics card is visible. */
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollViewportRef.current.offsetY = Math.max(0, event.nativeEvent.contentOffset.y);
      loadGlobalStatsIfVisible();
    },
    [loadGlobalStatsIfVisible],
  );

  /** Records the card's content coordinates and evaluates its initial visibility. */
  const handleGlobalStatsLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height, y } = event.nativeEvent.layout;
      globalStatsLayoutRef.current = { height, y };
      loadGlobalStatsIfVisible();
    },
    [loadGlobalStatsIfVisible],
  );

  /** Retries the already-revealed global statistics request after a failure. */
  const retryGlobalStats = useCallback(() => {
    void loadGlobalStats();
  }, [loadGlobalStats]);

  useEffect(
    /** Invalidates an in-flight deferred request when the Prayer screen unmounts. */
    function registerGlobalStatsCleanup() {
      /** Marks any outstanding response as stale before React releases the screen state. */
      return function invalidateGlobalStatsRequest() {
        globalStatsRequestIdRef.current += 1;
      };
    },
    [],
  );

  /** Loads weekly global leaders while ignoring results from an older overlapping request. */
  const loadWeeklyLeaderboard = useCallback(async () => {
    const requestId = ++weeklyLeaderboardRequestIdRef.current;
    setIsWeeklyLeaderboardLoading(true);
    setWeeklyLeaderboardError(false);
    try {
      const section = initialScreenData?.sections.weeklyGlobalLeaderboard;
      const entries = section ? parseGlobalLeaderboardData(section.data) : await getWeeklyGlobalLeaderboard();
      if (requestId !== weeklyLeaderboardRequestIdRef.current) return;
      setWeeklyLeaderboard(entries);
    } catch (error) {
      logDevelopmentError("loading the weekly global leaderboard", error);
      if (requestId !== weeklyLeaderboardRequestIdRef.current) return;
      setWeeklyLeaderboard(null);
      setWeeklyLeaderboardError(true);
    } finally {
      if (requestId === weeklyLeaderboardRequestIdRef.current) setIsWeeklyLeaderboardLoading(false);
    }
  }, [initialScreenData]);

  /** Loads yearly global leaders while ignoring results from an older overlapping request. */
  const loadYearlyLeaderboard = useCallback(async () => {
    const requestId = ++yearlyLeaderboardRequestIdRef.current;
    setIsYearlyLeaderboardLoading(true);
    setYearlyLeaderboardError(false);
    try {
      const section = initialScreenData?.sections.yearlyGlobalLeaderboard;
      const entries = section ? parseGlobalLeaderboardData(section.data) : await getYearlyGlobalLeaderboard();
      if (requestId !== yearlyLeaderboardRequestIdRef.current) return;
      setYearlyLeaderboard(entries);
    } catch (error) {
      logDevelopmentError("loading the yearly global leaderboard", error);
      if (requestId !== yearlyLeaderboardRequestIdRef.current) return;
      setYearlyLeaderboard(null);
      setYearlyLeaderboardError(true);
    } finally {
      if (requestId === yearlyLeaderboardRequestIdRef.current) setIsYearlyLeaderboardLoading(false);
    }
  }, [initialScreenData]);

  useFocusEffect(
    useCallback(() => {
      if (isInitialScreenLoadSettled) {
        void loadWeeklyLeaderboard();
        void loadYearlyLeaderboard();
      }

      /** Invalidates in-flight leaderboard responses after the Prayer page loses focus. */
      return () => {
        weeklyLeaderboardRequestIdRef.current += 1;
        yearlyLeaderboardRequestIdRef.current += 1;
      };
    }, [isInitialScreenLoadSettled, loadWeeklyLeaderboard, loadYearlyLeaderboard]),
  );

  /** Loads and appends the next intention page when the horizontal carousel approaches its end. */
  const loadMoreIntentions = useCallback(async () => {
    if (!hasMoreIntentions || nextIntentionsOffset === null || isLoadingMoreIntentionsRef.current) return;

    isLoadingMoreIntentionsRef.current = true;
    setIsLoadingMoreIntentions(true);
    setIntentionsError(undefined);
    try {
      const page = await fetchApprovedPrayerIntentions({ limit: previewLimit, offset: nextIntentionsOffset });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions((currentIntentions) => appendUniqueIntentions(currentIntentions, page.data));
      setHasMoreIntentions(page.meta.hasMore);
      setNextIntentionsOffset(page.meta.nextOffset);
    } catch (error) {
      logDevelopmentError("loading more approved prayer intentions", error);
      setIntentionsError(error instanceof Error ? error.message : t("prayerHome.intentionsMoreError"));
    } finally {
      isLoadingMoreIntentionsRef.current = false;
      setIsLoadingMoreIntentions(false);
    }
  }, [hasMoreIntentions, nextIntentionsOffset, t]);

  /** Opens a full Rosary for the selected mystery set and records its launch source. */
  const openRosary = (mysteryType: RosaryMysteryType, source: "today" | "manual") => {
    router.push({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType, source },
    });
  };

  /** Starts today's scheduled Rosary. */
  const prayToday = () => {
    openRosary(todayMysteryType, "today");
  };

  /** Starts a manually selected mystery set. */
  const openMystery = (mysteryType: RosaryMysteryType) => {
    openRosary(mysteryType, "manual");
  };

  /** Opens the complete public prayer-intentions feed. */
  const seeAllIntentions = () => {
    router.push("/prayer-intentions");
  };

  /** Opens a selected public intention in its Rosary flow. */
  const openIntention = (intentionId: string) => {
    router.push({
      pathname: "/intention-rosary",
      params: { intentionId },
    });
  };

  /** Opens the form for sharing a new prayer intention. */
  const createIntention = () => {
    router.push("/create-prayer-intention");
  };

  /** Opens the current user's prayer intentions. */
  const openMyIntentions = () => {
    router.push("/my-prayer-intentions");
  };

  /** Retries the public prayer-intention request after a failure. */
  const retryIntentions = () => {
    void loadIntentions();
  };

  return (
    <AtmosphericSafeAreaView edges={["top"]} includeAtmosphere={false} style={styles.safeArea}>
      <LinearGradient colors={theme.colors.gradients.prayerHome} style={styles.background}>
        <SacredAtmosphere />
        <ScrollView
          contentContainerStyle={[styles.content, { maxWidth: containerMaxWidth, paddingHorizontal: gutter }]}
          onLayout={handleScrollLayout}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.atmosphereContent}
          testID="prayer-home-scroll"
        >
          <PageHeader description={t("prayerHome.description")} title={t("prayerHome.title")} />
          <View testID="prayer-section-today">
            <MomentForPrayer
              mysteryImageSource={todaySet.imageSource}
              mysteryTitle={todaySet.title}
              onPrayToday={prayToday}
              weekday={getWeekdayLabel(today, locale)}
            />
          </View>
          <View testID="prayer-section-garden">
            <RosaryGardenSection initialData={initialScreenData} onPrayToday={prayToday} />
          </View>
          <View testID="prayer-section-global-leaderboard">
            <LeaderboardCard
              isWeeklyLoading={isWeeklyLeaderboardLoading}
              isYearlyLoading={isYearlyLeaderboardLoading}
              onRetryWeekly={() => void loadWeeklyLeaderboard()}
              onRetryYearly={() => void loadYearlyLeaderboard()}
              weeklyEntries={weeklyLeaderboard}
              weeklyError={weeklyLeaderboardError}
              yearlyEntries={yearlyLeaderboard}
              yearlyError={yearlyLeaderboardError}
            />
          </View>
          <View testID="prayer-section-mysteries">
            <AllMysteries cardWidth={mysteryCardWidth} gap={columnGap} onOpenMystery={openMystery} />
          </View>
          <View testID="prayer-section-intentions">
            <PrayersByOthers
              errorMessage={intentionsError}
              hasMore={hasMoreIntentions}
              intentions={intentions}
              isLoading={isLoadingIntentions}
              isLoadingMore={isLoadingMoreIntentions}
              onCreateIntention={createIntention}
              onLoadMore={loadMoreIntentions}
              onOpenIntention={openIntention}
              onOpenMyIntentions={openMyIntentions}
              onRetry={retryIntentions}
              onSeeAll={seeAllIntentions}
            />
          </View>
          <View onLayout={handleGlobalStatsLayout} testID="prayer-section-global-stats">
            <GlobalRosaryStatsCard
              error={globalStatsError}
              isLoading={isGlobalStatsLoading}
              onRetry={retryGlobalStats}
              stats={globalStats}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  background: { flex: 1, position: "relative" },
  atmosphereContent: { zIndex: theme.zIndex.card },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
  safeArea: { backgroundColor: theme.rosary.colors.canvas, flex: 1 },
}));
