import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button } from "@/components/ui";
import {
  getPrayerIntentionTheme,
  fetchMyPrayerIntentions,
  subscribeToMyPrayerIntentionsInvalidation,
} from "@/features/prayer/intentions";
import type { MyPrayerIntention, MyPrayerIntentionsStatusFilter } from "@/features/prayer/intentions";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { theme } from "@/theme/tokens";

const filters: readonly MyPrayerIntentionsStatusFilter[] = ["all", "pending", "visible", "rejected"];

const statusTranslationKeys = {
  pending: "intentions.my.pending",
  rejected: "intentions.my.notApproved",
  visible: "intentions.my.approvedVisible",
} as const;

const filterTranslationKeys = {
  all: "intentions.my.all",
  pending: "intentions.my.pending",
  rejected: "intentions.my.notApproved",
  visible: "intentions.my.visible",
} as const;

/** Renders the current user's submitted intentions within the shared atmosphere. */
export function MyPrayerIntentionsScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
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
      setError(requestError instanceof Error ? requestError.message : t("intentions.my.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [status, t]);
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
      setError(requestError instanceof Error ? requestError.message : t("intentions.my.loadMoreError"));
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextOffset, status, t]);
  const emptyCopy =
    status === "all"
      ? t("intentions.my.emptyAll")
      : t("intentions.my.emptyStatus", { status: t(statusTranslationKeys[status]) });

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("intentions.my.description")}
        onBack={() => router.back()}
        rightAction={
          <IconButton
            accessibilityLabel={t("intentions.shareLabel")}
            onPress={() => router.push("/create-prayer-intention")}
            tone="accent"
          >
            <Feather accessible={false} color={theme.rosary.colors.gold} name="plus" size={theme.sizes.iconMedium} />
          </IconButton>
        }
        title={t("intentions.my.title")}
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
              <Text style={styles.errorTitle}>{t("intentions.my.loadError")}</Text>
              <Button onPress={() => void load()} size="sm" style={styles.stateAction} variant="secondary">
                {t("profile.tryAgain")}
              </Button>
            </View>
          ) : (
            <View style={styles.state}>
              <Text style={styles.empty}>{emptyCopy}</Text>
            </View>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <Button
              fullWidth
              loading={isLoadingMore}
              onPress={() => void loadMore()}
              style={styles.stateAction}
              variant="outline"
            >
              {t("intentions.loadMore")}
            </Button>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.filters}>
            {filters.map((filter) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: filter === status }}
                key={filter}
                onPress={() => setStatus(filter)}
                style={[styles.filter, filter === status && styles.filterSelected]}
              >
                <Text style={[styles.filterText, filter === status && styles.filterTextSelected]}>
                  {t(filterTranslationKeys[filter])}
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

/** Renders MyPrayerIntentionCard with styles resolved from the active appearance. */
function MyPrayerIntentionCard({
  intention,
  onOpenActivity,
}: {
  intention: MyPrayerIntention;
  onOpenActivity: () => void;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const intentionTheme = getPrayerIntentionTheme(intention.symbol, colorScheme);
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
        <Text style={[styles.status, { color: intentionTheme.surfaceLight }]}>
          {t(statusTranslationKeys[intention.status])}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{intention.title}</Text>
      <Text numberOfLines={3} style={styles.cardDescription}>
        {intention.description}
      </Text>
      {intention.status === "visible" ? (
        <Button
          accessibilityLabel={t("intentions.activity.viewLabel", { title: intention.title })}
          onPress={onOpenActivity}
          style={styles.activityButton}
          rightIcon={
            <Feather
              accessible={false}
              color={theme.rosary.colors.gold}
              name="chevron-right"
              size={theme.sizes.iconSmall}
            />
          }
          size="sm"
          variant="outline"
        >
          {t("intentions.activity.view")}
        </Button>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[3],
  },
  cardDescription: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  cardTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.white, marginTop: theme.spacing[2] },
  cardTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  activityButton: { marginTop: theme.spacing[3] },
  content: {
    alignSelf: "center",
    gap: theme.spacing[3],
    maxWidth: 760,
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
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
  icon: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.spacing[7],
    justifyContent: "center",
    width: theme.spacing[7],
  },
  stateAction: { alignSelf: "center", marginTop: theme.spacing[2] },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  state: { alignItems: "center", justifyContent: "center", minHeight: 260, padding: theme.spacing[4] },
  status: { ...theme.typography.caption, textAlign: "right" },
}));
