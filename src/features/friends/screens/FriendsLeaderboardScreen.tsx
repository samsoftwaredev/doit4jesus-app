import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendsState, LeaderboardEntries } from "@/features/friends/components";
import { formatPoints } from "@/features/friends/components/LeaderboardEntries";
import { useRosaryLeaderboard } from "@/features/friends/friends.hooks";
import type { FriendsLeaderboardEntry, LeaderboardPeriodType } from "@/features/friends/friends.types";
import { theme } from "@/theme/tokens";

const periodOptions: ReadonlyArray<{ label: string; value: LeaderboardPeriodType }> = [
  { label: "Today", value: "daily" },
  { label: "This Week", value: "weekly" },
  { label: "This Month", value: "monthly" },
  { label: "This Year", value: "yearly" },
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

export function FriendsLeaderboardScreen() {
  const router = useRouter();
  const leaderboard = useRosaryLeaderboard();
  const data = leaderboard.leaderboard;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader onBack={() => router.back()} title="Leaderboard" />
      {leaderboard.isLoading ? (
        <View style={styles.state}>
          <FriendsState message="Loading your friends' points…" title="Leaderboard" type="loading" />
        </View>
      ) : null}
      {leaderboard.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel="Try again"
            message={leaderboard.error}
            onAction={() => void leaderboard.reload()}
            title="Couldn't load the leaderboard"
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
            <FriendsState message="No Rosaries recorded yet" title="No leaderboard data" type="empty" />
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
                      {option.label}
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
    </SafeAreaView>
  );
}

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
  const currentEntry = currentUserEntry ?? entries.find((entry) => entry.isCurrentUser) ?? null;
  const goal = getGoal(entries, currentEntry);
  const isCurrentUserInList = currentEntry
    ? entries.some((entry) => entry.friend.id === currentEntry.friend.id)
    : false;

  return (
    <View style={styles.footer}>
      {currentEntry && !isCurrentUserInList ? (
        <Card padding="sm" variant="success">
          <Text style={styles.yourRank}>{`You — #${currentEntry.rank} among friends`}</Text>
          <Text style={styles.yourPoints}>{`${formatPoints(currentEntry.points)} points`}</Text>
        </Card>
      ) : null}
      {currentEntry ? (
        <Card padding="md" variant="elevated">
          <Text style={styles.goalEyebrow}>YOUR GOAL</Text>
          {goal ? (
            <>
              <Text
                style={styles.goalText}
              >{`${formatPoints(goal.pointsNeeded)} more points to reach #${goal.rank}`}</Text>
              <View
                accessibilityLabel={`${Math.round(goal.progress * 100)} percent progress toward the next rank`}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: `${goal.progress * 100}%` }]} />
              </View>
            </>
          ) : (
            <Text style={styles.goalText}>You are leading your friends. Keep encouraging the community.</Text>
          )}
        </Card>
      ) : null}
      {entries.length < total ? (
        <Button fullWidth loading={isLoadingMore} onPress={onLoadMore} variant="outline">
          Load more
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
