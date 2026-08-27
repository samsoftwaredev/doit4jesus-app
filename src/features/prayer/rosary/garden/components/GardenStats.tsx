import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { theme } from "@/theme/tokens";
import type { RosaryGardenStats } from "@/features/prayer/rosary/types";

interface GardenStatsProps {
  stats: RosaryGardenStats;
}

export function GardenStats({ stats }: GardenStatsProps) {
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = width < theme.breakpoints.smallPhone;
  const values = [
    {
      accessibility: `${stats.completedDays} rosaries completed this month`,
      color: theme.colors.semantic.success,
      icon: "check",
      label: "COMPLETED",
      sublabel: `OF ${stats.eligibleDays} DAYS`,
      value: stats.completedDays,
    },
    {
      accessibility: `Current streak ${stats.currentStreak} days`,
      color: theme.rosary.colors.gold,
      icon: "zap",
      label: "CURRENT STREAK",
      sublabel: "DAYS",
      value: stats.currentStreak,
    },
    {
      accessibility: `Longest streak ${stats.longestStreak} days`,
      color: theme.colors.accent.blueLight,
      icon: "award",
      label: "LONGEST STREAK",
      sublabel: "DAYS",
      value: stats.longestStreak,
    },
  ] as const;

  return (
    <View style={styles.card}>
      {values.map((item, index) => (
        <Animated.View
          accessibilityLabel={item.accessibility}
          entering={reduceMotion ? undefined : FadeIn.duration(250)}
          key={item.label}
          style={[styles.stat, index > 0 && styles.separator]}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${item.color}22` }]}>
            <Feather
              accessible={false}
              color={item.color}
              name={item.icon}
              size={compact ? theme.sizes.iconXs : theme.sizes.iconSmall}
            />
          </View>
          <Text numberOfLines={1} style={[styles.label, compact && styles.compactLabel]}>
            {item.label}
          </Text>
          <Text style={[styles.value, compact && styles.compactValue]}>{item.value}</Text>
          <Text numberOfLines={1} style={[styles.sublabel, compact && styles.compactSubLabel]}>
            {item.sublabel}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(14, 44, 60, 0.92)",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    paddingVertical: theme.spacing[3],
  },
  stat: { alignItems: "center", flex: 1, minWidth: 0, paddingHorizontal: theme.spacing[1] },
  separator: { borderLeftColor: theme.colors.border.default, borderLeftWidth: theme.borderWidths.hairline },
  iconCircle: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.spacing[7],
    justifyContent: "center",
    width: theme.spacing[7],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    fontSize: 9,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  compactLabel: { fontSize: 7, letterSpacing: 0 },
  value: { ...theme.typography.heading2, color: theme.colors.text.white, marginTop: theme.spacing[0.5] },
  compactValue: { fontSize: theme.fontSizes.xl, lineHeight: theme.lineHeights.xl },
  sublabel: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    fontSize: 9,
    marginTop: theme.spacing[0.5],
    textAlign: "center",
  },
  compactSubLabel: { fontSize: 7 },
});
