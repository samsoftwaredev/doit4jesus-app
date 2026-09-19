import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui";
import { useResponsiveLayout } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { useFriendsComparison } from "../../friends.hooks";
import { CompareStatsRow } from "../CompareStatsRow";
import { FriendsState } from "../FriendsState";
import { formatPoints } from "../LeaderboardEntries";
import { LeaderboardPeriodSelector } from "../LeaderboardPeriodSelector";

export interface CompareStatsSectionProps {
  friendId: string | undefined;
}

/** Returns localized encouragement based on the selected period's point difference. */
function getEncouragement(
  userPoints: number,
  friendPoints: number,
  locale: string,
  translate: (key: string, options?: Record<string, unknown>) => string,
) {
  const difference = Math.abs(userPoints - friendPoints);
  if (difference === 0) return translate("friends.compare.encouragementEqual");
  const points = formatPoints(difference, locale);
  if (userPoints > friendPoints) return translate("friends.compare.encouragementAhead", { points });
  return translate("friends.compare.encouragementTrailing", { points });
}

/** Embeds recoverable weekly/yearly friend comparison content without creating a nested scroll view. */
export function CompareStatsSection({ friendId }: CompareStatsSectionProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const { isLargeText, isNarrowPhone } = useResponsiveLayout();
  const comparison = useFriendsComparison(friendId);
  const stackNames = isLargeText || isNarrowPhone;

  return (
    <View style={styles.section}>
      <View style={styles.headingGroup}>
        <Text accessibilityRole="header" style={styles.heading}>
          {t("friends.compare.title")}
        </Text>
        <Text style={styles.description}>{t("friends.compare.description")}</Text>
      </View>

      {comparison.isLoading ? (
        <FriendsState message={t("friends.compare.loading")} title={t("friends.compare.loadingTitle")} type="loading" />
      ) : null}
      {comparison.error ? (
        <FriendsState
          actionLabel={t("profile.tryAgain")}
          message={comparison.error}
          onAction={() => void comparison.reload()}
          title={t("friends.compare.loadError")}
          type="error"
        />
      ) : null}
      {comparison.currentUser && comparison.friend && !comparison.isLoading && !comparison.error ? (
        <View style={styles.comparisonContent}>
          <View style={[styles.names, stackNames && styles.namesStacked]} testID="compare-stats-names">
            <Text numberOfLines={stackNames ? undefined : 1} style={styles.name}>
              {t("friends.compare.you")}
            </Text>
            <Text style={[styles.vs, stackNames && styles.vsStacked]}>{t("friends.compare.vs")}</Text>
            <Text numberOfLines={stackNames ? undefined : 1} style={styles.name}>
              {comparison.friend.profile.displayName.toUpperCase()}
            </Text>
          </View>
          <LeaderboardPeriodSelector onChange={comparison.setPeriodType} value={comparison.periodType} />
          <Card padding="md" variant="elevated">
            <CompareStatsRow
              friendValue={comparison.friend.periodPoints}
              label={t("friends.compare.points")}
              userValue={comparison.currentUser.periodPoints}
            />
            <CompareStatsRow
              friendValue={comparison.friend.rosaryTotal}
              label={t("friends.compare.totalRosaries")}
              userValue={comparison.currentUser.rosaryTotal}
            />
            <CompareStatsRow
              friendValue={comparison.friend.rosaryStreak.currentStreak}
              label={t("friends.compare.rosaryStreak")}
              userValue={comparison.currentUser.rosaryStreak.currentStreak}
            />
            <CompareStatsRow
              friendValue={comparison.friend.badgeCount}
              label={t("friends.compare.badges")}
              userValue={comparison.currentUser.badgeCount}
            />
            <CompareStatsRow
              friendValue={comparison.friend.currentLevel.levelNumber}
              label={t("friends.compare.level")}
              userValue={comparison.currentUser.currentLevel.levelNumber}
            />
          </Card>
          <Card padding="md" variant="success">
            <Text style={styles.encouragement}>
              {getEncouragement(comparison.currentUser.periodPoints, comparison.friend.periodPoints, locale, t)}
            </Text>
          </Card>
        </View>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  comparisonContent: { gap: theme.spacing[4] },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
  encouragement: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.success,
    textAlign: "center",
  },
  heading: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  headingGroup: { gap: theme.spacing[1] },
  name: {
    ...theme.typography.heading3,
    flex: 1,
    minWidth: 0,
    textAlign: "center",
  },
  names: {
    alignItems: "center",
    flexDirection: "row",
  },
  namesStacked: {
    flexDirection: "column",
    gap: theme.spacing[1],
  },
  section: { gap: theme.spacing[4], width: "100%" },
  vs: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    marginHorizontal: theme.spacing[2],
  },
  vsStacked: { marginHorizontal: 0 },
}));
