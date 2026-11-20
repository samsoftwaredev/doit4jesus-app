import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { usePagedCarousel } from "../usePagedCarousel";

const LEVEL_PROGRESS_PAGE = 0;
const HOLY_PROGRESS_PAGE = 1;

export interface ProgressCardsCarouselProps {
  holyProgressCard: ReactNode;
  levelProgressCard: ReactNode;
}

/**
 * Presents Level Progress first and Holy Progress second in a horizontally paged card carousel.
 * Swipe gestures and the two accessible indicators stay synchronized across layout changes.
 */
export function ProgressCardsCarousel({ holyProgressCard, levelProgressCard }: ProgressCardsCarouselProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const { onLayout, onScroll, onScrollEnd, pageWidth, scrollViewRef, selectedPage, showPage } = usePagedCarousel(2);
  const showLevelProgress = () => showPage(LEVEL_PROGRESS_PAGE);
  const showHolyProgress = () => showPage(HOLY_PROGRESS_PAGE);

  const levelSelected = selectedPage === LEVEL_PROGRESS_PAGE;
  const holySelected = selectedPage === HOLY_PROGRESS_PAGE;
  const pageStyle = [styles.page, pageWidth > 0 ? { width: pageWidth } : styles.unmeasuredPage];

  return (
    <View onLayout={onLayout} style={styles.container} testID="progress-cards-carousel-container">
      <ScrollView
        accessibilityHint={t("dashboard.progressCarousel.swipeHint")}
        accessibilityLabel={t("dashboard.progressCarousel.label")}
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
    flexDirection: "column",
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
