import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { AppState, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DailyLiturgyDashboard } from "@/features/liturgy/screens";
import {
  AllMysteries,
  GlobalRosaryStatsCard,
  MomentForPrayer,
  PrayersByOthers,
  RosaryGuideCards,
} from "@/features/prayer/components";
import { getGlobalRosaryStats } from "@/features/prayer/data/globalRosaryStats.api";
import type { GlobalRosaryStats } from "@/features/prayer/data/globalRosaryStats.api";
import {
  cacheApprovedPrayerIntentions,
  fetchApprovedPrayerIntentions,
  parseApprovedPrayerIntentionsPage,
} from "@/features/prayer/intentions";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { RosaryGardenSection } from "@/features/prayer/rosary/garden/components";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { getRosaryMysterySetFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import { getTodayRosaryMysteryType, getWeekdayLabel, localIsoDateToDate } from "@/features/prayer/rosary/data/schedule";
import { useRosaryArtStylePreference } from "@/features/prayer/rosary/hooks/useRosaryArtStylePreference";
import { subscribeToRosaryCompletion } from "@/features/prayer/rosary/rosary-completion-events";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useCurrentProfile } from "@/features/profile";
import { logDevelopmentError } from "@/lib/development-logger";
import {
  EarnedBadgesSection,
  fetchDashboardProgress,
  fetchLevels,
  fetchRecentRosaryActivities,
  fetchRosaryStats,
  parseDashboardProgressData,
  parseLevelsData,
  parseRecentRosaryActivitiesData,
  parseRosaryStatsData,
  UserProgressSection,
} from "@/features/progress";
import { fetchScreenData } from "@/features/screen-data";
import type { ScreenDataResponse } from "@/features/screen-data";
import { useCurrentLocalDate } from "@/hooks/useCurrentLocalDate";
import { useResponsiveLayout } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { LevelCatalogEntry, RecentRosaryActivity } from "@/features/progress";
import {
  ConscienceQuestionCard,
  ActivityPointsModal,
  DailyRosaryCard,
  HolyProgressCard,
  JourneyWelcomeCard,
  LeaderboardCard,
  LevelProgressCard,
} from "./components";
import {
  getConscienceQuestion,
  getConscienceQuestions,
  getLifetimeGlobalLeaderboard,
  getRosaryReminder,
  getWeeklyGlobalLeaderboard,
  parseConscienceQuestionData,
  parseRosaryReminderData,
} from "./dashboard.api";
import type {
  ConscienceQuestionListItemViewModel,
  ConscienceQuestionViewModel,
  GlobalRosaryLeaderboard,
  RosaryReminderViewModel,
} from "./dashboard.types";

const prayerIntentionsPreviewLimit = 10;

/** Appends a new intentions page while preserving order and removing overlapping identifiers. */
function appendUniqueIntentions(
  currentIntentions: ApprovedPrayerIntention[],
  incomingIntentions: ApprovedPrayerIntention[],
) {
  const currentIds = new Set(currentIntentions.map((intention) => intention.id));
  return [...currentIntentions, ...incomingIntentions.filter((intention) => !currentIds.has(intention.id))];
}

/**
 * Composes the unified Home experience from today's Rosary through global prayer activity in accessible source order.
 *
 * Replaces unavailable Home progress and daily Rosary reminder states with a journey welcome while preserving other cards.
 */
