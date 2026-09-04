import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { RosaryGardenStats } from "@/features/prayer/rosary/garden/types";

interface GardenStatsProps {
  stats: RosaryGardenStats;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function GardenStats({ stats }: GardenStatsProps) {
  const styles = useThemedStyles(styleSheet);
  const { isLargeText, isNarrowPhone } = useResponsiveLayout();
  const reduceMotion = useReducedMotion();
  const compact = isNarrowPhone;
  const stackStats = isLargeText || compact;
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
    <View style={[styles.card, stackStats && styles.cardStacked]}>
      {values.map((item, index) => (
        <Animated.View
          accessibilityLabel={item.accessibility}
          entering={reduceMotion ? undefined : FadeIn.duration(250)}
          key={item.label}
          style={[styles.stat, index > 0 && styles.separator, stackStats && index > 0 && styles.separatorStacked]}
        >
          <View style={[styles.iconCircle, { backgroundColor: `${item.color}22` }]}>
            <Feather
              accessible={false}
              color={item.color}
              name={item.icon}
              size={compact ? theme.sizes.iconXs : theme.sizes.iconSmall}
            />
          </View>
          <Text numberOfLines={stackStats ? undefined : 1} style={[styles.label, compact && styles.compactLabel]}>
            {item.label}
          </Text>
          <Text style={[styles.value, compact && styles.compactValue]}>{item.value}</Text>
          <Text numberOfLines={stackStats ? undefined : 1} style={[styles.sublabel, compact && styles.compactSubLabel]}>
            {item.sublabel}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: "rgba(14, 44, 60, 0.92)",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    paddingVertical: theme.spacing[3],
  },
  cardStacked: { flexDirection: "column" },
  stat: { alignItems: "center", flex: 1, minWidth: 0, paddingHorizontal: theme.spacing[1] },
  separator: { borderLeftColor: theme.colors.border.default, borderLeftWidth: theme.borderWidths.hairline },
  separatorStacked: {
    borderLeftWidth: theme.spacing[0],
    borderTopColor: theme.colors.border.default,
    borderTopWidth: theme.borderWidths.hairline,
  },
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
}));
