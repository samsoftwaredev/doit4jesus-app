import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { PageHeader } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { SacredAtmosphere } from "@/components/ui";
import { LeaderboardCard } from "@/features/dashboard/components";
import { getWeeklyGlobalLeaderboard } from "@/features/dashboard/dashboard.api";
import type { LeaderboardEntryViewModel } from "@/features/dashboard/dashboard.types";
import { AllMysteries, MomentForPrayer, PrayersByOthers } from "@/features/prayer/components";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { cacheApprovedPrayerIntentions, fetchApprovedPrayerIntentions } from "@/features/prayer/intentions";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { getRosaryMysterySetFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import { getTodayRosaryMysteryType, getWeekdayLabel } from "@/features/prayer/rosary/data/schedule";
import { RosaryGardenSection } from "@/features/prayer/rosary/garden/components";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useCurrentLocalDate, useResponsiveLayout } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const previewLimit = 10;

/** Parses an ISO calendar date as local noon so weekday selection never crosses a timezone boundary. */
function localIsoDateToDate(localIsoDate: string) {
  const [year, month, day] = localIsoDate.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

/** Appends newly fetched intentions without duplicating cards when pages overlap. */
function appendUniqueIntentions(
  currentIntentions: ApprovedPrayerIntention[],
  incomingIntentions: ApprovedPrayerIntention[],
) {
  const currentIds = new Set(currentIntentions.map((intention) => intention.id));
  return [...currentIntentions, ...incomingIntentions.filter((intention) => !currentIds.has(intention.id))];
}

/** Renders the daily Prayer page with its Rosary Garden, global leaders, mysteries, and intentions. */
export function PrayerScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language, locale } = useAppLanguage();
  const router = useRouter();
  const { contentWidth, gutter, isDesktop, isLargeText, isNarrowPhone, isTablet, width } = useResponsiveLayout();
  const [intentions, setIntentions] = useState<ApprovedPrayerIntention[]>([]);
  const [isLoadingIntentions, setIsLoadingIntentions] = useState(true);
  const [isLoadingMoreIntentions, setIsLoadingMoreIntentions] = useState(false);
  const [intentionsError, setIntentionsError] = useState<string>();
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [hasMoreIntentions, setHasMoreIntentions] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryViewModel[] | null>(null);
  const [leaderboardError, setLeaderboardError] = useState(false);
  const [nextIntentionsOffset, setNextIntentionsOffset] = useState<number | null>(null);
  const isLoadingMoreIntentionsRef = useRef(false);
  const currentLocalDate = useCurrentLocalDate();
  const today = useMemo(() => localIsoDateToDate(currentLocalDate), [currentLocalDate]);
  const todayMysteryType = getTodayRosaryMysteryType(today);
  const rosaryContent = useMemo(() => getRosaryContent(language), [language]);
  const todaySet = getRosaryMysterySetFromContent(rosaryContent, todayMysteryType);
  const columnGap = theme.spacing[2];
  const containerMaxWidth = isDesktop ? 960 : isTablet ? 760 : width;
  const usableWidth = Math.max(0, Math.min(contentWidth, containerMaxWidth) - gutter * 2);
  const mysteryColumns = isDesktop ? 4 : isLargeText || isNarrowPhone ? 1 : 2;
  const mysteryCardWidth = Math.max(
    theme.sizes.touchTarget * 3,
    (usableWidth - columnGap * (mysteryColumns - 1)) / mysteryColumns,
  );

  /** Loads the approved prayer intentions shown in the home-screen preview. */
  const loadIntentions = useCallback(async () => {
    setIntentionsError(undefined);
    setIsLoadingIntentions(true);
    setHasMoreIntentions(false);
    setNextIntentionsOffset(null);
    try {
      const page = await fetchApprovedPrayerIntentions({ limit: previewLimit });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions(page.data);
      setHasMoreIntentions(page.meta.hasMore);
      setNextIntentionsOffset(page.meta.nextOffset);
    } catch (error) {
      setIntentionsError(error instanceof Error ? error.message : t("prayerHome.intentionsLoadError"));
    } finally {
      setIsLoadingIntentions(false);
    }
  }, [t]);

  useEffect(() => {
    void loadIntentions();
  }, [loadIntentions]);

  /** Loads the weekly global Rosary leaders whenever the Prayer tab receives focus. */
  const loadLeaderboard = useCallback(async () => {
    console.log("load...");
    setIsLoadingLeaderboard(true);
    setLeaderboardError(false);
    try {
      const resData = await getWeeklyGlobalLeaderboard();
      setLeaderboard(resData);
      console.log("here", resData);
    } catch {
      setLeaderboard(null);
      setLeaderboardError(true);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLeaderboard();
    }, [loadLeaderboard]),
  );

  /** Loads and appends the next intention page when the horizontal carousel approaches its end. */
  const loadMoreIntentions = useCallback(async () => {
    if (!hasMoreIntentions || nextIntentionsOffset === null || isLoadingMoreIntentionsRef.current) return;

    isLoadingMoreIntentionsRef.current = true;
    setIsLoadingMoreIntentions(true);
    setIntentionsError(undefined);
    try {
      const page = await fetchApprovedPrayerIntentions({ limit: previewLimit, offset: nextIntentionsOffset });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions((currentIntentions) => appendUniqueIntentions(currentIntentions, page.data));
      setHasMoreIntentions(page.meta.hasMore);
      setNextIntentionsOffset(page.meta.nextOffset);
    } catch (error) {
      setIntentionsError(error instanceof Error ? error.message : t("prayerHome.intentionsMoreError"));
    } finally {
      isLoadingMoreIntentionsRef.current = false;
      setIsLoadingMoreIntentions(false);
    }
  }, [hasMoreIntentions, nextIntentionsOffset, t]);

  /** Opens a full Rosary for the selected mystery set and records its launch source. */
  const openRosary = (mysteryType: RosaryMysteryType, source: "today" | "manual") => {
    router.push({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType, source },
    });
  };

  /** Starts today's scheduled Rosary. */
  const prayToday = () => {
    openRosary(todayMysteryType, "today");
  };

  /** Starts a manually selected mystery set. */
  const openMystery = (mysteryType: RosaryMysteryType) => {
    openRosary(mysteryType, "manual");
  };

  /** Opens the complete public prayer-intentions feed. */
  const seeAllIntentions = () => {
    router.push("/prayer-intentions");
  };

  /** Opens a selected public intention in its Rosary flow. */
  const openIntention = (intentionId: string) => {
    router.push({
      pathname: "/intention-rosary",
      params: { intentionId },
    });
  };

  /** Opens the form for sharing a new prayer intention. */
  const createIntention = () => {
    router.push("/create-prayer-intention");
  };

  /** Opens the current user's prayer intentions. */
  const openMyIntentions = () => {
    router.push("/my-prayer-intentions");
  };

  /** Retries the public prayer-intention request after a failure. */
  const retryIntentions = () => {
    void loadIntentions();
  };

  return (
    <AtmosphericSafeAreaView edges={["top"]} includeAtmosphere={false} style={styles.safeArea}>
      <LinearGradient colors={theme.colors.gradients.prayerHome} style={styles.background}>
        <SacredAtmosphere />
        <ScrollView
          contentContainerStyle={[styles.content, { maxWidth: containerMaxWidth, paddingHorizontal: gutter }]}
          showsVerticalScrollIndicator={false}
          style={styles.atmosphereContent}
        >
          <PageHeader description={t("prayerHome.description")} title={t("prayerHome.title")} />
          <View testID="prayer-section-today">
            <MomentForPrayer
              mysteryTitle={todaySet.title}
              onPrayToday={prayToday}
              weekday={getWeekdayLabel(today, locale)}
            />
          </View>
          <View testID="prayer-section-garden">
            <RosaryGardenSection onPrayToday={prayToday} />
          </View>
          <View testID="prayer-section-global-leaderboard">
            <LeaderboardCard
              entries={leaderboard}
              error={leaderboardError}
              isLoading={isLoadingLeaderboard}
              onRetry={() => void loadLeaderboard()}
            />
          </View>
          <View testID="prayer-section-mysteries">
            <AllMysteries cardWidth={mysteryCardWidth} gap={columnGap} onOpenMystery={openMystery} />
          </View>
          <View testID="prayer-section-intentions">
            <PrayersByOthers
              errorMessage={intentionsError}
              hasMore={hasMoreIntentions}
              intentions={intentions}
              isLoading={isLoadingIntentions}
              isLoadingMore={isLoadingMoreIntentions}
              onCreateIntention={createIntention}
              onLoadMore={loadMoreIntentions}
              onOpenIntention={openIntention}
              onOpenMyIntentions={openMyIntentions}
              onRetry={retryIntentions}
              onSeeAll={seeAllIntentions}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  background: { flex: 1, position: "relative" },
  atmosphereContent: { zIndex: theme.zIndex.card },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
  safeArea: { backgroundColor: theme.rosary.colors.canvas, flex: 1 },
}));
