import { useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/navigation";
import { Card } from "@/components/ui";
import { FriendRequestItem, FriendsState } from "@/features/friends/components";
import { useFriendRequests } from "@/features/friends/friends.hooks";
import type { FriendRequestDirection } from "@/features/friends/friends.types";
import { theme } from "@/theme/tokens";

const tabs: ReadonlyArray<{ label: string; value: FriendRequestDirection }> = [
  { label: "Received", value: "incoming" },
  { label: "Sent", value: "outgoing" },
];

export function FriendRequestsScreen() {
  const router = useRouter();
  const [direction, setDirection] = useState<FriendRequestDirection>("incoming");
  const requests = useFriendRequests(direction);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader onBack={() => router.back()} title="Friend Requests" />
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab.value === direction }}
            key={tab.value}
            onPress={() => setDirection(tab.value)}
            style={[styles.tab, direction === tab.value && styles.activeTab]}
          >
            <Text style={[styles.tabText, direction === tab.value && styles.activeTabText]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
      {requests.isLoading ? (
        <View style={styles.state}>
          <FriendsState message="Loading friend requests…" title="Friend requests" type="loading" />
        </View>
      ) : null}
      {requests.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel="Try again"
            message={requests.error}
            onAction={() => void requests.reload()}
            title="Couldn't load friend requests"
            type="error"
          />
        </View>
      ) : null}
      {!requests.isLoading && !requests.error ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={requests.requests}
          keyExtractor={(request) => request.id}
          ListEmptyComponent={
            <FriendsState
              message={direction === "incoming" ? "No pending requests" : "You have no sent requests"}
              title={direction === "incoming" ? "Nothing waiting" : "No requests sent"}
              type="empty"
            />
          }
          ListFooterComponent={
            requests.hasMore ? (
              <Pressable accessibilityRole="button" onPress={() => void requests.loadMore()} style={styles.loadMore}>
                <Text style={styles.loadMoreText}>{requests.isLoadingMore ? "Loading…" : "Load more"}</Text>
              </Pressable>
            ) : null
          }
          onEndReached={() => void requests.loadMore()}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              onRefresh={() => void requests.reload()}
              refreshing={requests.isLoading}
              tintColor={theme.colors.brand.primaryLight}
            />
          }
          renderItem={({ item }) => (
            <Card padding="none" style={styles.requestCard}>
              <View style={styles.requestContent}>
                <FriendRequestItem
                  isMutating={requests.isMutatingId === item.id}
                  onAccept={() => void requests.resolve(item, "accepted").catch(() => undefined)}
                  onCancel={() => void requests.cancel(item).catch(() => undefined)}
                  onDecline={() => void requests.resolve(item, "rejected").catch(() => undefined)}
                  request={item}
                />
              </View>
            </Card>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    borderBottomColor: theme.colors.gold.light,
  },
  activeTabText: {
    color: theme.colors.text.warning,
  },
  listContent: {
    alignSelf: "center",
    gap: theme.spacing[3],
    maxWidth: theme.sizes.contentMaxWidth,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    width: "100%",
  },
  loadMore: {
    alignItems: "center",
    minHeight: theme.sizes.touchTarget,
    justifyContent: "center",
  },
  loadMoreText: {
    ...theme.typography.button,
    color: theme.colors.text.link,
  },
  requestCard: {
    flexGrow: 0,
  },
  requestContent: {
    paddingHorizontal: theme.spacing[4],
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  state: {
    paddingHorizontal: theme.spacing[4],
  },
  tab: {
    alignItems: "center",
    borderBottomColor: theme.colors.transparent,
    borderBottomWidth: theme.borderWidths.medium,
    flex: 1,
    minHeight: theme.sizes.touchTarget,
    justifyContent: "center",
  },
  tabText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.muted,
  },
  tabs: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    paddingHorizontal: theme.spacing[4],
  },
});
