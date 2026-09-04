import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { RosaryReminderState, RosaryReminderViewModel } from "../dashboard.types";
import { getRosaryReminderState } from "../rosary-reminder";
import { useServerSynchronizedCountdown } from "../useServerSynchronizedCountdown";

type DailyRosaryCardProps = {
  error: boolean;
  isLoading: boolean;
  onExpired: () => void;
  onPrayRosary: () => void;
  onRetry: () => void;
  reminder: RosaryReminderViewModel | null;
};

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

/** Renders StreakCopy with styles resolved from the active appearance. */
function StreakCopy({ reminder }: { reminder: RosaryReminderViewModel }) {
  const styles = useThemedStyles(styleSheet);
  if (reminder.streak.status === "none" || reminder.streak.current <= 0) {
    return <Text style={styles.streak}>Begin a prayerful rhythm today.</Text>;
  }
  return <Text style={styles.streak}>{`${reminder.streak.current} Day Streak`}</Text>;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function DailyRosaryCard({
  error,
  isLoading,
  onExpired,
  onPrayRosary,
  onRetry,
  reminder,
}: DailyRosaryCardProps) {
  const countdown = useServerSynchronizedCountdown({
    deadlineAt: reminder?.deadlineAt ?? null,
    serverNow: reminder?.serverNow ?? "",
  });
  const expiredRequestRef = useRef<string | null>(null);
  const state = reminder ? getRosaryReminderState(reminder, countdown.totalSeconds) : "normal";
  const expiryKey = reminder?.deadlineAt ? `${reminder.serverNow}/${reminder.deadlineAt}` : null;

  useEffect(() => {
    if (state !== "expired" || !expiryKey || isLoading || expiredRequestRef.current === expiryKey) return;
    expiredRequestRef.current = expiryKey;
    onExpired();
  }, [expiryKey, isLoading, onExpired, state]);

  useEffect(() => {
    if (state !== "expired") expiredRequestRef.current = null;
  }, [state]);

  if (isLoading && !reminder) return <RosarySkeleton />;
  if (!reminder) return <RosaryUnavailable error={error} onPrayRosary={onPrayRosary} onRetry={onRetry} />;
  if (reminder.completed) return <CompletedRosaryState reminder={reminder} />;
  if (reminder.streak.status === "reset") return <ResetRosaryState onPrayRosary={onPrayRosary} />;
  if (reminder.streak.status === "none") return <CompactRosaryState onPrayRosary={onPrayRosary} reminder={reminder} />;
  if (state === "expired") return <ExpiredRosaryState />;
  if (state === "normal") return <CompactRosaryState onPrayRosary={onPrayRosary} reminder={reminder} />;

  const countdownState =
    state === "final-fifteen" || state === "one-hour" || state === "three-hour" ? state : "three-hour";

  return (
    <CountdownRosaryState
      countdown={countdown}
      onPrayRosary={onPrayRosary}
      reminder={reminder}
      state={countdownState}
    />
  );
}

/** Renders CardAction with styles resolved from the active appearance. */
function CardAction({ onPress }: { onPress: () => void }) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Pressable
      accessibilityLabel="Pray Rosary"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Text style={styles.actionText}>PRAY ROSARY</Text>
      <Feather accessible={false} color={theme.colors.text.inverse} name="chevron-right" size={theme.sizes.iconSmall} />
    </Pressable>
  );
}

/** Renders CompactRosaryState with styles resolved from the active appearance. */
function CompactRosaryState({
  onPrayRosary,
  reminder,
}: {
  onPrayRosary: () => void;
  reminder: RosaryReminderViewModel;
}) {
  const styles = useThemedStyles(styleSheet);
  return (
    <LinearGradient
      colors={theme.colors.gradients.dailyRosary}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.compactCopy}>
        <View style={styles.titleRow}>
          <Feather accessible={false} color={theme.colors.gold.pale} name="circle" size={theme.sizes.iconSmall} />
          <Text accessibilityRole="header" style={styles.title}>
            Daily Rosary
          </Text>
        </View>
        <StreakCopy reminder={reminder} />
        <Text style={styles.supporting}>Today’s Rosary is waiting for you.</Text>
      </View>
      <CardAction onPress={onPrayRosary} />
    </LinearGradient>
  );
}

/** Renders CountdownRosaryState with styles resolved from the active appearance. */
function CountdownRosaryState({
  countdown,
  onPrayRosary,
  reminder,
  state,
}: {
  countdown: ReturnType<typeof useServerSynchronizedCountdown>;
  onPrayRosary: () => void;
  reminder: RosaryReminderViewModel;
  state: Exclude<RosaryReminderState, "completed" | "expired" | "normal">;
}) {
  const styles = useThemedStyles(styleSheet);
  const colors =
    state === "final-fifteen"
      ? theme.colors.gradients.countdownFinal
      : state === "one-hour"
        ? theme.colors.gradients.countdownHour
        : theme.colors.gradients.countdownDefault;

  return (
    <LinearGradient
      colors={colors}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.card, styles.countdownCard]}
    >
      <Text accessibilityRole="header" style={styles.countdownTitle}>
        Daily Rosary
      </Text>
      <Feather
        accessible={false}
        color={theme.colors.gold.light}
        name="circle"
        size={theme.sizes.iconLarge}
        style={styles.countdownIcon}
      />
      <Text
        accessibilityLabel={`Rosary countdown: ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds`}
        style={styles.timer}
      >
        {`${twoDigits(countdown.hours)} : ${twoDigits(countdown.minutes)} : ${twoDigits(countdown.seconds)}`}
      </Text>
      <View style={styles.timerLabels}>
        <Text style={styles.timerLabel}>HOURS</Text>
        <Text style={styles.timerLabel}>MINUTES</Text>
        <Text style={styles.timerLabel}>SECONDS</Text>
      </View>
      <Text style={styles.countdownCopy}>Complete your Rosary to keep your streak.</Text>
      <StreakCopy reminder={reminder} />
      <CardAction onPress={onPrayRosary} />
    </LinearGradient>
  );
}

