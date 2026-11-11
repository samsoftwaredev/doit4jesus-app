import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

const TODAY_PAGE = 0;
const MYSTERIES_PAGE = 1;

export interface HomeSectionsCarouselProps {
  mysteriesPage: ReactNode;
  todayPage: ReactNode;
}

/** Keeps a calculated carousel page within the two-page range. */
function clampPageIndex(index: number): number {
  return Math.min(Math.max(index, TODAY_PAGE), MYSTERIES_PAGE);
}

/**
 * Presents Today's Rosary with streak progress first and All Mysteries second in a horizontally paged carousel.
 * Swipe gestures and the two accessible indicators stay synchronized across layout changes.
 */
export function HomeSectionsCarousel({ mysteriesPage, todayPage }: HomeSectionsCarouselProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedPageRef = useRef(TODAY_PAGE);
  const [pageWidth, setPageWidth] = useState(0);
  const [selectedPage, setSelectedPage] = useState(TODAY_PAGE);

  /** Stores the actual viewport width so each page occupies the complete carousel. */
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0) setPageWidth(nextWidth);
  }, []);

  /** Updates the selected indicator after a swipe settles on a page. */
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

  useEffect(
    /** Keeps the selected page aligned when rotation, resizing, or responsive layout changes its width. */
    function realignSelectedPage() {
      if (pageWidth > 0) {
        scrollViewRef.current?.scrollTo?.({ animated: false, x: selectedPageRef.current * pageWidth, y: 0 });
      }
    },
    [pageWidth],
  );

  const todaySelected = selectedPage === TODAY_PAGE;
  const mysteriesSelected = selectedPage === MYSTERIES_PAGE;
  const pageStyle = [styles.page, pageWidth > 0 ? { width: pageWidth } : styles.unmeasuredPage];

  return (
    <View onLayout={handleLayout} style={styles.container} testID="home-sections-carousel-container">
      <ScrollView
        accessibilityHint={t("dashboard.homeCarousel.swipeHint")}
        accessibilityLabel={t("dashboard.homeCarousel.label")}
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
        testID="home-sections-carousel"
      >
        <View
          accessibilityElementsHidden={!todaySelected}
          importantForAccessibility={todaySelected ? "auto" : "no-hide-descendants"}
          pointerEvents={todaySelected ? "auto" : "none"}
          style={pageStyle}
          testID="home-today-page"
        >
          {todayPage}
        </View>
        <View
          accessibilityElementsHidden={!mysteriesSelected}
          importantForAccessibility={mysteriesSelected ? "auto" : "no-hide-descendants"}
          pointerEvents={mysteriesSelected ? "auto" : "none"}
          style={pageStyle}
          testID="home-mysteries-page"
        >
          {mysteriesPage}
        </View>
      </ScrollView>

      <View style={styles.indicators} testID="home-sections-carousel-indicators">
        {[
          { label: t("dashboard.homeCarousel.showToday"), page: TODAY_PAGE, selected: todaySelected },
          { label: t("dashboard.homeCarousel.showMysteries"), page: MYSTERIES_PAGE, selected: mysteriesSelected },
        ].map(({ label, page, selected }) => (
          <Pressable
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={page}
            onPress={() => showPage(page)}
            style={styles.dotTarget}
          >
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={[styles.dot, selected && styles.selectedDot]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  carousel: { minWidth: 0, width: "100%" },
  container: { minWidth: 0, width: "100%" },
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
  indicators: { alignItems: "center", flexDirection: "row", justifyContent: "center" },
  page: { flexShrink: 0, gap: theme.spacing[4], minWidth: 0 },
  selectedDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    opacity: 1,
    width: theme.spacing[5],
    ...theme.rosary.shadows.activeBead,
  },
  unmeasuredPage: { width: "100%" },
}));
