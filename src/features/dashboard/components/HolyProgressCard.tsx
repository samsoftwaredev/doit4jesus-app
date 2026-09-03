import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import type { DashboardProgress, LevelCatalogEntry, RecentRosaryActivity, UserRosaryStats } from "@/features/progress";
import { theme } from "@/theme/tokens";

import { formatPoints } from "../rosary-reminder";

const rosaryIcon = require("../../../assets/icons/rosary.png");
const DEFAULT_LEVEL_NAME = "Awakened";
const DEFAULT_LEVEL_NUMBER = 1;
const DEFAULT_PROGRESS_VALUE = 0;

type HolyProgressCardProps = {
  detailsError: boolean;
  isLoadingDetails: boolean;
  isLoadingProgress: boolean;
  isLoadingStats: boolean;
  levelCatalog: LevelCatalogEntry[] | null;
  progress: DashboardProgress | null;
  progressError: boolean;
  recentRosaryActivities: RecentRosaryActivity[] | null;
  rosaryStats: UserRosaryStats | null;
  statsError: boolean;
};

function MetricValue({ error, isLoading, value }: { error: boolean; isLoading: boolean; value: string | null }) {
  if (isLoading) return <View accessibilityLabel="Loading holy progress" style={styles.metricSkeleton} />;
  if (error || value === null) return <Text style={styles.unavailable}>—</Text>;
  return <Text style={styles.metricValue}>{value}</Text>;
}

function formatActivityDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date);
}