/** Renders CompletedRosaryState with styles resolved from the active appearance. */
function CompletedRosaryState({ reminder }: { reminder: RosaryReminderViewModel }) {
  const styles = useThemedStyles(styleSheet);
  return (
    <LinearGradient
      colors={theme.colors.gradients.dailyRosaryComplete}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.completedIcon}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="check" size={theme.sizes.iconMedium} />
      </View>
      <View style={styles.completedCopy}>
        <Text accessibilityRole="header" style={styles.completedTitle}>
          Today’s Rosary Complete
        </Text>
        <StreakCopy reminder={reminder} />
      </View>
    </LinearGradient>
  );
}

/** Renders ExpiredRosaryState with styles resolved from the active appearance. */
function ExpiredRosaryState() {
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel="Updating today's Rosary status" style={[styles.card, styles.transitionCard]}>
      <Text accessibilityRole="header" style={styles.title}>
        Daily Rosary
      </Text>
      <Text style={styles.supporting}>Updating today’s Rosary status…</Text>
    </View>
  );
}

/** Renders ResetRosaryState with styles resolved from the active appearance. */
function ResetRosaryState({ onPrayRosary }: { onPrayRosary: () => void }) {
  const styles = useThemedStyles(styleSheet);
  return (
    <LinearGradient
      colors={theme.colors.gradients.dailyRosaryReset}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.compactCopy}>
        <Text accessibilityRole="header" style={styles.title}>
          Streak Reset
        </Text>
        <Text style={styles.supporting}>Start again today.</Text>
      </View>
      <CardAction onPress={onPrayRosary} />
    </LinearGradient>
  );
}

/** Renders RosaryUnavailable with styles resolved from the active appearance. */
function RosaryUnavailable({
  error,
  onPrayRosary,
  onRetry,
}: {
  error: boolean;
  onPrayRosary: () => void;
  onRetry: () => void;
}) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.card}>
      <View style={styles.compactCopy}>
        <Text accessibilityRole="header" style={styles.title}>
          Daily Rosary
        </Text>
        <Text accessibilityRole={error ? "alert" : undefined} style={styles.supporting}>
          {error ? "Reminder unavailable." : "Today’s Rosary is waiting for you."}
        </Text>
        {error ? (
          <Pressable
            accessibilityLabel="Retry Rosary reminder"
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.retry}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        ) : null}
      </View>
      <CardAction onPress={onPrayRosary} />
    </View>
  );
}

/** Renders RosarySkeleton with styles resolved from the active appearance. */
function RosarySkeleton() {
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel="Loading Daily Rosary" style={[styles.card, styles.skeletonCard]}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonLine} />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  action: {
    alignItems: "center",
    backgroundColor: theme.colors.gold.pale,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  actionText: { ...theme.typography.button, color: theme.colors.text.inverse, letterSpacing: theme.letterSpacing.wide },
  card: {
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    minHeight: 142,
    overflow: "hidden",
    padding: theme.spacing[4],
  },
  compactCopy: { flex: 1, paddingRight: theme.spacing[3] },
  completedCopy: { flex: 1, marginLeft: theme.spacing[3] },
  completedIcon: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.14)",
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  completedTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.display,
  },
  countdownCard: { alignItems: "center", minHeight: 340 },
  countdownCopy: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  countdownIcon: { marginTop: theme.spacing[2] },
  countdownTitle: {
    ...theme.typography.heading3,
    color: theme.colors.gold.light,
    fontFamily: theme.fontFamilies.display,
  },
  pressed: { opacity: theme.opacity.pressed },
  retry: { alignSelf: "flex-start", justifyContent: "center", minHeight: theme.sizes.touchTarget },
  retryText: { ...theme.typography.button, color: theme.colors.gold.pale },
  skeletonCard: { backgroundColor: theme.colors.surface.navy, justifyContent: "center" },
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
  streak: { ...theme.typography.bodyMedium, color: theme.colors.gold.pale, marginTop: theme.spacing[1] },
  supporting: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  timer: {
    color: theme.colors.gold.light,
    flexShrink: 1,
    fontFamily: theme.fontFamilies.devotional,
    fontSize: 33,
    lineHeight: 42,
    marginTop: theme.spacing[2],
    maxWidth: "100%",
    textAlign: "center",
  },
  timerLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    fontSize: 9,
    letterSpacing: theme.letterSpacing.wide,
  },
  timerLabels: { flexDirection: "row", gap: theme.spacing[4], marginTop: theme.spacing[0.5] },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary, fontFamily: theme.fontFamilies.display },
  titleRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  transitionCard: { backgroundColor: theme.colors.surface.navy, justifyContent: "center" },
}));
