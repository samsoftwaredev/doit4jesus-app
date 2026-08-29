import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui";
import { theme } from "@/theme/tokens";

import { CelebrationHeroCard, CompletionToast, DailyVerseCard, ScriptureReadingsCard } from "../components";
import {
  fetchLiturgyReadings,
  loadDailyReadingProgress,
  markCompletionToastShown,
  markDailyReadingComplete,
  recordDailyScriptureCompletion,
  recordRewardOnProgress,
} from "../index";
import { addDaysToIsoDate, canNavigateToNextLiturgyDate, getLocalIsoDate } from "../liturgy.dates";
import type { DailyLiturgyViewModel, DailyReadingProgress } from "../liturgy.types";

interface CompletionToastState {
  count: number;
  currentLevel?: number;
  points?: number;
  totalXp?: number;
}

export interface DailyLiturgyDashboardProps {
  country?: string;
  onCalendarPress?: () => void;
}

function hasCompletedAllReadings(progress: DailyReadingProgress, model: DailyLiturgyViewModel) {
  return (
    model.readings.length > 0 && model.readings.every((reading) => progress.completedReadingIds.includes(reading.id))
  );
}

function LiturgyLoadingState() {
  return (
    <View accessibilityLabel="Loading daily liturgy" style={styles.skeletons}>
      <View style={[styles.skeleton, styles.headerSkeleton]} />
      <View style={[styles.skeleton, styles.heroSkeleton]} />
      <View style={[styles.skeleton, styles.chipsSkeleton]} />
      <View style={[styles.skeleton, styles.readingsSkeleton]} />
    </View>
  );
}

/**
 * Home-dashboard section for daily Mass and Scripture. The parent dashboard
 * owns scrolling so this component can live naturally alongside other cards.
 */
