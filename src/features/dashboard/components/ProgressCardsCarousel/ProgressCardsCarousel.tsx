import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

const LEVEL_PROGRESS_PAGE = 0;
const HOLY_PROGRESS_PAGE = 1;
const LAST_PAGE_INDEX = HOLY_PROGRESS_PAGE;

export interface ProgressCardsCarouselProps {
  holyProgressCard: ReactNode;
  levelProgressCard: ReactNode;
}

/** Keeps a calculated carousel page within the available two-card range. */
function clampPageIndex(index: number): number {
  return Math.min(Math.max(index, LEVEL_PROGRESS_PAGE), LAST_PAGE_INDEX);
}

/**
 * Presents Level Progress first and Holy Progress second in a horizontally paged card carousel.
 * Swipe gestures and the two accessible indicators stay synchronized across layout changes.
 */
export function ProgressCardsCarousel({ holyProgressCard, levelProgressCard }: ProgressCardsCarouselProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedPageRef = useRef(LEVEL_PROGRESS_PAGE);
  const [pageWidth, setPageWidth] = useState(0);
  const [selectedPage, setSelectedPage] = useState(LEVEL_PROGRESS_PAGE);

  /** Stores the actual card viewport width so each page occupies the complete carousel. */
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0) setPageWidth(nextWidth);
  }, []);

  /** Updates the selected indicator after a swipe settles on a card. */
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      const nextPage = clampPageIndex(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
      selectedPageRef.current = nextPage;
      setSelectedPage(nextPage);
    },
    [pageWidth],
  );

  /** Moves the carousel to a requested page and immediately updates its selected indicator. */
  const showPage = useCallback(
    (index: number) => {
      const nextPage = clampPageIndex(index);
      selectedPageRef.current = nextPage;
      setSelectedPage(nextPage);
      if (pageWidth > 0) scrollViewRef.current?.scrollTo?.({ animated: true, x: nextPage * pageWidth, y: 0 });
    },
    [pageWidth],
  );

  /** Returns directly to the first Level Progress card. */
  const showLevelProgress = useCallback(() => showPage(LEVEL_PROGRESS_PAGE), [showPage]);

  /** Advances directly to the second Holy Progress card. */
  const showHolyProgress = useCallback(() => showPage(HOLY_PROGRESS_PAGE), [showPage]);

  useEffect(
    /** Keeps the selected card aligned when rotation, resizing, or responsive layout changes its width. */
    function realignSelectedPage() {
      if (pageWidth > 0) {
        scrollViewRef.current?.scrollTo?.({ animated: false, x: selectedPageRef.current * pageWidth, y: 0 });
      }
    },
    [pageWidth],
  );

  const levelSelected = selectedPage === LEVEL_PROGRESS_PAGE;
  const holySelected = selectedPage === HOLY_PROGRESS_PAGE;
  const pageStyle = [styles.page, pageWidth > 0 ? { width: pageWidth } : styles.unmeasuredPage];

  return (
    <View onLayout={handleLayout} style={styles.container} testID="progress-cards-carousel-container">
      <ScrollView
        accessibilityHint={t("dashboard.progressCarousel.swipeHint")}
        accessibilityLabel={t("dashboard.progressCarousel.label")}
        decelerationRate="fast"
        disableIntervalMomentum
        horizontal
        nestedScrollEnabled
        onMomentumScrollEnd={handleScrollEnd}
        pagingEnabled
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={pageWidth > 0 ? pageWidth : undefined}
        style={styles.carousel}
        testID="progress-cards-carousel"
      >
        <View
          accessibilityElementsHidden={!levelSelected}
          importantForAccessibility={levelSelected ? "auto" : "no-hide-descendants"}
          pointerEvents={levelSelected ? "auto" : "none"}
          style={pageStyle}
          testID="level-progress-card-container"
        >
          {levelProgressCard}
        </View>
        <View
          accessibilityElementsHidden={!holySelected}
          importantForAccessibility={holySelected ? "auto" : "no-hide-descendants"}
          pointerEvents={holySelected ? "auto" : "none"}
          style={pageStyle}
          testID="holy-progress-card-container"
        >
          {holyProgressCard}
        </View>
      </ScrollView>

      <View style={styles.indicators} testID="progress-cards-carousel-indicators">
        <Pressable
          accessibilityLabel={t("dashboard.progressCarousel.showLevel")}
          accessibilityRole="button"
          accessibilityState={{ selected: levelSelected }}
          onPress={showLevelProgress}
          style={styles.dotTarget}
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.dot, levelSelected && styles.selectedDot]}
          />
        </Pressable>
        <Pressable
          accessibilityLabel={t("dashboard.progressCarousel.showHoly")}
          accessibilityRole="button"
          accessibilityState={{ selected: holySelected }}
          onPress={showHolyProgress}
          style={styles.dotTarget}
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.dot, holySelected && styles.selectedDot]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  carousel: {
    minWidth: 0,
    width: "100%",
  },
  container: {
    minWidth: 0,
    width: "100%",
  },
  dot: {
    backgroundColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2],
    opacity: theme.opacity.secondary,
    width: theme.spacing[2],
  },
  dotTarget: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  indicators: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  page: {
    flexShrink: 0,
    minWidth: 0,
  },
  selectedDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    opacity: 1,
    width: theme.spacing[5],
    ...theme.rosary.shadows.activeBead,
  },
  unmeasuredPage: {
    width: "100%",
  },
}));
