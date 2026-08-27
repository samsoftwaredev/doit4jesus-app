import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrayerIntentionCard } from "@/components/prayer";
import { fetchApprovedPrayerIntentions, cacheApprovedPrayerIntentions } from "@/features/prayer-intentions";
import type { ApprovedPrayerIntention } from "@/features/prayer-intentions";
import { FriendsHeader } from "@/features/friends/components";
import { theme } from "@/theme/tokens";

export function PrayerIntentionsScreen() {
  const router = useRouter();
  const [intentions, setIntentions] = useState<ApprovedPrayerIntention[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      const page = await fetchApprovedPrayerIntentions({ limit: 20, offset: 0 });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions(page.data);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn't load prayer intentions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);
  const loadMore = useCallback(async () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const page = await fetchApprovedPrayerIntentions({ limit: 20, offset: nextOffset });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions((current) => [...current, ...page.data]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn't load more prayer intentions.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextOffset]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <FriendsHeader
        onBack={() => router.back()}
        rightAction={
          <Pressable
            accessibilityLabel="Share a prayer intention"
            accessibilityRole="button"
            onPress={() => router.push("/create-prayer-intention")}
            style={styles.headerAction}
          >
            <Feather accessible={false} color={theme.rosary.colors.gold} name="plus" size={theme.sizes.iconMedium} />
          </Pressable>
        }
        title="Prayer Intentions"
      />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.rosary.colors.gold} />
          <Text style={styles.loadingText}>Loading prayer intentions…</Text>
        </View>
      ) : null}
      {!isLoading && error ? (
        <View accessibilityRole="alert" style={styles.state}>
          <Text style={styles.stateTitle}>Couldn&apos;t load prayer intentions.</Text>
          <Pressable accessibilityRole="button" onPress={() => void load()} style={styles.retry}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}
      {!isLoading && !error ? (
        <FlatList
          columnWrapperStyle={intentions.length > 1 ? styles.column : undefined}
          contentContainerStyle={styles.list}
          data={intentions}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.state}>
              <Text style={styles.stateTitle}>No prayer intentions yet.</Text>
              <Text style={styles.stateCopy}>Be the first to share an intention.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/create-prayer-intention")}
                style={styles.retry}
              >
                <Text style={styles.retryText}>Share a Prayer Intention</Text>
              </Pressable>
            </View>
          }
          ListFooterComponent={
            hasMore ? (
              <Pressable
                accessibilityRole="button"
                disabled={isLoadingMore}
                onPress={() => void loadMore()}
                style={styles.loadMore}
              >
                {isLoadingMore ? (
                  <ActivityIndicator color={theme.rosary.colors.gold} />
                ) : (
                  <Text style={styles.retryText}>Load more</Text>
                )}
              </Pressable>
            ) : null
          }
          numColumns={2}
          onEndReached={() => void loadMore()}
          onEndReachedThreshold={0.6}
          refreshControl={
            <RefreshControl onRefresh={() => void load()} refreshing={isLoading} tintColor={theme.rosary.colors.gold} />
          }
          renderItem={({ item }) => (
            <PrayerIntentionCard
              intention={item}
              onPress={() => router.push({ pathname: "/intention-rosary", params: { intentionId: item.id } })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/my-prayer-intentions")}
        style={styles.myButton}
      >
        <Text style={styles.myText}>My Prayer Intentions</Text>
        <Feather
          accessible={false}
          color={theme.rosary.colors.gold}
          name="chevron-right"
          size={theme.sizes.iconSmall}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  column: { gap: theme.spacing[2], justifyContent: "space-around" },
  headerAction: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  list: { gap: theme.spacing[2], paddingBottom: theme.spacing[6], paddingHorizontal: theme.spacing[3] },
  loadMore: {
    alignItems: "center",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
  },
  loading: { alignItems: "center", flex: 1, gap: theme.spacing[3], justifyContent: "center" },
  loadingText: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  myButton: {
    alignItems: "center",
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[1],
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
  },
  myText: { ...theme.typography.labelSmall, color: theme.rosary.colors.goldBright },
  retry: {
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    justifyContent: "center",
  },
  retryText: { ...theme.typography.labelSmall, color: theme.rosary.colors.goldBright },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  state: { alignItems: "center", padding: theme.spacing[5] },
  stateCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  stateTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.white, textAlign: "center" },
});