export function DailyLiturgyDashboard({ country = "US", onCalendarPress }: DailyLiturgyDashboardProps) {
  const rewardInFlight = useRef<string | null>(null);
  const toastPresentedFor = useRef<string | null>(null);
  const [completionToast, setCompletionToast] = useState<CompletionToastState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetryingReward, setIsRetryingReward] = useState(false);
  const [liturgy, setLiturgy] = useState<DailyLiturgyViewModel | null>(null);
  const [progress, setProgress] = useState<DailyReadingProgress | null>(null);
  const [rewardError, setRewardError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => getLocalIsoDate());

  const presentCompletionToast = useCallback(async (nextProgress: DailyReadingProgress, readingCount: number) => {
    const reward = nextProgress.reward;
    if (
      !reward ||
      reward.status !== "recorded" ||
      reward.toastShownAt ||
      toastPresentedFor.current === reward.idempotencyKey
    ) {
      return;
    }

    toastPresentedFor.current = reward.idempotencyKey;
    setCompletionToast({
      count: readingCount,
      currentLevel: reward.currentLevel,
      points: reward.points,
      totalXp: reward.totalXp,
    });

    try {
      const updated = await markCompletionToastShown(nextProgress);
      setProgress(updated);
    } catch {
      // The toast is intentionally still shown; a storage retry is harmless on the next launch.
    }
  }, []);

  const awardCompletion = useCallback(
    async (nextProgress: DailyReadingProgress, readingCount: number) => {
      const reward = nextProgress.reward;
      if (!reward || reward.status === "recorded" || rewardInFlight.current === reward.idempotencyKey) {
        if (reward?.status === "recorded") await presentCompletionToast(nextProgress, readingCount);
        return;
      }

      rewardInFlight.current = reward.idempotencyKey;
      setIsRetryingReward(true);
      setRewardError(null);

      try {
        const result = await recordDailyScriptureCompletion({
          completedAt: reward.completedAt,
          country: nextProgress.country,
          idempotencyKey: reward.idempotencyKey,
          occurredAt: reward.occurredAt,
        });
        const updated = await recordRewardOnProgress(nextProgress, result);
        setProgress(updated);
        await presentCompletionToast(updated, readingCount);
      } catch {
        setRewardError("Your readings are saved. Points could not be recorded yet.");
      } finally {
        rewardInFlight.current = null;
        setIsRetryingReward(false);
      }
    },
    [presentCompletionToast],
  );

  const syncProgress = useCallback(
    async (model: DailyLiturgyViewModel) => {
      const nextProgress = await loadDailyReadingProgress(model.date, model.metadata.country);
      setProgress(nextProgress);

      if (!hasCompletedAllReadings(nextProgress, model)) return;
      if (nextProgress.reward?.status === "pending") {
        void awardCompletion(nextProgress, model.readings.length);
      } else {
        void presentCompletionToast(nextProgress, model.readings.length);
      }
    },
    [awardCompletion, presentCompletionToast],
  );

  const reload = useCallback(
    async (date = selectedDate) => {
      setError(null);
      setIsLoading(true);

      try {
        const model = await fetchLiturgyReadings(date, country);
        setLiturgy(model);
        await syncProgress(model);
      } catch {
        setError("Unable to load this day’s liturgy.");
      } finally {
        setIsLoading(false);
      }
    },
    [country, selectedDate, syncProgress],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      if (liturgy) void syncProgress(liturgy);
    }, [liturgy, syncProgress]),
  );

  const retryReward = useCallback(() => {
    if (!liturgy || !progress) return;
    void awardCompletion(progress, liturgy.readings.length);
  }, [awardCompletion, liturgy, progress]);

  const showPreviousDay = useCallback(() => {
    setSelectedDate((date) => addDaysToIsoDate(date, -1));
  }, []);

  const showNextDay = useCallback(() => {
    setSelectedDate((date) => {
      if (!canNavigateToNextLiturgyDate(date)) return date;
      return addDaysToIsoDate(date, 1);
    });
  }, []);

  const nextDayDisabled = !canNavigateToNextLiturgyDate(selectedDate);

  const completeReading = useCallback(
    async (readingId: string) => {
      if (!liturgy) return;

      const result = await markDailyReadingComplete({
        country: liturgy.metadata.country,
        date: liturgy.date,
        readingId,
        readingIds: liturgy.readings.map((reading) => reading.id),
      });
      setProgress(result.progress);

      if (result.allReadingsCompleted && result.progress.reward?.status === "pending") {
        void awardCompletion(result.progress, liturgy.readings.length);
      }
    },
    [awardCompletion, liturgy],
  );

  return (
    <View style={styles.dashboard}>
      {isLoading && !liturgy ? <LiturgyLoadingState /> : null}
      {error && !liturgy ? (
        <View style={styles.errorCard}>
          <Text accessibilityRole="header" style={styles.errorTitle}>
            Unable to load this day&apos;s liturgy.
          </Text>
          <Text style={styles.errorCopy}>Please try again when you&apos;re ready.</Text>
          <Button onPress={() => void reload()} style={styles.retryButton} variant="warning">
            Retry
          </Button>
        </View>
      ) : null}
      {liturgy ? (
        <View style={styles.content}>
          <CompletionToast
            count={completionToast?.count ?? 0}
            currentLevel={completionToast?.currentLevel}
            points={completionToast?.points}
            totalXp={completionToast?.totalXp}
            visible={completionToast !== null}
            onDismiss={() => setCompletionToast(null)}
          />
          <CelebrationHeroCard
            celebration={liturgy.celebration}
            date={liturgy.date}
            onCalendarPress={onCalendarPress}
          />
          <ScriptureReadingsCard
            completedReadingIds={progress?.completedReadingIds ?? []}
            readings={liturgy.readings}
            metadata={liturgy.metadata}
            season={liturgy.celebration.season}
            onReadingComplete={completeReading}
            isNavigating={isLoading}
            nextDayDisabled={nextDayDisabled}
            nextDate={addDaysToIsoDate(selectedDate, 1)}
            previousDate={addDaysToIsoDate(selectedDate, -1)}
            onNextDay={showNextDay}
            onPreviousDay={showPreviousDay}
          />
          {rewardError ? (
            <View accessibilityRole="alert" style={styles.rewardError}>
              <Text style={styles.rewardErrorCopy}>{rewardError}</Text>
              <Button loading={isRetryingReward} onPress={retryReward} size="sm" variant="outline">
                Retry points
              </Button>
            </View>
          ) : null}
          {liturgy.highlightedVerse ? <DailyVerseCard {...liturgy.highlightedVerse} /> : null}
        </View>
      ) : null}
      {isLoading && liturgy ? (
        <View style={styles.refreshing}>
          <ActivityIndicator color={theme.colors.gold.pale} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chipsSkeleton: { height: 44, width: "72%" },
  content: {
    alignSelf: "center",
    maxWidth: 700,
    paddingBottom: theme.spacing[6],
    width: "100%",
  },
  dashboard: { minHeight: theme.spacing[20], position: "relative" },
  errorCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    margin: theme.spacing[4],
    padding: theme.spacing[5],
  },
  errorCopy: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  errorTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  headerSkeleton: { height: 70 },
  heroSkeleton: { height: 220 },
  readingsSkeleton: { height: 288 },
  refreshing: {
    alignItems: "center",
    backgroundColor: "rgba(7, 19, 29, 0.56)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  retryButton: { marginTop: theme.spacing[4] },
  rewardError: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.warningSurface,
    borderColor: theme.colors.semantic.warningBorder,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
  },
  rewardErrorCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  skeleton: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.lg,
    opacity: 0.6,
  },
  skeletons: { gap: theme.spacing[4], padding: theme.spacing[4] },
});
