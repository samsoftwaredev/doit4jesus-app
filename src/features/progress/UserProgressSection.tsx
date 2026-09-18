import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/ui";
import { fetchRosaryStreak } from "@/features/prayer/rosary/garden/api";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { fetchRosaryStats, fetchUserProgress } from "./progress.api";
import { StreakCards } from "./StreakCards";

type UserProgressStats = {
  currentStreak: number;
  lifetimePoints: number;
  longestStreak: number;
  rosariesPrayed: number;
};

/** Loads the user's Rosary streak and presents it with the dashboard Rosary action. */
export function UserProgressSection() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<UserProgressStats | null>(null);

  /** Refreshes the statistics used by the extracted streak-card group. */
  const loadProgress = useCallback(async () => {
    setIsLoadingStats(true);

    try {
      const [streak, rosaryStats, progress] = await Promise.all([
        fetchRosaryStreak(),
        fetchRosaryStats(),
        fetchUserProgress(),
      ]);
      setStats({
        currentStreak: streak.currentStreak,
        lifetimePoints: progress.lifetimePoints,
        longestStreak: streak.longestStreak,
        rosariesPrayed: rosaryStats.rosariesPrayed,
      });
    } catch {
      setStats(null);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  return (
    <View accessibilityLabel={t("progress.sectionLabel")} style={styles.section}>
      {isLoadingStats ? (
        <StreakCards isLoading />
      ) : stats ? (
        <StreakCards currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} />
      ) : (
        <ProgressLoadError message={t("progress.loadError")} onRetry={loadProgress} />
      )}

      <View style={styles.divider} />
    </View>
  );
}

/** Renders ProgressLoadError with styles resolved from the active appearance. */
function ProgressLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card contentStyle={styles.errorContent} padding="md" variant="outlined">
      <Text style={styles.errorText}>{message}</Text>
      <Pressable
        accessibilityLabel={t("progress.retryLabel")}
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.retryButton}
      >
        <Text style={styles.retryText}>{t("common.retry")}</Text>
      </Pressable>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  createRosaryButton: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.md,
    flexDirection: "row",
    height: 56,
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[4],
  },
  createRosaryButtonPressed: {
    opacity: theme.opacity.pressed,
  },
  createRosaryLabel: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
    flex: 1,
    marginHorizontal: theme.spacing[2],
    textAlign: "center",
  },
  divider: {
    backgroundColor: theme.colors.border.subtle,
    height: theme.borderWidths.hairline,
    marginVertical: theme.spacing[5],
  },
  errorContent: {
    alignItems: "center",
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
  retryButton: {
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[3],
  },
  retryText: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
  rosaryButtonIcon: {
    height: theme.sizes.iconMedium,
    width: theme.sizes.iconMedium,
  },
  rosaryStatIcon: {
    height: theme.sizes.iconLarge,
    width: theme.sizes.iconLarge,
  },
  section: {
    marginBottom: theme.spacing[4],
  },
}));
