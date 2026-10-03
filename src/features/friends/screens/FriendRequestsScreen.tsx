import { useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendRequestItem, FriendsState } from "@/features/friends/components";
import { useFriendRequests } from "@/features/friends/friends.hooks";
import type { FriendRequestDirection } from "@/features/friends/friends.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const directions: readonly FriendRequestDirection[] = ["incoming", "outgoing"];

/** Renders incoming and outgoing friend requests within the shared atmosphere. */
export function FriendRequestsScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const [direction, setDirection] = useState<FriendRequestDirection>("incoming");
  const requests = useFriendRequests(direction);

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.requests.description")}
        onBack={() => router.back()}
        title={t("friends.requests.title")}
      />
      <View style={styles.tabs}>
        {directions.map((tab) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === direction }}
            key={tab}
            onPress={() => setDirection(tab)}
            style={[styles.tab, direction === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, direction === tab && styles.activeTabText]}>
              {t(tab === "incoming" ? "friends.received" : "friends.sent")}
            </Text>
          </Pressable>
        ))}
      </View>
      {requests.isLoading ? (
        <View style={styles.state}>
          <FriendsState message={t("friends.requests.loading")} title={t("friends.requests.title")} type="loading" />
        </View>
      ) : null}
      {requests.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel={t("profile.tryAgain")}
            message={requests.error}
            onAction={() => void requests.reload()}
            title={t("friends.requests.loadError")}
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
              message={t(direction === "incoming" ? "friends.noPending" : "friends.noSent")}
              title={t(direction === "incoming" ? "friends.requests.nothingWaiting" : "friends.noSentTitle")}
              type="empty"
            />
          }
          ListFooterComponent={
            requests.hasMore ? (
              <Button
                fullWidth
                loading={requests.isLoadingMore}
                onPress={() => void requests.loadMore()}
                style={styles.loadMore}
                variant="outline"
              >
                {t("friends.loadMore")}
              </Button>
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
                  onAccept={() =>
                    void requests
                      .resolve(item, "accepted")
                      .catch((error) => logDevelopmentError("accepting a friend request", error))
                  }
                  onCancel={() =>
                    void requests
                      .cancel(item)
                      .catch((error) => logDevelopmentError("cancelling a friend request", error))
                  }
                  onDecline={() =>
                    void requests
                      .resolve(item, "rejected")
                      .catch((error) => logDevelopmentError("declining a friend request", error))
                  }
                  request={item}
                />
              </View>
            </Card>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
  loadMore: { marginTop: theme.spacing[2] },
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
}));
