import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";

import { IconButton, PageHeader } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { SacredAtmosphere } from "@/components/ui";
import { AllMysteries, MomentForPrayer, PrayersByOthers } from "@/features/prayer/components";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { cacheApprovedPrayerIntentions, fetchApprovedPrayerIntentions } from "@/features/prayer/intentions";
import { getRosaryMysterySet } from "@/features/prayer/rosary/data/rosaryMysteries";
import { getTodayRosaryMysteryType, getWeekdayLabel } from "@/features/prayer/rosary/data/schedule";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const previewLimit = 10;

/** Appends newly fetched intentions without duplicating cards when pages overlap. */
function appendUniqueIntentions(
  currentIntentions: ApprovedPrayerIntention[],
  incomingIntentions: ApprovedPrayerIntention[],
) {
  const currentIds = new Set(currentIntentions.map((intention) => intention.id));
  return [...currentIntentions, ...incomingIntentions.filter((intention) => !currentIds.has(intention.id))];
}

/** Renders the daily prayer dashboard within the shared atmosphere. */
export function PrayerScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { contentWidth, gutter, isDesktop, isLargeText, isNarrowPhone, isTablet, width } = useResponsiveLayout();
  const [intentions, setIntentions] = useState<ApprovedPrayerIntention[]>([]);
  const [isLoadingIntentions, setIsLoadingIntentions] = useState(true);
  const [isLoadingMoreIntentions, setIsLoadingMoreIntentions] = useState(false);
  const [intentionsError, setIntentionsError] = useState<string>();
  const [hasMoreIntentions, setHasMoreIntentions] = useState(false);
  const [nextIntentionsOffset, setNextIntentionsOffset] = useState<number | null>(null);
  const isLoadingMoreIntentionsRef = useRef(false);
  const todayMysteryType = getTodayRosaryMysteryType();
  const todaySet = getRosaryMysterySet(todayMysteryType);
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
      setIntentionsError(error instanceof Error ? error.message : "Couldn't load prayer intentions.");
    } finally {
      setIsLoadingIntentions(false);
    }
  }, []);

  useEffect(() => {
    void loadIntentions();
  }, [loadIntentions]);

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
      setIntentionsError(error instanceof Error ? error.message : "Couldn't load more prayer intentions.");
    } finally {
      isLoadingMoreIntentionsRef.current = false;
      setIsLoadingMoreIntentions(false);
    }
  }, [hasMoreIntentions, nextIntentionsOffset]);

  /** Opens a full Rosary for the selected mystery set and records its launch source. */
  const openRosary = (mysteryType: RosaryMysteryType, source: "today" | "manual") => {
    router.push({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType, source },
    });
  };

  /** Opens the Rosary Garden calendar. */
  const openGarden = () => {
    router.push("/rosary-garden");
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
          <PageHeader
            actions={
              <IconButton accessibilityLabel="Open Rosary Garden" onPress={openGarden} tone="accent">
                <Feather
                  accessible={false}
                  color={theme.rosary.colors.goldBright}
                  name="calendar"
                  size={theme.sizes.iconMedium}
                />
              </IconButton>
            }
            description="Pray the Rosary and lift up the intentions of others."
            title="Prayer"
          />
          <MomentForPrayer mysteryTitle={todaySet.title} onPrayToday={prayToday} weekday={getWeekdayLabel()} />
          <AllMysteries cardWidth={mysteryCardWidth} gap={columnGap} onOpenMystery={openMystery} />
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
