import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { useTranslation } from "react-i18next";

import { DailyLiturgyDashboard } from "@/features/liturgy/screens";
import { subscribeToRosaryCompletion } from "@/features/prayer/rosary/rosary-completion-events";
import {
  EarnedBadgesSection,
  fetchDashboardProgress,
  fetchLevels,
  fetchRecentRosaryActivities,
  fetchRosaryStats,
  UserProgressSection,
} from "@/features/progress";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import type { LevelCatalogEntry, RecentRosaryActivity } from "@/features/progress";
import { ConscienceQuestionCard, DailyRosaryCard, HolyProgressCard, LevelProgressCard } from "./components";
import { getConscienceQuestion, getRosaryReminder } from "./dashboard.api";
import type { ConscienceQuestionViewModel, RosaryReminderViewModel } from "./dashboard.types";

/** Composes the Home dashboard's API-backed cards, streak progress, and earned badges. */
export function HolyProgressDashboard() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { contentWidth, isLargeText, isTablet } = useResponsiveLayout();
  const [conscience, setConscience] = useState<ConscienceQuestionViewModel | null>(null);
  const [conscienceError, setConscienceError] = useState(false);
  const [isLoadingConscience, setIsLoadingConscience] = useState(true);
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

  const loadProgress = useCallback(async () => {
    setIsLoadingProgress(true);
    setProgressError(false);
    try {
      setProgress(await fetchDashboardProgress());
    } catch {
      setProgress(null);
      setProgressError(true);
    } finally {
      setIsLoadingProgress(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    setStatsError(false);
    try {
      setRosaryStats(await fetchRosaryStats());
    } catch {
      setRosaryStats(null);
      setStatsError(true);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const loadHolyDetails = useCallback(async () => {
    setIsLoadingHolyDetails(true);
    setHolyDetailsError(false);

    const [levels, activities] = await Promise.allSettled([fetchLevels(), fetchRecentRosaryActivities()]);

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
  }, []);

  const loadConscience = useCallback(async () => {
    setIsLoadingConscience(true);
    setConscienceError(false);
    try {
      setConscience(await getConscienceQuestion());
    } catch {
      setConscience(null);
      setConscienceError(true);
    } finally {
      setIsLoadingConscience(false);
    }
  }, []);

  const loadReminder = useCallback(async () => {
    setIsLoadingReminder(true);
    setReminderError(false);
    try {
      setReminder(await getRosaryReminder());
    } catch {
      setReminder(null);
      setReminderError(true);
    } finally {
      setIsLoadingReminder(false);
    }
  }, []);

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

  const useCardColumns = isTablet && contentWidth >= 700 && !isLargeText;

  return (
    <View accessibilityLabel={t("dashboard.accessibilityLabel")} style={styles.dashboard}>
      <UserProgressSection />
      <View style={styles.primaryCard} testID="daily-rosary-card-container">
        <DailyRosaryCard
          error={reminderError}
          isLoading={isLoadingReminder}
          onExpired={() => void loadReminder()}
          onPrayRosary={() => router.push({ pathname: "/rosary", params: { source: "home-dashboard" } })}
          onRetry={() => void loadReminder()}
          reminder={reminder}
        />
      </View>
      <DailyLiturgyDashboard />
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
            progress={progress}
            progressError={progressError}
            recentRosaryActivities={recentRosaryActivities}
            rosaryStats={rosaryStats}
            statsError={statsError}
          />
        </View>
        <View
          style={[styles.primaryCard, useCardColumns && styles.primaryCardColumn]}
          testID="level-progress-card-container"
        >
          <LevelProgressCard
            isLoading={isLoadingProgress}
            levelCatalog={levelCatalog}
            progress={progress}
            progressError={progressError}
          />
        </View>
        <View style={[styles.primaryCard, useCardColumns && styles.primaryCardColumn]}>
          <ConscienceQuestionCard
            error={conscienceError}
            isLoading={isLoadingConscience}
            onRetry={() => void loadConscience()}
            question={conscience}
          />
        </View>
        <EarnedBadgesSection />
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
