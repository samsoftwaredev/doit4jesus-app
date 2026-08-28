import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { Card } from "@/components/ui";
import { fetchRosaryStreak } from "@/features/prayer/rosary/garden/api";
import { theme } from "@/theme/tokens";

import { EarnedBadgeRow } from "./EarnedBadgeRow";
import { fetchEarnedBadges, fetchRosaryStats, fetchUserProgress } from "./progress.api";
import type { EarnedBadge } from "./progress.types";
import { ProgressStatCard } from "./ProgressStatCard";

const rosaryIcon = require("../../assets/icons/rosary.png");

type UserProgressStats = {
  currentStreak: number;
  lifetimePoints: number;
  longestStreak: number;
  rosariesPrayed: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function UserProgressSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [badgesError, setBadgesError] = useState(false);
  const [isLoadingBadges, setIsLoadingBadges] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<UserProgressStats | null>(null);

  const cardWidth = useMemo(() => {
    const availableWidth = Math.min(width, theme.sizes.contentMaxWidth);
    return (availableWidth - theme.spacing[4] * 2 - theme.spacing[2]) / 2;
  }, [width]);

  const loadProgress = useCallback(async () => {
    setIsLoadingStats(true);
    setIsLoadingBadges(true);
    setBadgesError(false);

    const [statsResult, badgesResult] = await Promise.allSettled([
      Promise.all([fetchRosaryStreak(), fetchRosaryStats(), fetchUserProgress()]),
      fetchEarnedBadges(),
    ] as const);

    if (statsResult.status === "fulfilled") {
      const [streak, rosaryStats, progress] = statsResult.value;
      setStats({
        currentStreak: streak.currentStreak,
        lifetimePoints: progress.lifetimePoints,
        longestStreak: streak.longestStreak,
        rosariesPrayed: rosaryStats.rosariesPrayed,
      });
    } else {
      setStats(null);
    }

    if (badgesResult.status === "fulfilled") {
      setBadges(badgesResult.value);
    } else {
      setBadges([]);
      setBadgesError(true);
    }

    setIsLoadingStats(false);
    setIsLoadingBadges(false);
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
        <ProgressStatsSkeleton cardWidth={cardWidth} />
      ) : stats ? (
        <View style={styles.statsGrid}>
          <ProgressStatCard
            icon={
              <MaterialCommunityIcons
                accessible={false}
                color={theme.rosary.colors.gold}
                name="fire"
                size={theme.sizes.iconLarge}
              />
            }
            label="STREAK"
            style={{ width: cardWidth }}
            suffix="days"
            value={formatNumber(stats.currentStreak)}
          />
          <ProgressStatCard
            icon={
              <MaterialCommunityIcons
                accessible={false}
                color={theme.rosary.colors.gold}
                name="crown"
                size={theme.sizes.iconLarge}
              />
            }
            label="LONGEST STREAK"
            style={{ width: cardWidth }}
            suffix="days"
            value={formatNumber(stats.longestStreak)}
          />
          <ProgressStatCard
            icon={<Image accessible={false} contentFit="contain" source={rosaryIcon} style={styles.rosaryStatIcon} />}
            label="ROSARIES PRAYED"
            style={{ width: cardWidth }}
            suffix="rosaries"
            value={formatNumber(stats.rosariesPrayed)}
          />
          <ProgressStatCard
            icon={
              <MaterialCommunityIcons
                accessible={false}
                color={theme.rosary.colors.gold}
                name="trophy"
                size={theme.sizes.iconLarge}
              />
            }
            label="POINTS EARNED"
            style={{ width: cardWidth }}
            suffix="points"
            value={formatNumber(stats.lifetimePoints)}
          />
        </View>
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
        <Text style={styles.createRosaryLabel}>Create a Rosary Today</Text>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.text.inverse}
          name="chevron-right"
          size={theme.sizes.iconMedium}
        />
      </Pressable>

      <View style={styles.badgesHeading}>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.rosary.colors.gold}
          name="shield-cross"
          size={theme.sizes.iconSmall}
        />
        <Text style={styles.badgesTitle}>ALL BADGES EARNED</Text>
      </View>

      {isLoadingBadges ? (
        <BadgeRowsSkeleton />
      ) : badgesError ? (
        <ProgressLoadError message="We couldn't load your badges." onRetry={loadProgress} />
      ) : badges.length === 0 ? (
        <Card contentStyle={styles.emptyBadgeContent} padding="md" variant="outlined">
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.text.subtle}
            name="shield-outline"
            size={theme.sizes.iconLarge}
          />
          <View style={styles.emptyBadgeCopy}>
            <Text style={styles.emptyBadgeTitle}>No badges earned yet.</Text>
            <Text style={styles.emptyBadgeDescription}>
              Complete Rosaries and build your streak to earn your first badge.
            </Text>
          </View>
        </Card>
      ) : (
        <Card contentStyle={styles.badgesContent} padding="none" style={styles.badgesCard} variant="outlined">
          {badges.map((badge, index) => (
            <EarnedBadgeRow badge={badge} isLast={index === badges.length - 1} key={badge.id} />
          ))}
        </Card>
      )}
    </View>
  );
}

