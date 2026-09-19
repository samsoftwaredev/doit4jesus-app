import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { getLeaderboardPeriodLabelKey, leaderboardPeriodOptions } from "../../friends.periods";
import type { LeaderboardPeriodType } from "../../friends.types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

export interface LeaderboardPeriodSelectorProps {
  onChange: (periodType: LeaderboardPeriodType) => void;
  value: LeaderboardPeriodType;
}

/** Renders the shared, accessible Week/Year selector used by rankings and comparisons. */
export function LeaderboardPeriodSelector({ onChange, value }: LeaderboardPeriodSelectorProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <View accessibilityRole="tablist" style={styles.periods}>
      {leaderboardPeriodOptions.map((periodType) => {
        const selected = value === periodType;
        const label = t(getLeaderboardPeriodLabelKey(periodType));

        return (
          <Pressable
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={periodType}
            onPress={() => onChange(periodType)}
            style={[styles.periodButton, selected && styles.periodButtonSelected]}
          >
            <Text style={[styles.periodButtonText, selected && styles.periodButtonTextSelected]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  periodButton: {
    alignItems: "center",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    flexBasis: theme.sizes.touchTarget * 3,
    flexGrow: 1,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[2],
  },
  periodButtonSelected: {
    backgroundColor: theme.colors.gold.primary,
    borderColor: theme.colors.gold.primary,
  },
  periodButtonText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  periodButtonTextSelected: {
    color: theme.colors.text.inverse,
  },
  periods: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[1],
  },
}));
