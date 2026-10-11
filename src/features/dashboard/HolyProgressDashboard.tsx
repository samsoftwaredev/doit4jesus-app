import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DailyLiturgyDashboard } from "@/features/liturgy/screens";
import { subscribeToRosaryCompletion } from "@/features/prayer/rosary/rosary-completion-events";
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
import type { ScreenDataResponse } from "@/features/screen-data";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import type { LevelCatalogEntry, RecentRosaryActivity } from "@/features/progress";
import {
  ConscienceQuestionCard,
  ActivityPointsModal,
  DailyRosaryCard,
  HolyProgressCard,
  JourneyWelcomeCard,
  LevelProgressCard,
} from "./components";
import {
  getConscienceQuestion,
  getConscienceQuestions,
  getRosaryReminder,
  parseConscienceQuestionData,
  parseRosaryReminderData,
} from "./dashboard.api";
import type {
  ConscienceQuestionListItemViewModel,
  ConscienceQuestionViewModel,
  RosaryReminderViewModel,
} from "./dashboard.types";

/**
 * Composes the Home dashboard's API-backed cards, streak progress, and earned badges.
 *
 * Replaces unavailable Home progress and daily Rosary reminder states with a journey welcome while preserving other cards.
 */
export function HolyProgressDashboard({ initialData }: { initialData?: ScreenDataResponse }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { profile } = useCurrentProfile();
  const { contentWidth, isLargeText, isTablet } = useResponsiveLayout();
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

  /** Opens the Prayer tab and positions its scroll view at the user's Rosary Garden. */
  const openRosaryGarden = useCallback(() => {
    router.navigate({ pathname: "/prayer", params: { scrollTo: "garden" } });
  }, [router]);

  const useCardColumns = isTablet && contentWidth >= 700 && !isLargeText;

  return (
    <View accessibilityLabel={t("dashboard.accessibilityLabel")} style={styles.dashboard}>
      <UserProgressSection
        errorFallback={
          <JourneyWelcomeCard displayName={profile?.displayName ?? null} gender={profile?.gender ?? null} />
        }
        initialData={initialData}
      />
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
      <DailyLiturgyDashboard initialData={initialData} />
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
