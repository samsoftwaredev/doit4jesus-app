import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/ui";
import { fetchRosaryStreak } from "@/features/prayer/rosary/garden/api";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { fetchRosaryStats, fetchUserProgress } from "./progress.api";
import { StreakCards } from "./StreakCards";

const rosaryIcon = require("../../assets/icons/rosary.png");

type UserProgressStats = {
  currentStreak: number;
  lifetimePoints: number;
  longestStreak: number;
  rosariesPrayed: number;
};

/** Loads the user's Rosary streak and presents it with the dashboard Rosary action. */
export function UserProgressSection() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
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

  const handleCreateRosary = () => {
    router.push({ pathname: "/rosary", params: { source: "home-progress" } });
  };

  return (
    <View accessibilityLabel="User progress" style={styles.section}>
      {isLoadingStats ? (
        <StreakCards isLoading />
      ) : stats ? (
        <StreakCards currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} />
      ) : (
        <ProgressLoadError message="We couldn't load your progress." onRetry={loadProgress} />
      )}

      <View style={styles.divider} />

      <Pressable
        accessibilityLabel="Create a Rosary today"
        accessibilityRole="button"
        onPress={handleCreateRosary}
        style={({ pressed }) => [styles.createRosaryButton, pressed && styles.createRosaryButtonPressed]}
      >
        <Image accessible={false} contentFit="contain" source={rosaryIcon} style={styles.rosaryButtonIcon} />
        <Text style={styles.createRosaryLabel}>Pray Today's Rosary</Text>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.text.inverse}
          name="chevron-right"
          size={theme.sizes.iconMedium}
        />
      </Pressable>
    </View>
  );
}

/** Renders ProgressLoadError with styles resolved from the active appearance. */
function ProgressLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card contentStyle={styles.errorContent} padding="md" variant="outlined">
      <Text style={styles.errorText}>{message}</Text>
      <Pressable accessibilityLabel="Try again" accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Try Again</Text>
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
