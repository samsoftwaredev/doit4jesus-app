import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { ProgressStatCard } from "./ProgressStatCard";

type StreakCardsProps =
  | {
      currentStreak: number;
      isLoading?: false;
      longestStreak: number;
    }
  | {
      currentStreak?: never;
      isLoading: true;
      longestStreak?: never;
    };

/** Groups the current and longest Rosary streak cards using the shared tablet breakpoint. */
export function StreakCards(props: StreakCardsProps) {
  const styles = useThemedStyles(styleSheet);
  const cardStyle = styles.rowCard;

  return (
    <View
      accessibilityLabel="Rosary streak statistics"
      style={[styles.layout, styles.rowLayout]}
      testID="streak-cards-layout"
    >
      {props.isLoading ? (
        Array.from({ length: 2 }, (_, index) => (
          <View accessibilityLabel="Loading streak statistic" key={index} style={[styles.skeleton, cardStyle]}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonLabel} />
            <View style={styles.skeletonValue} />
            <View style={styles.skeletonSuffix} />
          </View>
        ))
      ) : (
        <>
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
            style={cardStyle}
            suffix="days"
            value={new Intl.NumberFormat().format(props.currentStreak)}
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
            style={cardStyle}
            suffix="days"
            value={new Intl.NumberFormat().format(props.longestStreak)}
          />
        </>
      )}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  layout: {
    flexDirection: "column",
    gap: theme.spacing[2],
    width: "100%",
  },
  rowCard: {
    flex: 1,
    minWidth: theme.spacing[0],
  },
  rowLayout: {
    flexDirection: "row",
  },
  skeleton: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.colors.border.strong,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: 136,
    padding: theme.spacing[3],
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
}));
