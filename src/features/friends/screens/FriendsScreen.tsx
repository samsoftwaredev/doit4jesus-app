import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { FriendsList, FriendsState, PendingRequestsCard, RosaryLeaderboardCard } from "@/features/friends/components";
import { useFriendRequests, useFriends, useRosaryLeaderboard } from "@/features/friends/friends.hooks";
import type { FriendRequest } from "@/features/friends/friends.types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders the authenticated community dashboard within the shared atmosphere. */
export function FriendsScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const friends = useFriends();
  const leaderboard = useRosaryLeaderboard();
  const requests = useFriendRequests("incoming");
  const { contentWidth, gutter, isDesktop, isLargeText } = useResponsiveLayout();
  const useColumns = isDesktop && contentWidth >= 900 && !isLargeText;

  const openFriend = (friendId: string) => {
    router.push(`/friends/${friendId}`);
  };

  const openAddFriend = () => {
    router.push("/friends/add");
  };

  const resolveRequest = async (request: FriendRequest, decision: "accepted" | "rejected") => {
    try {
      await requests.resolve(request, decision);

      if (decision === "accepted") {
        await Promise.all([leaderboard.reload(), friends.reload()]);
      }
    } catch {
      // The request hook retains the card and exposes an inline retry state.
    }
  };

  return (
    <AtmosphericSafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.brandRow}>
        <View style={styles.brandIcon}>
          <MaterialCommunityIcons color={theme.colors.gold.pale} name="shield-cross" size={theme.sizes.iconMedium} />
        </View>
        <Text style={styles.brand}>doit4Jesus</Text>
      </View>
      <BackHeader
        rightAction={
          <Pressable
            accessibilityLabel="Add friend"
            accessibilityRole="button"
            onPress={openAddFriend}
            style={styles.addButton}
          >
            <Feather color={theme.colors.text.inverse} name="user-plus" size={theme.sizes.iconSmall} />
          </Pressable>
        }
        title="Community"
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>Compete with one another in prayer.</Text>

        {leaderboard.isLoading ? (
          <FriendsState message="Loading your friends' points…" title="Leaderboard" type="loading" />
        ) : null}
        {leaderboard.error ? (
          <FriendsState
            actionLabel="Try again"
            message={leaderboard.error}
            onAction={() => void leaderboard.reload()}
            title="Couldn't load the leaderboard"
            type="error"
          />
        ) : null}
        {leaderboard.leaderboard && !leaderboard.isLoading && !leaderboard.error ? (
          leaderboard.leaderboard.entries.length ? (
            <RosaryLeaderboardCard
              leaderboard={leaderboard.leaderboard}
              onPressFriend={openFriend}
              onViewFullLeaderboard={() => router.push("/friends/leaderboard")}
            />
          ) : (
            <FriendsState message="No Rosaries recorded yet" title="Leaderboard" type="empty" />
          )
        ) : null}

        <View style={[styles.sections, useColumns && styles.sectionsWide]}>
          <View style={[styles.section, useColumns && styles.sectionWide]}>
            {requests.isLoading ? (
              <FriendsState message="Loading pending requests…" title="Pending requests" type="loading" />
            ) : null}
            {requests.error ? (
              <FriendsState
                actionLabel="Try again"
                message={requests.error}
                onAction={() => void requests.reload()}
                title="Couldn't load pending requests"
                type="error"
              />
            ) : null}
            {!requests.isLoading && !requests.error ? (
              <PendingRequestsCard
                isMutatingId={requests.isMutatingId}
                onAccept={(request) => resolveRequest(request, "accepted")}
                onDecline={(request) => resolveRequest(request, "rejected")}
                onSeeAll={() => router.push("/friends/requests")}
                requests={requests.requests}
              />
            ) : null}
          </View>

          <View style={[styles.section, useColumns && styles.sectionWide]}>
            {friends.isLoading ? (
              <FriendsState message="Loading your fellowship…" title="Your friends" type="loading" />
            ) : null}
            {friends.error ? (
              <FriendsState
                actionLabel="Try again"
                message={friends.error}
                onAction={() => void friends.reload()}
                title="Couldn't load friends"
                type="error"
              />
            ) : null}
            {!friends.isLoading && !friends.error && friends.friends.length === 0 ? (
              <FriendsState
                actionLabel="Find Friends"
                message="Add friends and encourage one another in prayer and virtue."
                onAction={openAddFriend}
                title="Your fellowship begins here"
                type="empty"
              />
            ) : null}
            {!friends.isLoading && !friends.error && friends.friends.length ? (
              <FriendsList friends={friends.friends} onPressFriend={openFriend} />
            ) : null}
            {friends.hasMore ? (
              <Pressable accessibilityRole="button" onPress={() => void friends.loadMore()} style={styles.moreFriends}>
                <Text style={styles.moreFriendsText}>
                  {friends.isLoadingMore ? "Loading friends…" : "Load more friends"}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  brand: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  brandIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  brandRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[5],
    marginBottom: theme.spacing[1],
  },
  addButton: {
    alignItems: "center",
    backgroundColor: theme.colors.gold.light,
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  content: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    paddingBottom: theme.spacing[10],
    width: "100%",
  },
  intro: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing[5],
  },
  moreFriends: {
    alignItems: "center",
    minHeight: theme.sizes.touchTarget,
    paddingTop: theme.spacing[3],
  },
  moreFriendsText: {
    ...theme.typography.button,
    color: theme.colors.text.link,
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  section: {
    marginTop: theme.spacing[5],
  },
  sections: { width: "100%" },
  sectionsWide: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[5],
  },
  sectionWide: {
    flex: 1,
    minWidth: theme.spacing[0],
  },
}));
