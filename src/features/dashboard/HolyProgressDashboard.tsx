import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";

import { DailyLiturgyDashboard } from "@/features/liturgy/screens";
import { fetchDashboardProgress, fetchRosaryStats, UserProgressSection } from "@/features/progress";
import { subscribeToRosaryCompletion } from "@/features/prayer/rosary/rosary-completion-events";
import { theme } from "@/theme/tokens";

import { getConscienceQuestion, getRosaryReminder, getWeeklyGlobalLeaderboard } from "./dashboard.api";
import { ConscienceQuestionCard } from "./components/ConscienceQuestionCard";
import { DailyRosaryCard } from "./components/DailyRosaryCard";
import { HolyProgressCard } from "./components/HolyProgressCard";
import { LeaderboardCard } from "./components/LeaderboardCard";
import type {
  ConscienceQuestionViewModel,
  LeaderboardEntryViewModel,
  RosaryReminderViewModel,
} from "./dashboard.types";

/** The Home dashboard's four primary API-backed cards and existing follow-on sections. */
export function HolyProgressDashboard() {
  const router = useRouter();
  const [conscience, setConscience] = useState<ConscienceQuestionViewModel | null>(null);
  const [conscienceError, setConscienceError] = useState(false);
  const [isLoadingConscience, setIsLoadingConscience] = useState(true);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isLoadingReminder, setIsLoadingReminder] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryViewModel[] | null>(null);
  const [leaderboardError, setLeaderboardError] = useState(false);
  const [progress, setProgress] = useState<Awaited<ReturnType<typeof fetchDashboardProgress>> | null>(null);
  const [progressError, setProgressError] = useState(false);
  const [reminder, setReminder] = useState<RosaryReminderViewModel | null>(null);
  const [reminderError, setReminderError] = useState(false);
  const [rosaryStats, setRosaryStats] = useState<Awaited<ReturnType<typeof fetchRosaryStats>> | null>(null);
  const [statsError, setStatsError] = useState(false);

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

  const loadLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true);
    setLeaderboardError(false);
    try {
      setLeaderboard(await getWeeklyGlobalLeaderboard());
    } catch {
      setLeaderboard(null);
      setLeaderboardError(true);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    void loadProgress();
    void loadStats();
    void loadConscience();
    void loadReminder();
    void loadLeaderboard();
  }, [loadConscience, loadLeaderboard, loadProgress, loadReminder, loadStats]);

  useFocusEffect(
    useCallback(() => {
      refreshAll();
    }, [refreshAll]),
  );

  useEffect(() => {
    return subscribeToRosaryCompletion(() => {
      void loadProgress();
      void loadStats();
      void loadReminder();
    });
  }, [loadProgress, loadReminder, loadStats]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshAll();
    });
    return () => subscription.remove();
  }, [refreshAll]);

  return (
    <View accessibilityLabel="Holy Progress Dashboard" style={styles.dashboard}>
      <HolyProgressCard
        isLoadingProgress={isLoadingProgress}
        isLoadingStats={isLoadingStats}
        progress={progress}
        progressError={progressError}
        rosaryStats={rosaryStats}
        statsError={statsError}
      />
      <ConscienceQuestionCard
        error={conscienceError}
        isLoading={isLoadingConscience}
        onRetry={() => void loadConscience()}
        question={conscience}
      />
      <DailyRosaryCard
        error={reminderError}
        isLoading={isLoadingReminder}
        onExpired={() => void loadReminder()}
        onPrayRosary={() => router.push({ pathname: "/rosary", params: { source: "home-dashboard" } })}
        onRetry={() => void loadReminder()}
        reminder={reminder}
      />
      <LeaderboardCard
        entries={leaderboard}
        error={leaderboardError}
        isLoading={isLoadingLeaderboard}
        onRetry={() => void loadLeaderboard()}
        onViewFull={() => router.push("/friends/leaderboard")}
      />
      <UserProgressSection />
      <DailyLiturgyDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
});
