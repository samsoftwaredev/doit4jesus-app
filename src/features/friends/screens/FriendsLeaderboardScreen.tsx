import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendsState, LeaderboardEntries } from "@/features/friends/components";
import { formatPoints } from "@/features/friends/components/LeaderboardEntries";
import { useRosaryLeaderboard } from "@/features/friends/friends.hooks";
import type { FriendsLeaderboardEntry, LeaderboardPeriodType } from "@/features/friends/friends.types";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const periodOptions: readonly { labelKey: string; value: LeaderboardPeriodType }[] = [
  { labelKey: "friends.leaderboard.today", value: "daily" },
  { labelKey: "friends.leaderboard.thisWeek", value: "weekly" },
  { labelKey: "friends.leaderboard.thisMonth", value: "monthly" },
  { labelKey: "friends.leaderboard.thisYear", value: "yearly" },
];

function getGoal(entries: FriendsLeaderboardEntry[], currentUser: FriendsLeaderboardEntry | null) {
  if (!currentUser) return undefined;
  const target = entries
    .filter((entry) => !entry.isCurrentUser && entry.points > currentUser.points)
    .sort((left, right) => left.points - right.points)[0];

  if (!target) return undefined;

  return {
    pointsNeeded: target.points - currentUser.points,
    progress: target.points ? Math.min(currentUser.points / target.points, 1) : 0,
    rank: target.rank,
  };
}

/** Renders the authenticated friends leaderboard within the shared atmosphere. */
export function FriendsLeaderboardScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const leaderboard = useRosaryLeaderboard();
  const data = leaderboard.leaderboard;

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.leaderboard.description")}
        onBack={() => router.back()}
        title={t("friends.leaderboard.title")}
      />
      {leaderboard.isLoading ? (
        <View style={styles.state}>
          <FriendsState
            message={t("friends.loadingLeaderboard")}
            title={t("friends.leaderboard.title")}
            type="loading"
          />
        </View>
      ) : null}
      {leaderboard.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel={t("profile.tryAgain")}
            message={leaderboard.error}
            onAction={() => void leaderboard.reload()}
            title={t("friends.leaderboard.loadError")}
            type="error"
          />
        </View>
      ) : null}
      {data && !leaderboard.isLoading && !leaderboard.error ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={data.entries}
          keyExtractor={(entry) => entry.friend.id}
          ListEmptyComponent={
            <FriendsState message={t("friends.noRosaries")} title={t("friends.noLeaderboardData")} type="empty" />
          }
          ListFooterComponent={
            <LeaderboardFooter
              currentUserEntry={data.currentUserEntry}
              entries={data.entries}
              isLoadingMore={leaderboard.isLoadingMore}
              onLoadMore={() => void leaderboard.loadMore()}
              total={data.total}
            />
          }
          ListHeaderComponent={
            <View>
              <View style={styles.periods}>
                {periodOptions.map((option) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: leaderboard.periodType === option.value }}
                    key={option.value}
                    onPress={() => leaderboard.setPeriodType(option.value)}
                    style={[
                      styles.periodButton,
                      leaderboard.periodType === option.value && styles.periodButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        leaderboard.periodType === option.value && styles.periodButtonTextSelected,
                      ]}
                    >
                      {t(option.labelKey)}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Card padding="sm" style={styles.tableHeaderCard} variant="warning">
                <LeaderboardEntries entries={[]} showHeader />
              </Card>
            </View>
          }
          onEndReached={() => void leaderboard.loadMore()}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              onRefresh={() => void leaderboard.reload()}
              refreshing={leaderboard.isLoading}
              tintColor={theme.colors.brand.primaryLight}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.entryCard}>
              <LeaderboardEntries
                entries={[item]}
                onPressFriend={(friendId) => router.push(`/friends/${friendId}`)}
                showHeader={false}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

/** Renders LeaderboardFooter with styles resolved from the active appearance. */
function LeaderboardFooter({
  currentUserEntry,
  entries,
  isLoadingMore,
  onLoadMore,
  total,
}: {
  currentUserEntry: FriendsLeaderboardEntry | null;
  entries: FriendsLeaderboardEntry[];
  isLoadingMore: boolean;
  onLoadMore: () => void;
  total: number;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const currentEntry = currentUserEntry ?? entries.find((entry) => entry.isCurrentUser) ?? null;
  const goal = getGoal(entries, currentEntry);
  const isCurrentUserInList = currentEntry
    ? entries.some((entry) => entry.friend.id === currentEntry.friend.id)
    : false;

  return (
    <View style={styles.footer}>
      {currentEntry && !isCurrentUserInList ? (
        <Card padding="sm" variant="success">
          <Text style={styles.yourRank}>{t("friends.leaderboard.youAmongSentence", { rank: currentEntry.rank })}</Text>
          <Text style={styles.yourPoints}>
            {t("friends.table.pointsLabel", {
              count: currentEntry.points,
              formattedCount: formatPoints(currentEntry.points, locale),
            })}
          </Text>
        </Card>
      ) : null}
      {currentEntry ? (
        <Card padding="md" variant="elevated">
          <Text style={styles.goalEyebrow}>{t("friends.leaderboard.yourGoal")}</Text>
          {goal ? (
            <>
              <Text style={styles.goalText}>
                {t("friends.leaderboard.reachRank", {
                  points: formatPoints(goal.pointsNeeded, locale),
                  rank: goal.rank,
                })}
              </Text>
              <View
                accessibilityLabel={t("friends.leaderboard.progressLabel", {
                  percent: Math.round(goal.progress * 100),
                })}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: `${goal.progress * 100}%` }]} />
              </View>
            </>
          ) : (
            <Text style={styles.goalText}>{t("friends.leaderboard.leading")}</Text>
          )}
        </Card>
      ) : null}
      {entries.length < total ? (
        <Button fullWidth loading={isLoadingMore} onPress={onLoadMore} variant="outline">
          {t("friends.loadMore")}
        </Button>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  entryCard: {
    backgroundColor: theme.colors.surface.navy,
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    paddingHorizontal: theme.spacing[3],
  },
  footer: {
    gap: theme.spacing[4],
    paddingTop: theme.spacing[5],
  },
  goalEyebrow: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.warning,
  },
  goalText: {
    ...theme.typography.bodyMedium,
    marginTop: theme.spacing[2],
  },
  listContent: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    width: "100%",
  },
  periodButton: {
    alignItems: "center",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    flex: 1,
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
    gap: theme.spacing[1],
    marginBottom: theme.spacing[4],
  },
  progressFill: {
    backgroundColor: theme.colors.gold.light,
    borderRadius: theme.radii.pill,
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
  },
  progressTrack: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2],
    marginTop: theme.spacing[3],
    overflow: "hidden",
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  state: {
    paddingHorizontal: theme.spacing[4],
  },
  tableHeaderCard: {
    borderBottomLeftRadius: theme.radii.none,
    borderBottomRightRadius: theme.radii.none,
    marginBottom: theme.spacing[0],
  },
  yourPoints: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.warning,
    marginTop: theme.spacing[1],
  },
  yourRank: {
    ...theme.typography.heading3,
  },
}));
