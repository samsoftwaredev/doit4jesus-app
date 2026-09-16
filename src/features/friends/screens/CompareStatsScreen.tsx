import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Card } from "@/components/ui";
import { CompareStatsRow, FriendsState } from "@/features/friends/components";
import { formatPoints } from "@/features/friends/components/LeaderboardEntries";
import { useFriendsComparison } from "@/features/friends/friends.hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

/** Renders a side-by-side comparison with a friend within the shared atmosphere. */
export function CompareStatsScreen({ friendId }: { friendId: string | undefined }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const router = useRouter();
  const comparison = useFriendsComparison(friendId);

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.compare.description")}
        onBack={() => router.back()}
        title={t("friends.compare.title")}
      />
      {comparison.isLoading ? (
        <View style={styles.state}>
          <FriendsState
            message={t("friends.compare.loading")}
            title={t("friends.compare.loadingTitle")}
            type="loading"
          />
        </View>
      ) : null}
      {comparison.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel={t("profile.tryAgain")}
            message={comparison.error}
            onAction={() => void comparison.reload()}
            title={t("friends.compare.loadError")}
            type="error"
          />
        </View>
      ) : null}
      {comparison.currentUser && comparison.friend && !comparison.isLoading && !comparison.error ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.names}>
            <Text numberOfLines={1} style={styles.name}>
              {t("friends.compare.you")}
            </Text>
            <Text style={styles.vs}>{t("friends.compare.vs")}</Text>
            <Text numberOfLines={1} style={styles.name}>
              {comparison.friend.profile.displayName.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.period}>{comparison.comparison?.period.name ?? t("friends.leaderboard.thisWeek")}</Text>
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
        </ScrollView>
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

function getEncouragement(
  userPoints: number,
  friendPoints: number,
  locale: string,
  translate: (key: string, options?: Record<string, unknown>) => string,
): string {
  const difference = Math.abs(userPoints - friendPoints);
  if (difference === 0) return translate("friends.compare.encouragementEqual");
  const points = formatPoints(difference, locale);
  if (userPoints > friendPoints) return translate("friends.compare.encouragementAhead", { points });
  return translate("friends.compare.encouragementTrailing", { points });
}

const styleSheet = createThemedStyles((theme) => ({
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 760,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    width: "100%",
  },
  encouragement: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.success,
    textAlign: "center",
  },
  name: {
    ...theme.typography.heading3,
    flex: 1,
    textAlign: "center",
  },
  names: {
    alignItems: "center",
    flexDirection: "row",
  },
  period: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.warning,
    textAlign: "center",
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  state: {
    paddingHorizontal: theme.spacing[4],
  },
  vs: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    marginHorizontal: theme.spacing[2],
  },
}));
