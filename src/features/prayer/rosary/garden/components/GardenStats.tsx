import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { RosaryGardenStats } from "@/features/prayer/rosary/garden/types";

interface GardenStatsProps {
  stats: RosaryGardenStats;
}

/** Renders Garden statistics as a borderless region within the unified Garden card. */
export function GardenStats({ stats }: GardenStatsProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { isLargeText, isNarrowPhone } = useResponsiveLayout();
  const reduceMotion = useReducedMotion();
  const compact = isNarrowPhone;
  const stackStats = isLargeText || compact;
  const values = [
    {
      accessibility: t("rosary.garden.completedLabel", { count: stats.completedDays }),
      color: theme.colors.semantic.success,
      icon: "check",
      label: t("rosary.garden.completed"),
      sublabel: t("rosary.garden.ofDays", { count: stats.eligibleDays }),
      value: stats.completedDays,
    },
    {
      accessibility: t("rosary.garden.currentStreakLabel", { count: stats.currentStreak }),
      color: theme.rosary.colors.gold,
      icon: "zap",
      label: t("rosary.garden.currentStreak"),
      sublabel: t("rosary.garden.days"),
      value: stats.currentStreak,
    },
    {
      accessibility: t("rosary.garden.longestStreakLabel", { count: stats.longestStreak }),
      color: theme.colors.accent.blueLight,
      icon: "award",
      label: t("rosary.garden.longestStreak"),
      sublabel: t("rosary.garden.days"),
      value: stats.longestStreak,
    },
  ] as const;

  return (
    <View style={[styles.card, stackStats && styles.cardStacked]} testID="garden-stats">
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
    backgroundColor: theme.colors.transparent,
    borderRadius: theme.spacing[0],
    borderWidth: theme.spacing[0],
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
    color: theme.rosary.colors.gardenTextMuted,
    fontSize: 9,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  compactLabel: { fontSize: 7, letterSpacing: 0 },
  value: { ...theme.typography.heading2, color: theme.rosary.colors.gardenTextPrimary, marginTop: theme.spacing[0.5] },
  compactValue: { fontSize: theme.fontSizes.xl, lineHeight: theme.lineHeights.xl },
  sublabel: {
    ...theme.typography.caption,
    color: theme.rosary.colors.gardenTextMuted,
    fontSize: 9,
    marginTop: theme.spacing[0.5],
    textAlign: "center",
  },
  compactSubLabel: { fontSize: 7 },
}));
