import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui";
import { CompareStatsRow, FriendsHeader, FriendsState } from "@/features/friends/components";
import { formatPoints } from "@/features/friends/components/LeaderboardEntries";
import { useFriendsComparison } from "@/features/friends/friends.hooks";
import { theme } from "@/theme/tokens";

export function CompareStatsScreen({ friendId }: { friendId: string | undefined }) {
  const router = useRouter();
  const comparison = useFriendsComparison(friendId);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <FriendsHeader onBack={() => router.back()} title="Compare Stats" />
      {comparison.isLoading ? <View style={styles.state}><FriendsState message="Loading your comparison…" title="Compare progress" type="loading" /></View> : null}
      {comparison.error ? <View style={styles.state}><FriendsState actionLabel="Try again" message={comparison.error} onAction={() => void comparison.reload()} title="Couldn't compare progress" type="error" /></View> : null}
      {comparison.currentUser && comparison.friend && !comparison.isLoading && !comparison.error ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.names}>
            <Text numberOfLines={1} style={styles.name}>YOU</Text>
            <Text style={styles.vs}>VS</Text>
            <Text numberOfLines={1} style={styles.name}>{comparison.friend.profile.displayName.toUpperCase()}</Text>
          </View>
          <Text style={styles.period}>{comparison.comparison?.period.name ?? "This Week"}</Text>
          <Card padding="md" variant="elevated">
            <CompareStatsRow friendValue={comparison.friend.periodPoints} label="Points" userValue={comparison.currentUser.periodPoints} />
            <CompareStatsRow friendValue={comparison.friend.rosaryTotal} label="Total Rosaries" userValue={comparison.currentUser.rosaryTotal} />
            <CompareStatsRow friendValue={comparison.friend.rosaryStreak.currentStreak} label="Rosary Streak" userValue={comparison.currentUser.rosaryStreak.currentStreak} />
            <CompareStatsRow friendValue={comparison.friend.badgeCount} label="Badges" userValue={comparison.currentUser.badgeCount} />
            <CompareStatsRow friendValue={comparison.friend.currentLevel.levelNumber} label="Level" userValue={comparison.currentUser.currentLevel.levelNumber} />
          </Card>
          <Card padding="md" variant="success">
            <Text style={styles.encouragement}>{getEncouragement(comparison.currentUser.periodPoints, comparison.friend.periodPoints)}</Text>
          </Card>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

function getEncouragement(userPoints: number, friendPoints: number): string {
  const difference = Math.abs(userPoints - friendPoints);
  if (difference === 0) return "You are neck and neck. Encourage one another as you grow.";
  if (userPoints > friendPoints) return `You are ${formatPoints(difference)} points ahead this period.`;
  return `${formatPoints(difference)} points to catch up. Every prayer moves you forward.`;
}

const styles = StyleSheet.create({
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: theme.sizes.contentMaxWidth,
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
});
