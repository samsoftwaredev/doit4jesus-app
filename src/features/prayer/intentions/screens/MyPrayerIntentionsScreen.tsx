import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import {
  getPrayerIntentionTheme,
  fetchMyPrayerIntentions,
  subscribeToMyPrayerIntentionsInvalidation,
} from "@/features/prayer/intentions";
import type { MyPrayerIntention, MyPrayerIntentionsStatusFilter } from "@/features/prayer/intentions";
import { theme } from "@/theme/tokens";

const filters: ReadonlyArray<{ label: string; value: MyPrayerIntentionsStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending review", value: "pending" },
  { label: "Visible", value: "visible" },
  { label: "Not approved", value: "rejected" },
];

const statusLabels = { pending: "Pending review", visible: "Approved / Visible", rejected: "Not approved" } as const;

/** Renders the current user's submitted intentions within the shared atmosphere. */
export function MyPrayerIntentionsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<MyPrayerIntentionsStatusFilter>("all");
  const [intentions, setIntentions] = useState<MyPrayerIntention[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      const page = await fetchMyPrayerIntentions({ limit: 20, offset: 0, status });
      setIntentions(page.data);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn’t load your prayer intentions.");
    } finally {
      setIsLoading(false);
    }
  }, [status]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(
    () =>
      subscribeToMyPrayerIntentionsInvalidation(() => {
        void load();
      }),
    [load],
  );
  const loadMore = useCallback(async () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const page = await fetchMyPrayerIntentions({ limit: 20, offset: nextOffset, status });
      setIntentions((current) => [...current, ...page.data]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn’t load more prayer intentions.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextOffset, status]);
  const emptyCopy =
    status === "all" ? "You haven&apos;t submitted any prayer intentions." : `No ${statusLabels[status]} intentions.`;

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
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
        title="My Prayer Intentions"
      />
      <FlatList
        contentContainerStyle={styles.content}
        data={intentions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.state}>
              <ActivityIndicator color={theme.rosary.colors.gold} />
            </View>
          ) : error ? (
            <View accessibilityRole="alert" style={styles.state}>
              <Text style={styles.errorTitle}>Couldn&apos;t load your prayer intentions.</Text>
              <Pressable accessibilityRole="button" onPress={() => void load()} style={styles.retry}>
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.empty}>{emptyCopy}</Text>
            </View>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <Pressable
              accessibilityRole="button"
              disabled={isLoadingMore}
              onPress={() => void loadMore()}
              style={styles.retry}
            >
              {isLoadingMore ? (
                <ActivityIndicator color={theme.rosary.colors.gold} />
              ) : (
                <Text style={styles.retryText}>Load more</Text>
              )}
            </Pressable>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.filters}>
            {filters.map((filter) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: filter.value === status }}
                key={filter.value}
                onPress={() => setStatus(filter.value)}
                style={[styles.filter, filter.value === status && styles.filterSelected]}
              >
                <Text style={[styles.filterText, filter.value === status && styles.filterTextSelected]}>
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </View>
        }
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl onRefresh={() => void load()} refreshing={isLoading} tintColor={theme.rosary.colors.gold} />
        }
        renderItem={({ item }) => (
          <MyPrayerIntentionCard
            intention={item}
            onOpenActivity={() =>
              router.push({ pathname: "/prayer-intention-prayers", params: { intentionId: item.id } })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </AtmosphericSafeAreaView>
  );
}

function MyPrayerIntentionCard({
  intention,
  onOpenActivity,
}: {
  intention: MyPrayerIntention;
  onOpenActivity: () => void;
}) {
  const intentionTheme = getPrayerIntentionTheme(intention.symbol);
  return (
    <View style={[styles.card, { borderColor: intentionTheme.surfaceLight }]}>
      <View style={styles.cardTop}>
        <View style={[styles.icon, { backgroundColor: intentionTheme.surface }]}>
          <Feather
            accessible={false}
            color={theme.rosary.colors.goldBright}
            name={intentionTheme.icon}
            size={theme.sizes.iconSmall}
          />
        </View>
        <Text style={[styles.status, { color: intentionTheme.surfaceLight }]}>{statusLabels[intention.status]}</Text>
      </View>
      <Text style={styles.cardTitle}>{intention.title}</Text>
      <Text numberOfLines={3} style={styles.cardDescription}>
        {intention.description}
      </Text>
      {intention.status === "visible" ? (
        <Pressable
          accessibilityLabel={`View prayer activity for ${intention.title}`}
          accessibilityRole="button"
          onPress={onOpenActivity}
          style={styles.activityButton}
        >
          <Text style={styles.activityButtonText}>View Prayer Activity</Text>
          <Feather
            accessible={false}
            color={theme.rosary.colors.gold}
            name="chevron-right"
            size={theme.sizes.iconSmall}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[3],
  },
  cardDescription: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  cardTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.white, marginTop: theme.spacing[2] },
  cardTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  activityButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[0.5],
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
  },
  activityButtonText: { ...theme.typography.labelSmall, color: theme.rosary.colors.goldBright },
  content: { gap: theme.spacing[3], padding: theme.spacing[4], paddingBottom: theme.spacing[7] },
  empty: { ...theme.typography.bodyMedium, color: theme.colors.text.secondary, textAlign: "center" },
  errorTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.white, textAlign: "center" },
  filter: {
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    justifyContent: "center",
  },
  filterSelected: { backgroundColor: theme.rosary.colors.gold, borderColor: theme.rosary.colors.gold },
  filterText: { ...theme.typography.caption, color: theme.colors.text.secondary },
  filterTextSelected: { color: theme.colors.text.inverse },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] },
  headerAction: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  icon: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.spacing[7],
    justifyContent: "center",
    width: theme.spacing[7],
  },
  retry: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    marginTop: theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  retryText: { ...theme.typography.labelSmall, color: theme.rosary.colors.goldBright },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  state: { alignItems: "center", justifyContent: "center", minHeight: 260, padding: theme.spacing[4] },
  status: { ...theme.typography.caption, textAlign: "right" },
});