function ProgressStatsSkeleton({ cardWidth }: { cardWidth: number }) {
  return (
    <View accessibilityLabel="Loading progress statistics" style={styles.statsGrid}>
      {Array.from({ length: 4 }, (_, index) => (
        <View accessibilityLabel="Loading progress" key={index} style={[styles.statCardSkeleton, { width: cardWidth }]}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonLabel} />
          <View style={styles.skeletonValue} />
          <View style={styles.skeletonSuffix} />
        </View>
      ))}
    </View>
  );
}

function BadgeRowsSkeleton() {
  return (
    <Card
      accessibilityLabel="Loading earned badges"
      contentStyle={styles.badgesContent}
      padding="none"
      variant="outlined"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <View
          accessibilityLabel="Loading badge"
          key={index}
          style={[styles.badgeSkeleton, index < 2 && styles.rowDivider]}
        >
          <View style={styles.skeletonBadgeIcon} />
          <View style={styles.skeletonBadgeCopy}>
            <View style={styles.skeletonBadgeName} />
            <View style={styles.skeletonBadgeDescription} />
          </View>
        </View>
      ))}
    </Card>
  );
}

function ProgressLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card contentStyle={styles.errorContent} padding="md" variant="outlined">
      <Text style={styles.errorText}>{message}</Text>
      <Pressable accessibilityLabel="Try again" accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  badgeSkeleton: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
  },
  badgesContent: {
    overflow: "hidden",
  },
  badgesCard: {
    overflow: "hidden",
  },
  badgesHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
    marginBottom: theme.spacing[2],
    marginTop: theme.spacing[6],
  },
  badgesTitle: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.wider,
  },
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
  emptyBadgeContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  emptyBadgeCopy: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },
  emptyBadgeDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  emptyBadgeTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.bodySemibold,
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
  rowDivider: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
  },
  section: {
    marginBottom: theme.spacing[4],
  },
  skeletonBadgeCopy: {
    flex: 1,
  },
  skeletonBadgeDescription: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[2],
    marginTop: theme.spacing[2],
    width: "80%",
  },
  skeletonBadgeIcon: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.pill,
    height: 48,
    marginRight: theme.spacing[3],
    width: 48,
  },
  skeletonBadgeName: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[3],
    width: "55%",
  },
  skeletonIcon: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.pill,
    height: theme.sizes.iconMedium,
    width: theme.sizes.iconMedium,
  },
  skeletonLabel: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[2],
    marginTop: theme.spacing[2],
    width: "62%",
  },
  skeletonSuffix: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[2],
    marginTop: theme.spacing[2],
    width: "38%",
  },
  skeletonValue: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[5],
    marginTop: theme.spacing[2],
    width: "42%",
  },
  statCardSkeleton: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.colors.border.strong,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: 136,
    padding: theme.spacing[3],
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
  },
});
