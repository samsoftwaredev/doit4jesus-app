import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { useAchievement } from "@/features/achievements";
import { useCurrentLocalDate } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { ScreenDataResponse } from "@/features/screen-data";

import { CelebrationHeroCard, DailyVerseCard, ScriptureReadingsCard } from "../components";
import {
  fetchLiturgyReadings,
  fetchTodayLiturgy,
  loadDailyReadingProgress,
  markDailyReadingComplete,
  recordDailyScriptureCompletion,
} from "../index";
import { parseDailyLiturgyData } from "../liturgy.api";
import { addDaysToIsoDate, canNavigateToNextLiturgyDate } from "../liturgy.dates";
import type { DailyLiturgyViewModel, DailyReadingProgress } from "../liturgy.types";

export interface DailyLiturgyDashboardProps {
  initialData?: ScreenDataResponse;
  onCalendarPress?: () => void;
}

/** Returns whether this local reading state contains every reading in the displayed liturgy. */
function hasCompletedAllReadings(progress: DailyReadingProgress | null, model: DailyLiturgyViewModel) {
  return (
    model.readings.length > 0 && model.readings.every((reading) => progress?.completedReadingIds.includes(reading.id))
  );
}

/** Creates an idempotency key for one user-initiated daily Scripture completion request. */
function createCompletionIdempotencyKey() {
  return crypto.randomUUID();
}

/** Renders LiturgyLoadingState with styles resolved from the active appearance. */
function LiturgyLoadingState() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("liturgy.loading")} style={styles.skeletons}>
      <View style={[styles.skeleton, styles.headerSkeleton]} />
      <View style={[styles.skeleton, styles.heroSkeleton]} />
      <View style={[styles.skeleton, styles.chipsSkeleton]} />
      <View style={[styles.skeleton, styles.readingsSkeleton]} />
    </View>
  );
}

/**
 * Home-dashboard section for daily Mass and Scripture in the selected language.
 * The parent dashboard owns scrolling so this component can live naturally alongside other cards.
 */
export function DailyLiturgyDashboard({ initialData, onCalendarPress }: DailyLiturgyDashboardProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const { queueAchievement } = useAchievement();
  const activeLoadRequest = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liturgy, setLiturgy] = useState<DailyLiturgyViewModel | null>(null);
  const [progress, setProgress] = useState<DailyReadingProgress | null>(null);
  const currentLocalDate = useCurrentLocalDate();
  const [selectedDate, setSelectedDate] = useState(currentLocalDate);

  /** Synchronizes saved reading progress when the associated liturgy request is still current. */
  const syncProgress = useCallback(async (model: DailyLiturgyViewModel, requestId = activeLoadRequest.current) => {
    const nextProgress = await loadDailyReadingProgress(model.date, model.metadata.country);
    if (requestId !== activeLoadRequest.current) return;
    setProgress(nextProgress);
  }, []);

  /**
   * Loads one date in the active language, using the server's today route for the current local date.
   * Ignores results superseded by navigation, locale changes, or midnight rollover.
   */
  const reload = useCallback(
    async (date = selectedDate) => {
      const requestId = ++activeLoadRequest.current;
      setError(null);
      setIsLoading(true);

      try {
        const aggregateLiturgy = date === currentLocalDate ? initialData?.sections.liturgyToday : undefined;
        const model = aggregateLiturgy
          ? parseDailyLiturgyData(aggregateLiturgy.data)
          : date === currentLocalDate
            ? await fetchTodayLiturgy(locale)
            : await fetchLiturgyReadings(date, locale);
        if (requestId !== activeLoadRequest.current) return;
        setLiturgy(model);
        await syncProgress(model, requestId);
      } catch (error) {
        logDevelopmentError("loading daily liturgy", error);
        if (requestId !== activeLoadRequest.current) return;
        setError(t("liturgy.loadError"));
      } finally {
        if (requestId === activeLoadRequest.current) setIsLoading(false);
      }
    },
    [currentLocalDate, initialData, locale, selectedDate, syncProgress, t],
  );

  useEffect(() => {
    setSelectedDate(currentLocalDate);
  }, [currentLocalDate]);

  useEffect(() => {
    void reload();
  }, [reload]);

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

  /** Stores a completed reading, recording the date-level server completion only for the final passage. */
  const completeReading = useCallback(
    async (readingId: string) => {
      if (!liturgy) return;

      const completingAllReadings =
        hasCompletedAllReadings(progress, liturgy) ||
        liturgy.readings.every(
          (reading) => reading.id === readingId || progress?.completedReadingIds.includes(reading.id),
        );
      if (completingAllReadings) {
        const completion = await recordDailyScriptureCompletion({
          idempotencyKey: createCompletionIdempotencyKey(),
          readingDate: liturgy.date,
        });
        setLiturgy((current) => (current?.date === liturgy.date ? { ...current, completion } : current));
      }

      const result = await markDailyReadingComplete({
        country: liturgy.metadata.country,
        date: liturgy.date,
        readingId,
        readingIds: liturgy.readings.map((reading) => reading.id),
      });
      setProgress(result.progress);
      if (completingAllReadings && result.didCompleteAllReadings) {
        queueAchievement({ type: "daily-scripture-complete" });
      }
    },
    [liturgy, progress, queueAchievement],
  );

  const completedReadingIds = liturgy?.completion.completed
    ? liturgy.readings.map((reading) => reading.id)
    : (progress?.completedReadingIds ?? []);

  return (
    <View style={styles.dashboard}>
      {isLoading && !liturgy ? <LiturgyLoadingState /> : null}
      {error && !liturgy ? (
        <View style={styles.errorCard}>
          <Text accessibilityRole="header" style={styles.errorTitle}>
            {t("liturgy.loadError")}
          </Text>
          <Text style={styles.errorCopy}>{t("liturgy.tryAgain")}</Text>
          <Button onPress={() => void reload()} style={styles.retryButton} variant="warning">
            {t("liturgy.retry")}
          </Button>
        </View>
      ) : null}
      {liturgy ? (
        <View style={styles.content}>
          <CelebrationHeroCard
            celebration={liturgy.celebration}
            date={liturgy.date}
            onCalendarPress={onCalendarPress}
          />
          <ScriptureReadingsCard
            completedReadingIds={completedReadingIds}
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

const styleSheet = createThemedStyles((theme) => ({
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
  skeleton: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.lg,
    opacity: 0.6,
  },
  skeletons: { gap: theme.spacing[4], padding: theme.spacing[4] },
}));
