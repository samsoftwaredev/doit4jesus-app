import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Pressable, View, type ImageSourcePropType } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import type { RosaryMystery, RosaryPrayer } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { FruitOfMysteryCard } from "../FruitOfMysteryCard";
import { MysteryCard } from "../MysteryCard";
import { PrayerCard } from "../PrayerCard";
import { RosaryArtworkCard } from "../RosaryArtworkCard";
import { ScriptureCard } from "../ScriptureCard";

const SWIPE_THRESHOLD = 42;
const VERTICAL_GESTURE_LIMIT = 24;
const DETAIL_PAGES = ["mystery", "artwork", "fruit", "prayer", "scripture"] as const;

type RosaryDetailPage = (typeof DETAIL_PAGES)[number];

export interface RosaryDetailCarouselProps {
  artworkSource?: ImageSourcePropType;
  mystery?: RosaryMystery;
  prayer?: RosaryPrayer;
  scriptureQuotation?: string;
  scriptureReference?: string;
}

/** Wraps any page index into the available five-page carousel range. */
function wrapPageIndex(index: number) {
  return (index + DETAIL_PAGES.length) % DETAIL_PAGES.length;
}

/**
 * Shows one Rosary detail card at a time with wraparound swipes and directly selectable pagination dots.
 * The active detail remains stable while incoming mystery and prayer content updates.
 */
export function RosaryDetailCarousel({
  artworkSource,
  mystery,
  prayer,
  scriptureQuotation,
  scriptureReference,
}: RosaryDetailCarouselProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [activePageIndex, setActivePageIndex] = useState(0);
  const activePage = DETAIL_PAGES[activePageIndex];

  /** Moves to a requested detail page, wrapping at the ends and announcing the new selection. */
  const showPage = useCallback(
    (index: number) => {
      const nextIndex = wrapPageIndex(index);
      if (nextIndex === activePageIndex) return;
      const nextPage = DETAIL_PAGES[nextIndex];
      setActivePageIndex(nextIndex);
      AccessibilityInfo.announceForAccessibility(
        t("rosary.carousel.pageAnnouncement", {
          current: nextIndex + 1,
          title: t(`rosary.carousel.pages.${nextPage}`),
          total: DETAIL_PAGES.length,
        }),
      );
    },
    [activePageIndex, t],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .withTestId("rosary-detail-carousel-swipe")
        .activeOffsetX([-14, 14])
        .failOffsetY([-VERTICAL_GESTURE_LIMIT, VERTICAL_GESTURE_LIMIT])
        .runOnJS(true)
        .onEnd((event) => {
          if (Math.abs(event.translationX) < SWIPE_THRESHOLD || Math.abs(event.translationY) > VERTICAL_GESTURE_LIMIT)
            return;
          showPage(activePageIndex + (event.translationX < 0 ? 1 : -1));
        }),
    [activePageIndex, showPage],
  );

  /** Renders only the selected detail so hidden cards stay outside the visual and accessibility trees. */
  function renderActivePage(page: RosaryDetailPage) {
    switch (page) {
      case "artwork":
        return <RosaryArtworkCard imageSource={artworkSource} />;
      case "fruit":
        return <FruitOfMysteryCard description={mystery?.fruitDescription} fruit={mystery?.fruit} />;
      case "prayer":
        return <PrayerCard prayer={prayer} />;
      case "scripture":
        return <ScriptureCard quotation={scriptureQuotation} reference={scriptureReference} />;
      default:
        return <MysteryCard mystery={mystery} />;
    }
  }

  return (
    <View style={styles.container} testID="rosary-detail-carousel">
      <View
        accessibilityHint={t("rosary.carousel.swipeHint")}
        accessibilityLabel={t("rosary.carousel.label")}
        accessibilityRole="text"
        accessible
        pointerEvents="none"
        style={styles.accessibilityGuide}
      />
      <GestureDetector gesture={panGesture}>
        <View style={styles.gestureArea}>
          <Animated.View
            entering={reduceMotion ? undefined : FadeIn.duration(180)}
            key={activePage}
            style={styles.page}
            testID={`rosary-detail-page-${activePage}`}
          >
            {renderActivePage(activePage)}
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={styles.pagination}>
        {DETAIL_PAGES.map((page, index) => {
          const isSelected = index === activePageIndex;
          const title = t(`rosary.carousel.pages.${page}`);
          return (
            <Pressable
              accessibilityLabel={t("rosary.carousel.showPage", {
                current: index + 1,
                title,
                total: DETAIL_PAGES.length,
              })}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={page}
              onPress={() => showPage(index)}
              style={({ pressed }) => [styles.dotTarget, pressed && styles.pressed]}
            >
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={[styles.dot, isSelected && styles.selectedDot]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  container: {
    minWidth: 0,
    width: "100%",
  },
  accessibilityGuide: {
    height: 1,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    width: 1,
  },
  gestureArea: {
    minWidth: 0,
    width: "100%",
  },
  page: {
    minWidth: 0,
    width: "100%",
  },
  pagination: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing[1],
  },
  dotTarget: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  dot: {
    backgroundColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    height: 7,
    opacity: theme.opacity.secondary,
    width: 7,
  },
  selectedDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    opacity: 1,
    width: 20,
    ...theme.rosary.shadows.activeBead,
  },
  pressed: {
    opacity: theme.opacity.muted,
  },
}));
