import Feather from "@expo/vector-icons/Feather";
import { useEffect, useMemo, useRef, useState } from "react";
import { type LayoutChangeEvent, Pressable, ScrollView, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { RosaryBead } from "@/features/prayer/rosary/components/RosaryBead";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { RosaryBead as RosaryBeadModel } from "@/features/prayer/rosary/types";

interface RosaryBeadNavigatorProps {
  beads: RosaryBeadModel[];
  currentBeadIndex: number;
  completedBeadIds: string[];
  isTransitioning: boolean;
  compact?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelectBead: (beadId: string) => void;
}

const SWIPE_THRESHOLD = 36;
const ACTIVE_MARKER_BOTTOM_ROWS = 2.8;

/** Returns whether a prayer step has a physical navigator marker. */
function hasVisibleMarker(bead: RosaryBeadModel) {
  return bead.type === "creed" || bead.isPhysicalBead !== false;
}

/** Finds the current marker, falling back to the preceding physical marker for non-bead prayers. */
function highlightedMarkerIndex(beads: RosaryBeadModel[], visibleBeads: RosaryBeadModel[], currentBeadIndex: number) {
  if (visibleBeads.length === 0) return -1;
  const boundedIndex = Math.max(0, Math.min(currentBeadIndex, beads.length - 1));
  const visibleIds = new Set(visibleBeads.map((bead) => bead.id));

  for (let index = boundedIndex; index >= 0; index -= 1) {
    if (visibleIds.has(beads[index]?.id)) {
      return visibleBeads.findIndex((bead) => bead.id === beads[index].id);
    }
  }

  return 0;
}

/** Assigns continuous one-based numbers to physical beads while leaving the crucifix unnumbered. */
function physicalBeadNumbers(beads: RosaryBeadModel[]) {
  const numbers = new Map<string, number>();
  let physicalBeadCount = 0;

  for (const bead of beads) {
    if (bead.isPhysicalBead === false) continue;
    physicalBeadCount += 1;
    numbers.set(bead.id, physicalBeadCount);
  }

  return numbers;
}

/** Places the active marker near the lower edge while allowing the ScrollView to clamp at either end. */
function bottomAnchoredScrollOffset(displayIndex: number, rowHeight: number, viewportHeight: number) {
  if (displayIndex < 0 || viewportHeight <= 0) return 0;
  return Math.max(0, displayIndex * rowHeight - viewportHeight + rowHeight * ACTIVE_MARKER_BOTTOM_ROWS);
}

/**
 * Displays a transparent, bottom-to-top Rosary rail with swipe and direct-marker navigation.
 * Non-bead prayers retain the preceding marker, and optional swipe guidance stays collapsed until requested.
 */
export function RosaryBeadNavigator({
  beads,
  currentBeadIndex,
  completedBeadIds,
  isTransitioning,
  compact = false,
  onNext,
  onPrevious,
  onSelectBead,
}: RosaryBeadNavigatorProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const scrollView = useRef<ScrollView>(null);
  const [showsSwipeInstructions, setShowsSwipeInstructions] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const reduceMotion = useReducedMotion();
  const chainOffset = useSharedValue(0);
  const rowHeight = compact ? 44 : 52;
  const visibleBeads = useMemo(() => beads.filter(hasVisibleMarker), [beads]);
  const activeMarkerIndex = useMemo(
    () => highlightedMarkerIndex(beads, visibleBeads, currentBeadIndex),
    [beads, currentBeadIndex, visibleBeads],
  );
  const beadNumbers = useMemo(() => physicalBeadNumbers(visibleBeads), [visibleBeads]);
  const displayedBeads = useMemo(() => [...visibleBeads].reverse(), [visibleBeads]);
  const activeMarkerId = visibleBeads[activeMarkerIndex]?.id;
  const displayMarkerIndex = activeMarkerIndex < 0 ? -1 : visibleBeads.length - 1 - activeMarkerIndex;
  const sourceIndexById = useMemo(() => new Map(beads.map((bead, index) => [bead.id, index])), [beads]);

  useEffect(() => {
    if (viewportHeight <= 0) return;
    const targetOffset = bottomAnchoredScrollOffset(displayMarkerIndex, rowHeight, viewportHeight);
    scrollView.current?.scrollTo({ y: targetOffset, animated: !reduceMotion });
    chainOffset.value = withTiming(-Math.min(Math.max(0, activeMarkerIndex) * 2, 18), {
      duration: reduceMotion ? 0 : 260,
    });
  }, [activeMarkerIndex, chainOffset, displayMarkerIndex, reduceMotion, rowHeight, viewportHeight]);

  const chainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chainOffset.value }],
  }));

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .withTestId("rosary-swipe-gesture")
        .activeOffsetY([-12, 12])
        .failOffsetX([-36, 36])
        .runOnJS(true)
        .onEnd((event) => {
          if (isTransitioning || Math.abs(event.translationY) < SWIPE_THRESHOLD) return;
          if (event.translationY < 0) onNext();
          else onPrevious();
        }),
    [isTransitioning, onNext, onPrevious],
  );

  /** Resolves marker state against the full prayer sequence rather than the filtered visual list. */
  const beadState = (bead: RosaryBeadModel) => {
    if (bead.id === activeMarkerId) return "active" as const;
    const sourceIndex = sourceIndexById.get(bead.id) ?? -1;
    if (completedBeadIds.includes(bead.id) || sourceIndex < currentBeadIndex) return "completed" as const;
    return "upcoming" as const;
  };

  /** Keeps the gesture viewport measurement current for bottom-anchored automatic scrolling. */
  function handleGestureAreaLayout(event: LayoutChangeEvent) {
    setViewportHeight(event.nativeEvent.layout.height);
  }

  /** Shows or hides the optional swipe-navigation instructions. */
  function toggleSwipeInstructions() {
    setShowsSwipeInstructions((current) => !current);
  }

  return (
    <View accessibilityLabel={t("rosary.controls.navigator")} style={styles.container}>
      <View style={styles.infoArea}>
        <Pressable
          accessibilityLabel={t(showsSwipeInstructions ? "rosary.controls.hideSwipe" : "rosary.controls.showSwipe")}
          accessibilityRole="button"
          accessibilityState={{ expanded: showsSwipeInstructions }}
          onPress={toggleSwipeInstructions}
          style={({ pressed }) => [styles.infoButton, pressed && styles.pressed]}
        >
          <Feather accessible={false} color={theme.rosary.colors.goldBright} name="info" size={theme.sizes.iconSmall} />
        </Pressable>
        {showsSwipeInstructions ? (
          <Text accessibilityRole="text" style={[styles.swipeHint, compact && styles.compactHint]}>
            {t("rosary.controls.swipeHint")}
          </Text>
        ) : null}
      </View>

      <GestureDetector gesture={panGesture}>
        <View onLayout={handleGestureAreaLayout} style={styles.gestureArea}>
          <View pointerEvents="none" style={styles.guide} />
          <ScrollView
            contentContainerStyle={styles.beadList}
            nestedScrollEnabled
            ref={scrollView}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <Animated.View style={chainStyle}>
              {displayedBeads.map((bead, index) => (
                <View key={bead.id} style={[styles.beadRow, { minHeight: rowHeight }]}>
                  <RosaryBead
                    bead={bead}
                    compact={compact}
                    disabled={isTransitioning}
                    displayNumber={beadNumbers.get(bead.id)}
                    onPress={onSelectBead}
                    state={beadState(bead)}
                  />
                  {index < displayedBeads.length - 1 ? <View style={styles.chainLink} /> : null}
                </View>
              ))}
            </Animated.View>
          </ScrollView>
        </View>
      </GestureDetector>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  container: {
    alignItems: "center",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  infoArea: {
    alignItems: "center",
    width: "100%",
  },
  infoButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    minWidth: theme.sizes.touchTarget,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  gestureArea: {
    alignSelf: "stretch",
    flex: 1,
    minHeight: 0,
  },
  guide: {
    backgroundColor: theme.rosary.colors.chain,
    bottom: theme.spacing[0],
    left: "50%",
    opacity: 0.45,
    position: "absolute",
    top: theme.spacing[0],
    transform: [{ translateX: -0.5 }],
    width: theme.borderWidths.thin,
  },
  scrollView: {
    flex: 1,
  },
  beadList: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: theme.spacing[3],
    paddingTop: theme.spacing[1],
  },
  beadRow: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chainLink: {
    backgroundColor: theme.rosary.colors.chain,
    bottom: -theme.spacing[1],
    height: theme.spacing[3],
    opacity: 0.72,
    position: "absolute",
    width: theme.borderWidths.thin,
  },
  swipeHint: {
    ...theme.typography.caption,
    color: theme.rosary.colors.scripture,
    fontSize: 9,
    lineHeight: 12,
    marginBottom: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
    textAlign: "center",
  },
  compactHint: {
    fontSize: 8,
    lineHeight: 10,
  },
}));
