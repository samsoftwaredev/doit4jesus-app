import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppLanguage } from "@/localization";
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

/** Explains daily streak counting and groups the current and longest Rosary streak cards. */
export function StreakCards(props: StreakCardsProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const cardStyle = styles.rowCard;

  return (
    <View style={styles.layout} testID="streak-cards-layout">
      <Text style={styles.explanation}>{t("progress.streakDailyLimit")}</Text>
      <View accessibilityLabel={t("progress.streakLabel")} style={styles.rowLayout}>
        {props.isLoading ? (
          Array.from({ length: 2 }, (_, index) => (
            <View accessibilityLabel={t("progress.loadingStreak")} key={index} style={[styles.skeleton, cardStyle]}>
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
              label={t("progress.streak")}
              style={cardStyle}
              suffix={t("progress.days")}
              value={new Intl.NumberFormat(locale).format(props.currentStreak)}
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
              label={t("progress.longestStreak")}
              style={cardStyle}
              suffix={t("progress.days")}
              value={new Intl.NumberFormat(locale).format(props.longestStreak)}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  layout: {
    flexDirection: "column",
    gap: theme.spacing[2],
    width: "100%",
  },
  explanation: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  rowCard: {
    flex: 1,
    minWidth: theme.spacing[0],
  },
  rowLayout: {
    flexDirection: "row",
    gap: theme.spacing[2],
    width: "100%",
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