/** A single ornamental panel; its metrics are intentionally not separate generic cards. */
export function HolyProgressCard({
  detailsError,
  isLoadingDetails,
  isLoadingProgress,
  isLoadingStats,
  levelCatalog,
  progress,
  progressError,
  recentRosaryActivities,
  rosaryStats,
  statsError,
}: HolyProgressCardProps) {
  const level = progress?.currentLevel?.levelNumber ?? DEFAULT_LEVEL_NUMBER;
  const levelName = progress?.currentLevel?.name ?? DEFAULT_LEVEL_NAME;
  const points = progress?.lifetimePoints ?? DEFAULT_PROGRESS_VALUE;
  const rosaries = rosaryStats?.rosariesPrayed ?? null;
  const latestRosary = recentRosaryActivities?.[0] ?? null;
  const nextLevelFromCatalog = levelCatalog?.find((entry) => entry.levelNumber === progress?.nextLevel?.levelNumber);
  const nextLevelName = nextLevelFromCatalog?.name ?? progress?.nextLevel?.name ?? null;
  const totalXp = progress?.totalXp ?? DEFAULT_PROGRESS_VALUE;
  const weeklyPoints = progress?.weeklyPoints ?? DEFAULT_PROGRESS_VALUE;
  const xpIntoCurrentLevel = progress?.xpIntoCurrentLevel ?? null;
  const xpRequiredForNextLevel = progress?.xpRequiredForNextLevel ?? null;
  const levelProgressPercentage = progress?.levelProgressPercentage ?? null;
  const hasXpProgress =
    xpIntoCurrentLevel !== null && xpRequiredForNextLevel !== null && xpRequiredForNextLevel > 0 && !progressError;
  const latestRosaryDate = latestRosary
    ? formatActivityDate(latestRosary.completedAt ?? latestRosary.occurredAt)
    : null;
  const latestRosaryText = latestRosary
    ? `${formatPoints(latestRosary.quantity)} ${latestRosary.quantity === 1 ? "Rosary" : "Rosaries"}${
        latestRosaryDate ? ` · ${latestRosaryDate}` : ""
      }`
    : null;

  return (
    <LinearGradient
      colors={["rgba(23, 53, 73, 0.98)", "rgba(9, 25, 38, 0.98)"]}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0.5, y: 0 }}
      style={styles.card}
    >
      <View pointerEvents="none" style={styles.innerHighlight} />
      <View accessibilityRole="header" style={styles.headingFrame}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="plus" size={theme.sizes.iconSmall} />
        <Text style={styles.heading}>HOLY PROGRESS</Text>
      </View>

      <View style={styles.metrics}>
        <View accessibilityLabel={`Rosaries, ${rosaries ?? "unavailable"}`} style={styles.sideMetric}>
          <Image accessible={false} contentFit="contain" source={rosaryIcon} style={styles.rosaryIcon} />
          <Text style={styles.metricLabel}>ROSARIES</Text>
          <MetricValue
            error={statsError}
            isLoading={isLoadingStats}
            value={rosaries === null ? null : formatPoints(rosaries)}
          />
        </View>

        <View accessibilityLabel={`Level, ${progressError ? "unavailable" : level}`} style={styles.levelMetric}>
          <View style={styles.levelBadge}>
            <MaterialCommunityIcons
              accessible={false}
              color={theme.colors.gold.pale}
              name="shield-cross"
              size={theme.sizes.iconMedium}
            />
            <Text style={styles.metricLabel}>LEVEL</Text>
            <MetricValue error={progressError} isLoading={isLoadingProgress} value={String(level)} />
          </View>
          {!isLoadingProgress && !progressError && levelName ? <Text style={styles.levelName}>{levelName}</Text> : null}
        </View>

        <View accessibilityLabel={`Points, ${progressError ? "unavailable" : points}`} style={styles.sideMetric}>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.gold.pale}
            name="trophy-outline"
            size={theme.sizes.iconLarge}
          />
          <Text style={styles.metricLabel}>POINTS</Text>
          <MetricValue error={progressError} isLoading={isLoadingProgress} value={formatPoints(points)} />
        </View>
      </View>

      <View style={styles.detailBand}>
        <View style={styles.xpSection}>
          <Text style={styles.detailLabel}>PATH TO NEXT LEVEL</Text>
          {isLoadingProgress ? (
            <View accessibilityLabel="Loading level progress" style={styles.detailSkeleton} />
          ) : null}
          {!isLoadingProgress && hasXpProgress ? (
            <>
              <Text style={styles.xpValue}>
                {formatPoints(xpIntoCurrentLevel)} / {formatPoints(xpRequiredForNextLevel)} XP
              </Text>
              <View
                accessibilityLabel={`Level progress: ${formatPoints(xpIntoCurrentLevel)} of ${formatPoints(
                  xpRequiredForNextLevel,
                )} XP${nextLevelName ? `. Next: ${nextLevelName}.` : "."}`}
                accessibilityRole="progressbar"
                accessibilityValue={{
                  max: xpRequiredForNextLevel,
                  min: 0,
                  now: Math.min(xpIntoCurrentLevel, xpRequiredForNextLevel),
                }}
                style={styles.progressTrack}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(Math.max(levelProgressPercentage ?? 0, 0), 100)}%` },
                  ]}
                />
              </View>
              {levelProgressPercentage !== null ? (
                <Text style={styles.progressCaption}>
                  {Math.round(levelProgressPercentage)}% toward {nextLevelName ?? "the next level"}
                </Text>
              ) : null}
            </>
          ) : null}
          {!isLoadingProgress && !hasXpProgress ? (
            <Text style={styles.detailUnavailable}>Progress unavailable</Text>
          ) : null}
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.secondaryDetails}>
          <View style={styles.secondaryMetric}>
            <Text style={styles.detailLabel}>TOTAL XP</Text>
            {isLoadingProgress ? <View accessibilityLabel="Loading total XP" style={styles.compactSkeleton} /> : null}
            {!isLoadingProgress ? (
              <Text style={styles.secondaryValue}>{progressError ? "—" : formatPoints(totalXp)}</Text>
            ) : null}
          </View>
          <View style={styles.secondaryMetric}>
            <Text style={styles.detailLabel}>THIS WEEK</Text>
            {isLoadingProgress ? (
              <View accessibilityLabel="Loading weekly points" style={styles.compactSkeleton} />
            ) : null}
            {!isLoadingProgress ? (
              <Text style={styles.secondaryValue}>{progressError ? "—" : formatPoints(weeklyPoints)}</Text>
            ) : null}
          </View>
          <View style={styles.secondaryMetric}>
            <Text style={styles.detailLabel}>RECENT ROSARY</Text>
            {isLoadingDetails ? (
              <View accessibilityLabel="Loading recent Rosary" style={styles.compactSkeleton} />
            ) : null}
            {!isLoadingDetails ? (
              <Text numberOfLines={1} style={styles.latestRosaryValue}>
                {latestRosaryText ?? (detailsError ? "—" : "None yet")}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View accessibilityLabel="Sacred heart ornament" style={styles.heartOrnament}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="heart" size={theme.sizes.iconXs} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    minHeight: 350,
    overflow: "hidden",
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[4],
    position: "relative",
  },
  heading: {
    ...theme.typography.heading3,
    color: theme.colors.gold.pale,
    fontFamily: theme.fontFamilies.devotional,
    letterSpacing: theme.letterSpacing.wide,
  },
  headingFrame: {
    alignItems: "center",
    alignSelf: "center",
    borderBottomColor: "rgba(230, 186, 100, 0.5)",
    borderBottomWidth: theme.borderWidths.hairline,
    borderTopColor: "rgba(230, 186, 100, 0.5)",
    borderTopWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[1],
  },
  heartOrnament: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: "rgba(230, 186, 100, 0.55)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.spacing[5],
    justifyContent: "center",
    marginTop: theme.spacing[2],
    width: theme.spacing[5],
  },
  innerHighlight: {
    borderColor: "rgba(241, 196, 106, 0.12)",
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    bottom: theme.spacing[1],
    left: theme.spacing[1],
    pointerEvents: "none",
    position: "absolute",
    right: theme.spacing[1],
    top: theme.spacing[1],
  },
  compactSkeleton: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: 18,
    marginTop: theme.spacing[1],
    width: 48,
  },
  detailBand: {
    borderTopColor: "rgba(230, 186, 100, 0.28)",
    borderTopWidth: theme.borderWidths.hairline,
    marginTop: theme.spacing[3],
    paddingTop: theme.spacing[3],
  },
  detailDivider: {
    backgroundColor: "rgba(230, 186, 100, 0.22)",
    height: theme.borderWidths.hairline,
    marginVertical: theme.spacing[2],
  },
  detailLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    fontSize: 9,
    letterSpacing: theme.letterSpacing.wider,
    textAlign: "center",
  },
  detailSkeleton: {
    alignSelf: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: 20,
    marginTop: theme.spacing[1],
    width: 128,
  },
  detailUnavailable: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  levelBadge: {
    alignItems: "center",
    backgroundColor: "rgba(98, 71, 29, 0.4)",
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    minHeight: 116,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[2],
    width: "100%",
  },
  levelMetric: {
    alignItems: "center",
    flex: 1.15,
    justifyContent: "center",
    minWidth: 82,
  },
  levelName: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  metricLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  metricSkeleton: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: 30,
    marginTop: theme.spacing[1],
    width: 44,
  },
  metricValue: {
    color: theme.colors.gold.light,
    fontFamily: theme.fontFamilies.devotional,
    fontSize: 30,
    lineHeight: 38,
    marginTop: theme.spacing[0.5],
    textAlign: "center",
  },
  metrics: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "space-between",
    marginTop: theme.spacing[4],
  },
  rosaryIcon: {
    height: theme.sizes.iconLarge,
    width: theme.sizes.iconLarge,
  },
  latestRosaryValue: {
    ...theme.typography.caption,
    color: theme.colors.gold.light,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  progressCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  progressFill: {
    backgroundColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
  },
  progressTrack: {
    backgroundColor: "rgba(7, 16, 27, 0.78)",
    borderColor: "rgba(230, 186, 100, 0.32)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: 8,
    marginTop: theme.spacing[1],
    overflow: "hidden",
  },
  secondaryDetails: {
    flexDirection: "row",
    gap: theme.spacing[1],
    justifyContent: "space-between",
  },
  secondaryMetric: {
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  secondaryValue: {
    ...theme.typography.caption,
    color: theme.colors.gold.light,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  sideMetric: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minWidth: 70,
  },
  unavailable: {
    ...theme.typography.heading3,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  xpSection: {
    alignItems: "stretch",
  },
  xpValue: {
    ...theme.typography.heading3,
    color: theme.colors.gold.light,
    fontFamily: theme.fontFamilies.devotional,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
});
