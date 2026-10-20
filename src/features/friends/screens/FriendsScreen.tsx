import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton, PageHeader } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { Button } from "@/components/ui";
import { LeaderboardCard } from "@/features/dashboard/components";
import { getLifetimeGlobalLeaderboard, getWeeklyGlobalLeaderboard } from "@/features/dashboard/dashboard.api";
import type { GlobalRosaryLeaderboard } from "@/features/dashboard/dashboard.types";
import { FriendsList, FriendsState, PendingRequestsCard, RosaryLeaderboardCard } from "@/features/friends/components";
import { useFriendRequests, useFriends, useRosaryLeaderboard } from "@/features/friends/friends.hooks";
import { parseFriendRequestsPage, parseFriendsLeaderboardData, parseFriendsPage } from "@/features/friends/friends.api";
import { fetchScreenData } from "@/features/screen-data";
import type { ScreenDataResponse } from "@/features/screen-data";
import type { FriendRequest } from "@/features/friends/friends.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders the authenticated community dashboard within the shared atmosphere. */
export function FriendsScreen() {
  const [initialData, setInitialData] = useState<ScreenDataResponse>();
  const [settled, setSettled] = useState(false);
  /** Loads Community's three initial sections through the aggregate endpoint. */
  useEffect(() => {
    let active = true;
    void fetchScreenData({ screen: "community" })
      .then((data) => {
        if (active) setInitialData(data);
      })
      .catch((error) => logDevelopmentError("loading Community aggregate data", error))
      .finally(() => {
        if (active) setSettled(true);
      });
    return () => {
      active = false;
    };
  }, []);
  return settled ? <FriendsScreenContent initialData={initialData} /> : null;
}

