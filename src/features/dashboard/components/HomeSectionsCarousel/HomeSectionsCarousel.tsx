import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { usePagedCarousel } from "../usePagedCarousel";

const TODAY_PAGE = 0;
const MYSTERIES_PAGE = 1;
const PILL_HEIGHT = 14;

export interface HomeSectionsCarouselProps {
  mysteriesPage: ReactNode;
  todayPage: ReactNode;
}

/**
 * Presents Today's Rosary with streak progress first and All Mysteries second in a horizontally paged carousel.
 * Swipe gestures and the two accessible indicators stay synchronized across layout changes.
 */
export function HomeSectionsCarousel({ mysteriesPage, todayPage }: HomeSectionsCarouselProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const { onLayout, onScroll, onScrollEnd, pageWidth, scrollViewRef, selectedPage, showPage } = usePagedCarousel(2);

  const todaySelected = selectedPage === TODAY_PAGE;
  const mysteriesSelected = selectedPage === MYSTERIES_PAGE;
  const pageStyle = [styles.page, pageWidth > 0 ? { width: pageWidth } : styles.unmeasuredPage];

  return (
    <View onLayout={onLayout} style={styles.container} testID="home-sections-carousel-container">
      <ScrollView
        accessibilityHint={t("dashboard.homeCarousel.swipeHint")}
        accessibilityLabel={t("dashboard.homeCarousel.label")}
        decelerationRate="fast"
        disableIntervalMomentum
        horizontal
        nestedScrollEnabled
        onMomentumScrollEnd={onScrollEnd}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEnd}
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
          {
            caption: t("dashboard.homeCarousel.todayCaption"),
            label: t("dashboard.homeCarousel.showToday"),
            page: TODAY_PAGE,
            selected: todaySelected,
          },
          {
            caption: t("dashboard.homeCarousel.mysteriesCaption"),
            label: t("dashboard.homeCarousel.showMysteries"),
            page: MYSTERIES_PAGE,
            selected: mysteriesSelected,
          },
        ].map(({ caption, label, page, selected }) => (
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
              testID={`home-carousel-pill-${page}`}
            >
              {selected ? null : (
                <Text numberOfLines={1} style={styles.dotCaption} testID="home-carousel-pill-caption">
                  {caption}
                </Text>
              )}
            </View>
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
    alignItems: "center",
    backgroundColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    height: PILL_HEIGHT,
    justifyContent: "center",
    minWidth: theme.spacing[5],
    opacity: theme.opacity.secondary,
    paddingHorizontal: theme.spacing[2],
  },
  dotCaption: {
    color: theme.colors.text.inverse,
    fontSize: 9,
    fontWeight: "600",
    lineHeight: 11,
  },
  dotTarget: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    minWidth: theme.sizes.touchTarget,
  },
  indicators: { alignItems: "center", flexDirection: "row", justifyContent: "center" },
  page: { flexShrink: 0, gap: theme.spacing[4], minWidth: 0 },
  selectedDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    opacity: 1,
    ...theme.rosary.shadows.activeBead,
  },
  unmeasuredPage: { width: "100%" },
}));
