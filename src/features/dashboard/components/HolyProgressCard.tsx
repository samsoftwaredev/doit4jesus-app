import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import type { DashboardProgress, UserRosaryStats } from "@/features/progress";
import { theme } from "@/theme/tokens";

import { formatPoints } from "../rosary-reminder";

const rosaryIcon = require("../../../assets/icons/rosary.png");

type HolyProgressCardProps = {
  isLoadingProgress: boolean;
  isLoadingStats: boolean;
  progress: DashboardProgress | null;
  progressError: boolean;
  rosaryStats: UserRosaryStats | null;
  statsError: boolean;
};

function MetricValue({ error, isLoading, value }: { error: boolean; isLoading: boolean; value: string | null }) {
  if (isLoading) return <View accessibilityLabel="Loading holy progress" style={styles.metricSkeleton} />;
  if (error || value === null) return <Text style={styles.unavailable}>—</Text>;
  return <Text style={styles.metricValue}>{value}</Text>;
}

/** A single ornamental panel; its metrics are intentionally not separate generic cards. */
export function HolyProgressCard({
  isLoadingProgress,
  isLoadingStats,
  progress,
  progressError,
  rosaryStats,
  statsError,
}: HolyProgressCardProps) {
  const level = progress?.currentLevel?.levelNumber ?? null;
  const levelName = progress?.currentLevel?.name ?? null;
  const points = progress?.lifetimePoints ?? null;
  const rosaries = rosaryStats?.rosariesPrayed ?? null;

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

        <View accessibilityLabel={`Level, ${level ?? "unavailable"}`} style={styles.levelMetric}>
          <View style={styles.levelBadge}>
            <MaterialCommunityIcons
              accessible={false}
              color={theme.colors.gold.pale}
              name="shield-cross"
              size={theme.sizes.iconMedium}
            />
            <Text style={styles.metricLabel}>LEVEL</Text>
            <MetricValue
              error={progressError}
              isLoading={isLoadingProgress}
              value={level === null ? null : String(level)}
            />
          </View>
          {!isLoadingProgress && !progressError && levelName ? <Text style={styles.levelName}>{levelName}</Text> : null}
        </View>

        <View accessibilityLabel={`Points, ${points ?? "unavailable"}`} style={styles.sideMetric}>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.gold.pale}
            name="trophy-outline"
            size={theme.sizes.iconLarge}
          />
          <Text style={styles.metricLabel}>POINTS</Text>
          <MetricValue
            error={progressError}
            isLoading={isLoadingProgress}
            value={points === null ? null : formatPoints(points)}
          />
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
    minHeight: 244,
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
    marginTop: theme.spacing[3],
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
});