/** Renders Community after its aggregate initial data request settles, including global leaders at the end. */
function FriendsScreenContent({ initialData }: { initialData?: ScreenDataResponse }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const friendsSection = initialData?.sections.friends;
  const requestsSection = initialData?.sections.incomingFriendRequests;
  const leaderboardSection = initialData?.sections.friendsWeeklyLeaderboard;
  const friends = useFriends(friendsSection ? parseFriendsPage(friendsSection.data, friendsSection.meta) : undefined);
  const leaderboard = useRosaryLeaderboard(
    "weekly",
    leaderboardSection ? parseFriendsLeaderboardData(leaderboardSection.data) : undefined,
  );
  const requests = useFriendRequests(
    "incoming",
    requestsSection ? parseFriendRequestsPage(requestsSection.data, requestsSection.meta) : undefined,
  );
  const [isLifetimeGlobalLeaderboardLoading, setIsLifetimeGlobalLeaderboardLoading] = useState(true);
  const [isWeeklyGlobalLeaderboardLoading, setIsWeeklyGlobalLeaderboardLoading] = useState(true);
  const [lifetimeGlobalLeaderboard, setLifetimeGlobalLeaderboard] = useState<GlobalRosaryLeaderboard | null>(null);
  const [weeklyGlobalLeaderboard, setWeeklyGlobalLeaderboard] = useState<GlobalRosaryLeaderboard | null>(null);
  const [lifetimeGlobalLeaderboardError, setLifetimeGlobalLeaderboardError] = useState(false);
  const [weeklyGlobalLeaderboardError, setWeeklyGlobalLeaderboardError] = useState(false);
  const lifetimeGlobalLeaderboardRequestIdRef = useRef(0);
  const weeklyGlobalLeaderboardRequestIdRef = useRef(0);
  const { contentWidth, gutter, isDesktop, isLargeText } = useResponsiveLayout();
  const useColumns = isDesktop && contentWidth >= 900 && !isLargeText;

  /** Loads weekly global leaders while ignoring an older Community request that resolves later. */
  const loadWeeklyGlobalLeaderboard = useCallback(async () => {
    const requestId = ++weeklyGlobalLeaderboardRequestIdRef.current;
    setIsWeeklyGlobalLeaderboardLoading(true);
    setWeeklyGlobalLeaderboardError(false);
    try {
      const nextLeaderboard = await getWeeklyGlobalLeaderboard();
      if (requestId !== weeklyGlobalLeaderboardRequestIdRef.current) return;
      setWeeklyGlobalLeaderboard(nextLeaderboard);
    } catch (error) {
      logDevelopmentError("loading Community's weekly global leaderboard", error);
      if (requestId !== weeklyGlobalLeaderboardRequestIdRef.current) return;
      setWeeklyGlobalLeaderboard(null);
      setWeeklyGlobalLeaderboardError(true);
    } finally {
      if (requestId === weeklyGlobalLeaderboardRequestIdRef.current) setIsWeeklyGlobalLeaderboardLoading(false);
    }
  }, []);

  /** Loads lifetime global leaders while ignoring an older Community request that resolves later. */
  const loadLifetimeGlobalLeaderboard = useCallback(async () => {
    const requestId = ++lifetimeGlobalLeaderboardRequestIdRef.current;
    setIsLifetimeGlobalLeaderboardLoading(true);
    setLifetimeGlobalLeaderboardError(false);
    try {
      const nextLeaderboard = await getLifetimeGlobalLeaderboard();
      if (requestId !== lifetimeGlobalLeaderboardRequestIdRef.current) return;
      setLifetimeGlobalLeaderboard(nextLeaderboard);
    } catch (error) {
      logDevelopmentError("loading Community's lifetime global leaderboard", error);
      if (requestId !== lifetimeGlobalLeaderboardRequestIdRef.current) return;
      setLifetimeGlobalLeaderboard(null);
      setLifetimeGlobalLeaderboardError(true);
    } finally {
      if (requestId === lifetimeGlobalLeaderboardRequestIdRef.current) setIsLifetimeGlobalLeaderboardLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLifetimeGlobalLeaderboard();
      void loadWeeklyGlobalLeaderboard();

      /** Invalidates pending requests when Community is no longer focused. */
      return function invalidateGlobalLeaderboardRequests() {
        lifetimeGlobalLeaderboardRequestIdRef.current += 1;
        weeklyGlobalLeaderboardRequestIdRef.current += 1;
      };
    }, [loadLifetimeGlobalLeaderboard, loadWeeklyGlobalLeaderboard]),
  );

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
    } catch (error) {
      logDevelopmentError("resolving a friend request from Community", error);
      // The request hook retains the card and exposes an inline retry state.
    }
  };

  return (
    <AtmosphericSafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={[styles.header, { paddingHorizontal: gutter }]}>
        <PageHeader
          actions={
            <IconButton accessibilityLabel={t("friends.addFriendShort")} onPress={openAddFriend} tone="accent">
              <Feather
                accessible={false}
                color={theme.colors.icon.active}
                name="user-plus"
                size={theme.sizes.iconSmall}
              />
            </IconButton>
          }
          description={t("friends.communityDescription")}
          title={t("friends.community")}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
      >
        {leaderboard.isLoading ? (
          <FriendsState
            message={t("friends.loadingLeaderboard")}
            title={t("friends.leaderboard.title")}
            type="loading"
          />
        ) : null}
        {leaderboard.error ? (
          <FriendsState
            actionLabel={t("profile.tryAgain")}
            message={leaderboard.error}
            onAction={() => void leaderboard.reload()}
            title={t("friends.leaderboard.loadError")}
            type="error"
          />
        ) : null}
        {leaderboard.leaderboard && !leaderboard.isLoading && !leaderboard.error ? (
          leaderboard.leaderboard.entries.length ? (
            <RosaryLeaderboardCard
              leaderboard={leaderboard.leaderboard}
              onAddFriends={openAddFriend}
              onPressFriend={openFriend}
              onViewFullLeaderboard={() => router.push("/friends/leaderboard")}
            />
          ) : (
            <FriendsState message={t("friends.noRosaries")} title={t("friends.leaderboard.title")} type="empty" />
          )
        ) : null}

        <View style={[styles.sections, useColumns && styles.sectionsWide]}>
          <View style={[styles.section, useColumns && styles.sectionWide]}>
            {requests.isLoading ? (
              <FriendsState message={t("friends.loadingPending")} title={t("friends.pendingRequests")} type="loading" />
            ) : null}
            {requests.error ? (
              <FriendsState
                actionLabel={t("profile.tryAgain")}
                message={requests.error}
                onAction={() => void requests.reload()}
                title={t("friends.loadFriendsError")}
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
              <FriendsState message={t("friends.loadingFellowship")} title={t("friends.title")} type="loading" />
            ) : null}
            {friends.error ? (
              <FriendsState
                actionLabel={t("profile.tryAgain")}
                message={friends.error}
                onAction={() => void friends.reload()}
                title={t("friends.requests.loadError")}
                type="error"
              />
            ) : null}
            {!friends.isLoading && !friends.error && friends.friends.length === 0 ? (
              <FriendsState
                actionLabel={t("friends.find")}
                message={t("friends.findDescription")}
                onAction={openAddFriend}
                title={t("friends.findTitle")}
                type="empty"
              />
            ) : null}
            {!friends.isLoading && !friends.error && friends.friends.length ? (
              <FriendsList friends={friends.friends} onPressFriend={openFriend} />
            ) : null}
            {friends.hasMore ? (
              <Button
                fullWidth
                loading={friends.isLoadingMore}
                onPress={() => void friends.loadMore()}
                style={styles.moreFriends}
                variant="outline"
              >
                {t("friends.loadMoreFriends")}
              </Button>
            ) : null}
          </View>
        </View>
        <View style={styles.globalLeaderboard} testID="community-section-global-leaderboard">
          <LeaderboardCard
            isLifetimeLoading={isLifetimeGlobalLeaderboardLoading}
            isWeeklyLoading={isWeeklyGlobalLeaderboardLoading}
            lifetimeError={lifetimeGlobalLeaderboardError}
            lifetimeLeaderboard={lifetimeGlobalLeaderboard}
            onRetryLifetime={() => void loadLifetimeGlobalLeaderboard()}
            onRetryWeekly={() => void loadWeeklyGlobalLeaderboard()}
            weeklyError={weeklyGlobalLeaderboardError}
            weeklyLeaderboard={weeklyGlobalLeaderboard}
          />
        </View>
      </ScrollView>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    paddingBottom: theme.spacing[10],
    width: "100%",
  },
  header: { alignSelf: "center", maxWidth: theme.sizes.contentMaxWidth, width: "100%" },
  globalLeaderboard: { marginTop: theme.spacing[5] },
  moreFriends: {
    marginTop: theme.spacing[3],
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
