import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { RosaryReminderViewModel } from "../dashboard.types";
import { getRosaryReminderState } from "../rosary-reminder";
import { useServerSynchronizedCountdown } from "../useServerSynchronizedCountdown";
import { GardenMotivationCard } from "./GardenMotivationCard";

type DailyRosaryCardProps = {
  error: boolean;
  isLoading: boolean;
  onExpired: () => void;
  onPrayRosary: () => void;
  onRetry: () => void;
  onViewGarden: () => void;
  reminder: RosaryReminderViewModel | null;
};

/** Formats one countdown segment without allowing negative output. */
function twoDigits(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

/** Shows the current streak or welcoming first-prayer guidance. */
function StreakCopy({ reminder }: { reminder: RosaryReminderViewModel }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  if (reminder.streak.status === "none" || reminder.streak.current <= 0) {
    return <Text style={styles.streak}>{t("dashboard.dailyRosary.beginRhythm")}</Text>;
  }
  return <Text style={styles.streak}>{t("dashboard.dailyRosary.dayStreak", { count: reminder.streak.current })}</Text>;
}

/** Renders the unified daily habit card and explains when its synchronized streak deadline expires. */
export function DailyRosaryCard({
  error,
  isLoading,
  onExpired,
  onPrayRosary,
  onRetry,
  onViewGarden,
  reminder,
}: DailyRosaryCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const countdown = useServerSynchronizedCountdown({
    deadlineAt: reminder?.deadlineAt ?? null,
    serverNow: reminder?.serverNow ?? "",
  });
  const expiredRequestRef = useRef<string | null>(null);
  const state = reminder ? getRosaryReminderState(reminder, countdown.totalSeconds) : "normal";
  const expiryKey = reminder?.deadlineAt ? `${reminder.serverNow}/${reminder.deadlineAt}` : null;
  const formattedCountdown = `${twoDigits(countdown.hours)}:${twoDigits(countdown.minutes)}:${twoDigits(countdown.seconds)}`;

  useEffect(() => {
    if (state !== "expired" || !expiryKey || isLoading || expiredRequestRef.current === expiryKey) return;
    expiredRequestRef.current = expiryKey;
    onExpired();
  }, [expiryKey, isLoading, onExpired, state]);

  useEffect(() => {
    if (state !== "expired") expiredRequestRef.current = null;
  }, [state]);

  const colors = reminder?.completed
    ? theme.colors.gradients.dailyRosaryComplete
    : reminder?.streak.status === "reset"
      ? theme.colors.gradients.dailyRosaryReset
      : state === "urgent" || state === "expired"
        ? theme.colors.gradients.countdownHour
        : theme.colors.gradients.dailyRosary;

  let timingText: string | null = null;
  if (reminder?.completed) timingText = t("dashboard.dailyRosary.completedTime");
  else if (isLoading) timingText = t("dashboard.dailyRosary.loadingTime");
  else if (!reminder || countdown.totalSeconds === null) timingText = t("dashboard.dailyRosary.timeUnavailable");
  else if (state === "expired") timingText = t("dashboard.dailyRosary.updatingTime");

  return (
    <LinearGradient
      colors={colors}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
      testID="daily-rosary-habit-card"
    >
      <GardenMotivationCard />
      <View style={styles.divider} />
      <View style={styles.statusRegion}>
        {isLoading && !reminder ? (
          <RosarySkeleton />
        ) : !reminder ? (
          <RosaryUnavailable error={error} onRetry={onRetry} />
        ) : reminder.completed ? (
          <CompletedRosaryState reminder={reminder} />
        ) : reminder.streak.status === "reset" ? (
          <ResetRosaryState />
        ) : state === "expired" ? (
          <ExpiredRosaryState />
        ) : (
          <ActiveRosaryState reminder={reminder} urgent={state === "urgent"} />
        )}

        {timingText ? (
          <Text accessibilityLiveRegion="polite" style={styles.timingStatus} testID="rosary-timing-status">
            {timingText}
          </Text>
        ) : (
          <Text
            accessibilityLabel={t("dashboard.dailyRosary.countdown", {
              hours: countdown.hours,
              minutes: countdown.minutes,
              seconds: countdown.seconds,
            })}
            accessibilityLiveRegion={state === "urgent" ? "polite" : "none"}
            style={[styles.timer, state === "urgent" && styles.timerUrgent]}
            testID="rosary-countdown"
          >
            {t("dashboard.dailyRosary.countdownDisplay", { time: formattedCountdown })}
          </Text>
        )}

        <CardAction onPrayRosary={onPrayRosary} onViewGarden={onViewGarden} />
      </View>
    </LinearGradient>
  );
}

/** Renders the primary Rosary action and the secondary route to the user's Garden. */
function CardAction({ onPrayRosary, onViewGarden }: { onPrayRosary: () => void; onViewGarden: () => void }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.actions}>
      <Pressable
        accessibilityLabel={t("dashboard.dailyRosary.prayLabel")}
        accessibilityRole="button"
        onPress={onPrayRosary}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Text style={styles.actionText}>{t("dashboard.dailyRosary.pray")}</Text>
        <Feather
          accessible={false}
          color={theme.colors.text.inverse}
          name="chevron-right"
          size={theme.sizes.iconSmall}
        />
      </Pressable>
      <Pressable
        accessibilityLabel={t("dashboard.dailyRosary.viewGarden")}
        accessibilityRole="button"
        onPress={onViewGarden}
        style={({ pressed }) => [styles.gardenAction, pressed && styles.pressed]}
      >
        <Text style={styles.gardenActionText}>{t("dashboard.dailyRosary.viewGarden")}</Text>
      </Pressable>
    </View>
  );
}