export function HolyProgressDashboard({
  initialData,
  onGardenLayout,
}: {
  initialData?: ScreenDataResponse;
  onGardenLayout?: (event: LayoutChangeEvent) => void;
}) {
  const { t } = useTranslation();
  const { language, locale } = useAppLanguage();
  const { rosaryArtStyle } = useRosaryArtStylePreference();
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const { contentWidth, gutter, isDesktop, isLargeText, isNarrowPhone, isTablet, width } = useResponsiveLayout();
  const [conscience, setConscience] = useState<ConscienceQuestionViewModel | null>(null);
  const [conscienceQuestions, setConscienceQuestions] = useState<ConscienceQuestionListItemViewModel[]>([]);
  const [conscienceError, setConscienceError] = useState(false);
  const [conscienceQuestionsError, setConscienceQuestionsError] = useState(false);
  const [isLoadingConscience, setIsLoadingConscience] = useState(true);
  const [isLoadingConscienceQuestions, setIsLoadingConscienceQuestions] = useState(false);
  const [isLoadingHolyDetails, setIsLoadingHolyDetails] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isLoadingReminder, setIsLoadingReminder] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [levelCatalog, setLevelCatalog] = useState<LevelCatalogEntry[] | null>(null);
  const [progress, setProgress] = useState<Awaited<ReturnType<typeof fetchDashboardProgress>> | null>(null);
  const [progressError, setProgressError] = useState(false);
  const [reminder, setReminder] = useState<RosaryReminderViewModel | null>(null);
  const [reminderError, setReminderError] = useState(false);
  const [recentRosaryActivities, setRecentRosaryActivities] = useState<RecentRosaryActivity[] | null>(null);
  const [rosaryStats, setRosaryStats] = useState<Awaited<ReturnType<typeof fetchRosaryStats>> | null>(null);
  const [statsError, setStatsError] = useState(false);
  const [holyDetailsError, setHolyDetailsError] = useState(false);
  const [isActivityPointsVisible, setIsActivityPointsVisible] = useState(false);
  const [intentions, setIntentions] = useState<ApprovedPrayerIntention[]>([]);
  const [intentionsError, setIntentionsError] = useState<string>();
  const [isLoadingIntentions, setIsLoadingIntentions] = useState(true);
  const [isLoadingMoreIntentions, setIsLoadingMoreIntentions] = useState(false);
  const [hasMoreIntentions, setHasMoreIntentions] = useState(false);
  const [nextIntentionsOffset, setNextIntentionsOffset] = useState<number | null>(null);
  const [initialPrayerData, setInitialPrayerData] = useState<ScreenDataResponse>();
  const [isInitialPrayerLoadSettled, setIsInitialPrayerLoadSettled] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalRosaryStats | null>(null);
  const [globalStatsError, setGlobalStatsError] = useState(false);
  const [isGlobalStatsLoading, setIsGlobalStatsLoading] = useState(true);
  const [isLifetimeGlobalLeaderboardLoading, setIsLifetimeGlobalLeaderboardLoading] = useState(true);
  const [isWeeklyGlobalLeaderboardLoading, setIsWeeklyGlobalLeaderboardLoading] = useState(true);
  const [lifetimeGlobalLeaderboard, setLifetimeGlobalLeaderboard] = useState<GlobalRosaryLeaderboard | null>(null);
  const [weeklyGlobalLeaderboard, setWeeklyGlobalLeaderboard] = useState<GlobalRosaryLeaderboard | null>(null);
  const [lifetimeGlobalLeaderboardError, setLifetimeGlobalLeaderboardError] = useState(false);
  const [weeklyGlobalLeaderboardError, setWeeklyGlobalLeaderboardError] = useState(false);
  const isLoadingMoreIntentionsRef = useRef(false);
  const globalStatsRequestIdRef = useRef(0);
  const lifetimeGlobalLeaderboardRequestIdRef = useRef(0);
  const weeklyGlobalLeaderboardRequestIdRef = useRef(0);
  const currentLocalDate = useCurrentLocalDate();
  const today = useMemo(() => localIsoDateToDate(currentLocalDate), [currentLocalDate]);
  const todayMysteryType = getTodayRosaryMysteryType(today);
  const rosaryContent = useMemo(() => getRosaryContent(language), [language]);
  const todayMysterySet = useMemo(
    () => getRosaryMysterySetFromContent(rosaryContent, todayMysteryType, rosaryArtStyle),
    [rosaryArtStyle, rosaryContent, todayMysteryType],
  );
  const mysteryColumnGap = theme.spacing[2];
  const mysteryContainerMaxWidth = isDesktop ? 960 : isTablet ? 760 : width;
  const mysteryUsableWidth = Math.max(0, Math.min(contentWidth, mysteryContainerMaxWidth) - gutter * 2);
  const mysteryColumns = isDesktop ? 4 : isLargeText || isNarrowPhone ? 1 : 2;
  const mysteryCardWidth = Math.max(
    theme.sizes.touchTarget * 3,
    (mysteryUsableWidth - mysteryColumnGap * (mysteryColumns - 1)) / mysteryColumns,
  );

  useEffect(
    /** Loads the former Prayer page's aggregate sections for the active local day. */
    function loadPrayerAggregate() {
      let active = true;
      setInitialPrayerData(undefined);
      setIsInitialPrayerLoadSettled(false);
      void fetchScreenData({
        screen: "prayer",
        selectedMonth: today.getMonth() + 1,
        selectedYear: today.getFullYear(),
      })
        .then((data) => {
          if (active) setInitialPrayerData(data);
        })
        .catch((error) => {
          logDevelopmentError("loading Prayer content on Home", error);
          // Each moved section retains its individual request as a fallback.
        })
        .finally(() => {
          if (active) setIsInitialPrayerLoadSettled(true);
        });
      return () => {
        active = false;
      };
    },
    [today],
  );

  const loadProgress = useCallback(async () => {
    setIsLoadingProgress(true);
    setProgressError(false);
    try {
      const section = initialData?.sections.progress;
      setProgress(section ? parseDashboardProgressData(section.data) : await fetchDashboardProgress());
    } catch (error) {
      logDevelopmentError("loading dashboard progress", error);
      setProgress(null);
      setProgressError(true);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [initialData]);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    setStatsError(false);
    try {
      const section = initialData?.sections.rosaryStats;
      setRosaryStats(section ? parseRosaryStatsData(section.data) : await fetchRosaryStats());
    } catch (error) {
      logDevelopmentError("loading Rosary statistics", error);
      setRosaryStats(null);
      setStatsError(true);
    } finally {
      setIsLoadingStats(false);
    }
  }, [initialData]);

  const loadHolyDetails = useCallback(async () => {
    setIsLoadingHolyDetails(true);
    setHolyDetailsError(false);

    const levelsSection = initialData?.sections.levels;
    const activitiesSection = initialData?.sections.rosaryActivities;
    const [levels, activities] = await Promise.allSettled([
      levelsSection ? Promise.resolve(parseLevelsData(levelsSection.data)) : fetchLevels(),
      activitiesSection
        ? Promise.resolve(parseRecentRosaryActivitiesData(activitiesSection.data))
        : fetchRecentRosaryActivities(),
    ]);

    if (levels.status === "fulfilled") {
      setLevelCatalog(levels.value);
    } else {
      setLevelCatalog(null);
    }

    if (activities.status === "fulfilled") {
      setRecentRosaryActivities(activities.value);
    } else {
      setRecentRosaryActivities(null);
    }

    // A failed activity request must not be presented as an empty Rosary history.
    setHolyDetailsError(activities.status === "rejected");
    setIsLoadingHolyDetails(false);
  }, [initialData]);

  const loadConscience = useCallback(async () => {
    setIsLoadingConscience(true);
    setConscienceError(false);
    try {
      const section = initialData?.sections.examinationQuestion;
      setConscience(section ? parseConscienceQuestionData(section.data) : await getConscienceQuestion());
    } catch (error) {
      logDevelopmentError("loading the examination question", error);
      setConscience(null);
      setConscienceError(true);
    } finally {
      setIsLoadingConscience(false);
    }
  }, [initialData]);

  /** Loads the complete examination of conscience whenever the user opens its full list. */
  const loadConscienceQuestions = useCallback(async () => {
    setIsLoadingConscienceQuestions(true);
    setConscienceQuestionsError(false);
    try {
      setConscienceQuestions(await getConscienceQuestions());
    } catch (error) {
      logDevelopmentError("loading examination questions", error);
      setConscienceQuestions([]);
      setConscienceQuestionsError(true);
    } finally {
      setIsLoadingConscienceQuestions(false);
    }
  }, []);

  const loadReminder = useCallback(async () => {
    setIsLoadingReminder(true);
    setReminderError(false);
    try {
      const section = initialData?.sections.rosaryReminder;
      setReminder(section ? parseRosaryReminderData(section.data) : await getRosaryReminder());
    } catch (error) {
      logDevelopmentError("loading the Rosary reminder", error);
      setReminder(null);
      setReminderError(true);
    } finally {
      setIsLoadingReminder(false);
    }
  }, [initialData]);

  /** Loads the first public-intentions page from the aggregate response or its standalone fallback. */
  const loadIntentions = useCallback(async () => {
    setIntentionsError(undefined);
    setIsLoadingIntentions(true);
    setHasMoreIntentions(false);
    setNextIntentionsOffset(null);
    try {
      const section = initialPrayerData?.sections.prayerIntentions;
      const page = section
        ? parseApprovedPrayerIntentionsPage(section.data, section.meta)
        : await fetchApprovedPrayerIntentions({ limit: prayerIntentionsPreviewLimit });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions(page.data);
      setHasMoreIntentions(page.meta.hasMore);
      setNextIntentionsOffset(page.meta.nextOffset);
    } catch (error) {
      logDevelopmentError("loading approved prayer intentions on Home", error);
      setIntentionsError(error instanceof Error ? error.message : t("prayerHome.intentionsLoadError"));
    } finally {
      setIsLoadingIntentions(false);
    }
  }, [initialPrayerData, t]);

  useEffect(
    /** Starts the initial intentions request after the aggregate attempt has settled. */
    function loadInitialIntentions() {
      if (isInitialPrayerLoadSettled) void loadIntentions();
    },
    [isInitialPrayerLoadSettled, loadIntentions],
  );

  /** Appends the next public-intentions page without duplicating overlapping records. */
  const loadMoreIntentions = useCallback(async () => {
    if (!hasMoreIntentions || nextIntentionsOffset === null || isLoadingMoreIntentionsRef.current) return;

    isLoadingMoreIntentionsRef.current = true;
    setIsLoadingMoreIntentions(true);
    setIntentionsError(undefined);
    try {
      const page = await fetchApprovedPrayerIntentions({
        limit: prayerIntentionsPreviewLimit,
        offset: nextIntentionsOffset,
      });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions((currentIntentions) => appendUniqueIntentions(currentIntentions, page.data));
      setHasMoreIntentions(page.meta.hasMore);
      setNextIntentionsOffset(page.meta.nextOffset);
    } catch (error) {
      logDevelopmentError("loading more approved prayer intentions on Home", error);
      setIntentionsError(error instanceof Error ? error.message : t("prayerHome.intentionsMoreError"));
    } finally {
      isLoadingMoreIntentionsRef.current = false;
      setIsLoadingMoreIntentions(false);
    }
  }, [hasMoreIntentions, nextIntentionsOffset, t]);

  /** Loads global Rosary totals independently from the other combined Home sections. */
  const loadGlobalStats = useCallback(async () => {
    const requestId = ++globalStatsRequestIdRef.current;
    setIsGlobalStatsLoading(true);
    setGlobalStatsError(false);
    setGlobalStats(null);
    try {
      const nextStats = await getGlobalRosaryStats();
      if (requestId === globalStatsRequestIdRef.current) setGlobalStats(nextStats);
    } catch (error) {
      logDevelopmentError("loading global Rosary statistics on Home", error);
      if (requestId === globalStatsRequestIdRef.current) setGlobalStatsError(true);
    } finally {
      if (requestId === globalStatsRequestIdRef.current) setIsGlobalStatsLoading(false);
    }
  }, []);

  useEffect(
    /** Starts the one-time global total request and invalidates it when Home unmounts. */
    function loadInitialGlobalStats() {
      void loadGlobalStats();
      return () => {
        globalStatsRequestIdRef.current += 1;
      };
    },
    [loadGlobalStats],
  );

  /** Loads weekly global leaders while ignoring any older Home request that resolves later. */
  const loadWeeklyGlobalLeaderboard = useCallback(async () => {
    const requestId = ++weeklyGlobalLeaderboardRequestIdRef.current;
    setIsWeeklyGlobalLeaderboardLoading(true);
    setWeeklyGlobalLeaderboardError(false);
    try {
      const nextLeaderboard = await getWeeklyGlobalLeaderboard();
      if (requestId !== weeklyGlobalLeaderboardRequestIdRef.current) return;
      setWeeklyGlobalLeaderboard(nextLeaderboard);
    } catch (error) {
      logDevelopmentError("loading Home's weekly global leaderboard", error);
      if (requestId !== weeklyGlobalLeaderboardRequestIdRef.current) return;
      setWeeklyGlobalLeaderboard(null);
      setWeeklyGlobalLeaderboardError(true);
    } finally {
      if (requestId === weeklyGlobalLeaderboardRequestIdRef.current) setIsWeeklyGlobalLeaderboardLoading(false);
    }
  }, []);

  /** Loads lifetime global leaders while ignoring any older Home request that resolves later. */
  const loadLifetimeGlobalLeaderboard = useCallback(async () => {
    const requestId = ++lifetimeGlobalLeaderboardRequestIdRef.current;
    setIsLifetimeGlobalLeaderboardLoading(true);
    setLifetimeGlobalLeaderboardError(false);
    try {
      const nextLeaderboard = await getLifetimeGlobalLeaderboard();
      if (requestId !== lifetimeGlobalLeaderboardRequestIdRef.current) return;
      setLifetimeGlobalLeaderboard(nextLeaderboard);
    } catch (error) {
      logDevelopmentError("loading Home's lifetime global leaderboard", error);
      if (requestId !== lifetimeGlobalLeaderboardRequestIdRef.current) return;
      setLifetimeGlobalLeaderboard(null);
      setLifetimeGlobalLeaderboardError(true);
    } finally {
      if (requestId === lifetimeGlobalLeaderboardRequestIdRef.current) setIsLifetimeGlobalLeaderboardLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLifetimeGlobalLeaderboard();
      void loadWeeklyGlobalLeaderboard();

      /** Invalidates pending leaderboard requests when Home is no longer focused. */
      return function invalidateGlobalLeaderboardRequests() {
        lifetimeGlobalLeaderboardRequestIdRef.current += 1;
        weeklyGlobalLeaderboardRequestIdRef.current += 1;
      };
    }, [loadLifetimeGlobalLeaderboard, loadWeeklyGlobalLeaderboard]),
  );

  /** Refreshes every API-backed card that remains on the Home dashboard. */
  const refreshAll = useCallback(() => {
    void loadProgress();
    void loadStats();
    void loadHolyDetails();
    void loadConscience();
    void loadReminder();
  }, [loadConscience, loadHolyDetails, loadProgress, loadReminder, loadStats]);

  useFocusEffect(
    useCallback(() => {
      refreshAll();
    }, [refreshAll]),
  );

  useEffect(() => {
    return subscribeToRosaryCompletion(() => {
      void loadProgress();
      void loadStats();
      void loadHolyDetails();
      void loadReminder();
    });
  }, [loadHolyDetails, loadProgress, loadReminder, loadStats]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshAll();
    });
    return () => subscription.remove();
  }, [refreshAll]);

  /** Opens the full signed activity-points history without navigating away from Home. */
  const openActivityPoints = useCallback(() => setIsActivityPointsVisible(true), []);

  /** Closes the activity-points history and returns the user to the Home dashboard. */
  const closeActivityPoints = useCallback(() => setIsActivityPointsVisible(false), []);

  /** Opens Home and positions its scroll view at the user's Rosary Garden. */
  const openRosaryGarden = useCallback(() => {
    router.navigate({ pathname: "/home", params: { scrollTo: "garden" } });
  }, [router]);

  /** Starts a Rosary from the embedded Garden while retaining its established prayer source. */
  const prayTodayFromGarden = useCallback(() => {
    router.push({ pathname: "/rosary", params: { source: "today" } });
  }, [router]);

  /** Starts the digital mystery set scheduled for the device-local weekday. */
  const prayTodaysDigitalRosary = useCallback(() => {
    router.push({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType: todayMysteryType, source: "today" },
    });
  }, [router, todayMysteryType]);

  /** Starts the localized video Rosary for the device-local weekday. */
  const prayTodaysVideoRosary = useCallback(() => {
    router.push({ pathname: "/rosary-video", params: { mysteryType: todayMysteryType } });
  }, [router, todayMysteryType]);

  /** Starts a manually selected full mystery set from the combined Home page. */
  const openMystery = useCallback(
    (mysteryType: RosaryMysteryType) => {
      router.push({ pathname: "/rosary", params: { isDecade: "false", mysteryType, source: "manual" } });
    },
    [router],
  );

  /** Opens the complete public prayer-intentions feed. */
  const seeAllIntentions = useCallback(() => router.push("/prayer-intentions"), [router]);

  /** Opens a selected public intention in its dedicated Rosary flow. */
  const openIntention = useCallback(
    (intentionId: string) => router.push({ pathname: "/intention-rosary", params: { intentionId } }),
    [router],
  );

  /** Opens the form for sharing a prayer intention. */
  const createIntention = useCallback(() => router.push("/create-prayer-intention"), [router]);

  /** Opens the authenticated user's prayer intentions. */
  const openMyIntentions = useCallback(() => router.push("/my-prayer-intentions"), [router]);

  const useCardColumns = isTablet && contentWidth >= 700 && !isLargeText;

  return (
    <View accessibilityLabel={t("dashboard.accessibilityLabel")} style={styles.dashboard}>
      <View style={styles.primaryCard} testID="today-rosary-card-container">
        <MomentForPrayer
          mysteryImageSource={todayMysterySet.imageSource}
          mysteryTitle={todayMysterySet.title}
          onPrayDigital={prayTodaysDigitalRosary}
          onPrayVideo={prayTodaysVideoRosary}
          weekday={getWeekdayLabel(today, locale)}
        />
      </View>
      <View testID="streak-progress-container">
        <UserProgressSection
          errorFallback={
            <JourneyWelcomeCard displayName={profile?.displayName ?? null} gender={profile?.gender ?? null} />
          }
          initialData={initialData}
        />
      </View>
      <View style={styles.primaryCard} testID="daily-rosary-card-container">
        {!isLoadingReminder && reminderError ? (
          <JourneyWelcomeCard displayName={profile?.displayName ?? null} gender={profile?.gender ?? null} />
        ) : (
          <DailyRosaryCard
            error={reminderError}
            isLoading={isLoadingReminder}
            onExpired={() => void loadReminder()}
            onPrayRosary={() => router.push({ pathname: "/rosary", params: { source: "home-dashboard" } })}
            onRetry={() => void loadReminder()}
            onViewGarden={openRosaryGarden}
            reminder={reminder}
          />
        )}
      </View>
      <View onLayout={onGardenLayout} testID="rosary-garden-section-container">
        <RosaryGardenSection initialData={initialData} onPrayToday={prayTodayFromGarden} />
      </View>
      <View testID="rosary-guide-section-container">
        <RosaryGuideCards />
      </View>
      <View testID="daily-liturgy-section-container">
        <DailyLiturgyDashboard initialData={initialPrayerData} />
      </View>
      <View style={[styles.primaryGrid, useCardColumns && styles.primaryGridColumns]} testID="dashboard-primary-grid">
        <View
          style={[styles.primaryCard, useCardColumns && styles.primaryCardColumn]}
          testID="holy-progress-card-container"
        >
          <HolyProgressCard
            detailsError={holyDetailsError}
            isLoadingDetails={isLoadingHolyDetails}
            isLoadingProgress={isLoadingProgress}
            isLoadingStats={isLoadingStats}
            levelCatalog={levelCatalog}
            onViewActivityPoints={openActivityPoints}
            progress={progress}
            progressError={progressError}
            recentRosaryActivities={recentRosaryActivities}
            rosaryStats={rosaryStats}
            statsError={statsError}
          />
          <ActivityPointsModal onClose={closeActivityPoints} visible={isActivityPointsVisible} />
        </View>
        <View
          style={[styles.primaryCard, useCardColumns && styles.primaryCardColumn]}
          testID="level-progress-card-container"
        >
          <LevelProgressCard
            gender={profile?.gender ?? null}
            isLoading={isLoadingProgress}
            levelCatalog={levelCatalog}
            progress={progress}
            progressError={progressError}
          />
        </View>
        <View style={styles.primaryCard} testID="global-leaderboard-card-container">
          <LeaderboardCard
            isLifetimeLoading={isLifetimeGlobalLeaderboardLoading}
            isWeeklyLoading={isWeeklyGlobalLeaderboardLoading}
            lifetimeError={lifetimeGlobalLeaderboardError}
            lifetimeLeaderboard={lifetimeGlobalLeaderboard}
            onRetryLifetime={loadLifetimeGlobalLeaderboard}
            onRetryWeekly={loadWeeklyGlobalLeaderboard}
            weeklyError={weeklyGlobalLeaderboardError}
            weeklyLeaderboard={weeklyGlobalLeaderboard}
          />
        </View>
        <View style={[styles.primaryCard, useCardColumns && styles.primaryCardColumn]}>
          <ConscienceQuestionCard
            allQuestions={conscienceQuestions}
            allQuestionsError={conscienceQuestionsError}
            error={conscienceError}
            isLoadingAllQuestions={isLoadingConscienceQuestions}
            isLoading={isLoadingConscience}
            onRetry={() => void loadConscience()}
            onViewMore={() => void loadConscienceQuestions()}
            question={conscience}
          />
        </View>
        <EarnedBadgesSection initialData={initialData} />
      </View>
      <View testID="prayers-by-others-section-container">
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
          onRetry={loadIntentions}
          onSeeAll={seeAllIntentions}
        />
      </View>
      <View testID="all-mysteries-section-container">
        <AllMysteries cardWidth={mysteryCardWidth} gap={mysteryColumnGap} onOpenMystery={openMystery} />
      </View>
      <View testID="global-rosary-stats-section-container">
        <GlobalRosaryStatsCard
          error={globalStatsError}
          isLoading={isGlobalStatsLoading}
          onRetry={loadGlobalStats}
          stats={globalStats}
        />
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  dashboard: {
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  primaryCard: {
    minWidth: theme.spacing[0],
    width: "100%",
  },
  primaryCardColumn: {
    flexBasis: "47%",
    flexGrow: 1,
  },
  primaryGrid: {
    gap: theme.spacing[4],
  },
  primaryGridColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));
