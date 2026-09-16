import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button } from "@/components/ui";
import { PrayerIntentionCard } from "@/features/prayer/intentions/components";
import { fetchApprovedPrayerIntentions, cacheApprovedPrayerIntentions } from "@/features/prayer/intentions";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders approved prayer intentions within the shared atmosphere. */
export function PrayerIntentionsScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
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
      setError(requestError instanceof Error ? requestError.message : t("intentions.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

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
      setError(requestError instanceof Error ? requestError.message : t("intentions.loadMoreError"));
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextOffset, t]);

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("intentions.description")}
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
        title={t("intentions.title")}
      />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.rosary.colors.gold} />
          <Text style={styles.loadingText}>{t("intentions.loading")}</Text>
        </View>
      ) : null}
      {!isLoading && error ? (
        <View accessibilityRole="alert" style={styles.state}>
          <Text style={styles.stateTitle}>{t("intentions.loadError")}</Text>
          <Button onPress={() => void load()} size="sm" style={styles.stateAction} variant="secondary">
            {t("profile.tryAgain")}
          </Button>
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
              <Text style={styles.stateTitle}>{t("intentions.empty")}</Text>
              <Text style={styles.stateCopy}>{t("intentions.emptyCopy")}</Text>
              <Button
                onPress={() => router.push("/create-prayer-intention")}
                style={styles.stateAction}
                variant="warning"
              >
                {t("intentions.share")}
              </Button>
            </View>
          }
          ListFooterComponent={
            hasMore ? (
              <Button
                fullWidth
                loading={isLoadingMore}
                onPress={() => void loadMore()}
                style={styles.loadMore}
                variant="outline"
              >
                {t("intentions.loadMore")}
              </Button>
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
      <Button
        fullWidth
        onPress={() => router.push("/my-prayer-intentions")}
        style={styles.myButton}
        variant="ghost"
        rightIcon={
          <Feather
            accessible={false}
            color={theme.rosary.colors.gold}
            name="chevron-right"
            size={theme.sizes.iconSmall}
          />
        }
      >
        {t("intentions.my.title")}
      </Button>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  column: { gap: theme.spacing[2], justifyContent: "space-around" },
  list: {
    alignSelf: "center",
    gap: theme.spacing[2],
    maxWidth: 760,
    paddingBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[3],
    width: "100%",
  },
  loadMore: { marginTop: theme.spacing[3] },
  loading: { alignItems: "center", flex: 1, gap: theme.spacing[3], justifyContent: "center" },
  loadingText: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  myButton: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    borderRadius: theme.radii.none,
  },
  stateAction: { marginTop: theme.spacing[3] },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  state: { alignItems: "center", padding: theme.spacing[5] },
  stateCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  stateTitle: { ...theme.typography.bodyMedium, color: theme.colors.text.white, textAlign: "center" },
}));