/** Displays the normal or urgent active Rosary status. */
function ActiveRosaryState({ reminder, urgent }: { reminder: RosaryReminderViewModel; urgent: boolean }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.statusCopy}>
      <View style={styles.titleRow}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="circle" size={theme.sizes.iconSmall} />
        <Text accessibilityRole="header" style={styles.title}>
          {t("dashboard.dailyRosary.title")}
        </Text>
      </View>
      <StreakCopy reminder={reminder} />
      <Text style={styles.supporting}>
        {urgent ? t("dashboard.dailyRosary.countdownCopy") : t("dashboard.dailyRosary.waiting")}
      </Text>
    </View>
  );
}

/** Displays today's completed Rosary and retained streak. */
function CompletedRosaryState({ reminder }: { reminder: RosaryReminderViewModel }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.completedRow}>
      <View style={styles.completedIcon}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="check" size={theme.sizes.iconMedium} />
      </View>
      <View style={styles.completedCopy}>
        <Text accessibilityRole="header" style={styles.title}>
          {t("dashboard.dailyRosary.complete")}
        </Text>
        <StreakCopy reminder={reminder} />
      </View>
    </View>
  );
}

/** Announces that the expired reminder is being refreshed. */
function ExpiredRosaryState() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("dashboard.dailyRosary.updatingLabel")} style={styles.statusCopy}>
      <Text accessibilityRole="header" style={styles.title}>
        {t("dashboard.dailyRosary.title")}
      </Text>
      <Text style={styles.supporting}>{t("dashboard.dailyRosary.updating")}</Text>
    </View>
  );
}

/** Displays backend-confirmed streak reset guidance. */
function ResetRosaryState() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.statusCopy}>
      <Text accessibilityRole="header" style={styles.title}>
        {t("dashboard.dailyRosary.reset")}
      </Text>
      <Text style={styles.supporting}>{t("dashboard.dailyRosary.startAgain")}</Text>
    </View>
  );
}

/** Displays an unavailable reminder with a retry action when the request failed. */
function RosaryUnavailable({ error, onRetry }: { error: boolean; onRetry: () => void }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.statusCopy}>
      <Text accessibilityRole="header" style={styles.title}>
        {t("dashboard.dailyRosary.title")}
      </Text>
      <Text accessibilityRole={error ? "alert" : undefined} style={styles.supporting}>
        {error ? t("dashboard.dailyRosary.reminderUnavailable") : t("dashboard.dailyRosary.waiting")}
      </Text>
      {error ? (
        <Pressable
          accessibilityLabel={t("dashboard.dailyRosary.retryLabel")}
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retry}
        >
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Displays a lightweight status placeholder while reminder data loads. */
function RosarySkeleton() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("dashboard.dailyRosary.loading")} style={styles.skeleton}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonLine} />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    ...theme.shadows.large,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
  },
  divider: { backgroundColor: theme.colors.border.subtle, height: theme.borderWidths.hairline },
  statusRegion: { gap: theme.spacing[3], padding: theme.spacing[4] },
  statusCopy: { minWidth: 0 },
  titleRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary, fontFamily: theme.fontFamilies.display },
  streak: { ...theme.typography.bodyMedium, color: theme.colors.gold.pale, marginTop: theme.spacing[1] },
  supporting: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  timer: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    flexShrink: 1,
    fontFamily: theme.fontFamilies.devotional,
    letterSpacing: theme.letterSpacing.wide,
    maxWidth: "100%",
    textAlign: "center",
  },
  timerUrgent: { color: theme.colors.gold.light, fontSize: 30, lineHeight: 38 },
  timingStatus: { ...theme.typography.caption, color: theme.colors.text.muted, textAlign: "center" },
  action: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: theme.colors.gold.pale,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  actionText: { ...theme.typography.button, color: theme.colors.text.inverse, letterSpacing: theme.letterSpacing.wide },
  actions: { alignSelf: "stretch", gap: theme.spacing[1] },
  pressed: { opacity: theme.opacity.pressed },
  completedRow: { alignItems: "center", flexDirection: "row" },
  completedCopy: { flex: 1, marginLeft: theme.spacing[3] },
  completedIcon: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.14)",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  gardenAction: {
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  gardenActionText: { ...theme.typography.button, color: theme.colors.gold.pale, textAlign: "center" },
  retry: { alignSelf: "flex-start", justifyContent: "center", minHeight: theme.sizes.touchTarget },
  retryText: { ...theme.typography.button, color: theme.colors.gold.pale },
  skeleton: { justifyContent: "center", minHeight: theme.spacing[12] },
  skeletonLine: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[3],
    marginTop: theme.spacing[2],
    width: "54%",
  },
  skeletonTitle: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[5],
    width: "40%",
  },
}));
