import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { BeadState, PrayerProgress, RosaryBead } from "@/features/prayer/rosary/types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const roseImage = require("../../../../../../assets/images/rosary/rose-bead.png");
const crucifixImage = require("../../../../../../assets/images/rosary/crucifix-bead.png");

const SWIPE_THRESHOLD = 42;
const TOOLTIP_DURATION_MS = 1500;
const FULL_TURN = Math.PI * 2;
const ARC_FOCAL_ANGLE = -Math.PI / 2;
const OUR_FATHER_SEGMENT_WEIGHT = 1.55;

export interface RosaryArcProps {
  beads: RosaryBead[];
  completedBeadIds: string[];
  currentBeadIndex: number;
  isTransitioning: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelectBead: (beadId: string) => void;
  progress: PrayerProgress;
}

interface MarkerPosition {
  x: number;
  y: number;
}

interface ArcMarker {
  bead: RosaryBead;
  displayNumber?: number;
  position: MarkerPosition;
  sourceIndex: number;
  state: BeadState;
}

interface VisibleTooltip {
  id: string;
  prayerName: string;
}

/** Returns whether a prayer step has a dedicated marker on the physical Rosary. */
function hasVisibleMarker(bead: RosaryBead) {
  return bead.type === "creed" || bead.isPhysicalBead !== false;
}

/** Finds the active visible marker, retaining the preceding bead during prayers said on the chain. */
function highlightedMarkerIndex(beads: RosaryBead[], visibleBeads: RosaryBead[], currentBeadIndex: number) {
  if (visibleBeads.length === 0) return -1;
  const boundedIndex = Math.max(0, Math.min(currentBeadIndex, beads.length - 1));
  const markerIds = new Set(visibleBeads.map((bead) => bead.id));

  for (let index = boundedIndex; index >= 0; index -= 1) {
    if (markerIds.has(beads[index]?.id)) return visibleBeads.findIndex((bead) => bead.id === beads[index].id);
  }

  return 0;
}

/** Assigns one-based numbers to physical beads while leaving the opening crucifix unnumbered. */
function physicalBeadNumbers(beads: RosaryBead[]) {
  const numbers = new Map<string, number>();
  let current = 0;

  for (const bead of beads) {
    if (bead.isPhysicalBead === false) continue;
    current += 1;
    numbers.set(bead.id, current);
  }

  return numbers;
}

/** Produces a stable handcrafted offset so markers do not shift randomly between renders. */
function naturalVariation(id: string) {
  const hash = [...id].reduce((value, character) => (value * 31 + character.charCodeAt(0)) % 997, 17);
  return {
    angle: ((hash % 9) - 4) * 0.0016,
    radius: ((Math.floor(hash / 9) % 5) - 2) * 0.8,
  };
}

/** Gives both chain segments beside an Our Father pearl more angular room than ordinary rose segments. */
function weightedMarkerTurns(beads: RosaryBead[], activeIndex: number) {
  if (beads.length === 0) return [];

  const segmentWeights = beads.map((bead, index) => {
    const nextBead = beads[(index + 1) % beads.length];
    return bead.type === "ourFather" || nextBead?.type === "ourFather" ? OUR_FATHER_SEGMENT_WEIGHT : 1;
  });
  const totalWeight = segmentWeights.reduce((total, weight) => total + weight, 0);

  return beads.map((_, index) => {
    let forwardWeight = 0;
    let cursor = activeIndex;

    while (cursor !== index) {
      forwardWeight += segmentWeights[cursor];
      cursor = (cursor + 1) % beads.length;
    }

    const forwardTurn = forwardWeight / totalWeight;
    return forwardTurn > 0.5 ? forwardTurn - 1 : forwardTurn;
  });
}

/** Resolves the semantic progress state for a visible marker against the full prayer sequence. */
function resolveMarkerState({
  activeMarkerId,
  bead,
  completedBeadIds,
  currentBeadIndex,
  sourceIndex,
}: {
  activeMarkerId: string | undefined;
  bead: RosaryBead;
  completedBeadIds: Set<string>;
  currentBeadIndex: number;
  sourceIndex: number;
}): BeadState {
  if (bead.id === activeMarkerId) return "active";
  if (completedBeadIds.has(bead.id) || sourceIndex < currentBeadIndex) return "completed";
  return "upcoming";
}

/** Calculates one marker position from its weighted turn around the responsive Rosary ellipse. */
function markerPosition({
  height,
  id,
  isActive,
  turn,
  width,
}: {
  height: number;
  id: string;
  isActive: boolean;
  turn: number;
  width: number;
}): MarkerPosition {
  const variation = isActive ? { angle: 0, radius: 0 } : naturalVariation(id);
  const angle = ARC_FOCAL_ANGLE + turn * FULL_TURN + variation.angle;
  const horizontalRadiusRatio = width < theme.breakpoints.tablet ? 0.8 : 0.54;
  const horizontalRadius = width * horizontalRadiusRatio + variation.radius;
  const verticalRadius = height * 0.7 + variation.radius;

  return {
    x: width / 2 + Math.cos(angle) * horizontalRadius,
    y: height * 0.86 + Math.sin(angle) * verticalRadius,
  };
}

/** Returns absolute line geometry connecting two marker centers. */
function chainSegmentStyle(start: MarkerPosition, end: MarkerPosition): ViewStyle {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  return {
    left: (start.x + end.x - length) / 2,
    top: (start.y + end.y) / 2,
    transform: [{ rotateZ: `${Math.atan2(deltaY, deltaX)}rad` }],
    width: length,
  };
}

/** Formats the localized accessible name for one Rosary marker. */
function markerAccessibilityLabel({
  bead,
  displayNumber,
  state,
  t,
}: {
  bead: RosaryBead;
  displayNumber?: number;
  state: BeadState;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const stateLabel = t(`rosary.bead.${state === "active" ? "current" : state}`);
  const prayerName = bead.prayer?.name ?? t(`rosary.bead.${bead.type}`);
  if (bead.type === "creed") return t("rosary.bead.markerLabelCrucifix", { prayer: prayerName, state: stateLabel });
  return t("rosary.bead.markerLabel", {
    marker: t("rosary.bead.bead"),
    number: displayNumber,
    prayer: prayerName,
    state: stateLabel,
  });
}

/**
 * Renders an interactive, oversized Rosary loop centered on the current prayer.
 * Physical beads remain countable while non-bead prayers hold the preceding marker in focus.
 */
export function RosaryArc({
  beads,
  completedBeadIds,
  currentBeadIndex,
  isTransitioning,
  onNext,
  onPrevious,
  onSelectBead,
  progress,
}: RosaryArcProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { fontScale, height: windowHeight, width: windowWidth } = useResponsiveLayout();
  const reduceMotion = useReducedMotion();
  const [stageWidth, setStageWidth] = useState(windowWidth);
  const [tooltip, setTooltip] = useState<VisibleTooltip>();
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousMarkerIndex = useRef(0);
  const arcOffset = useSharedValue(0);
  const activeScale = useSharedValue(1.18);
  const isTablet = windowWidth >= theme.breakpoints.tablet;
  const isDesktop = windowWidth >= theme.breakpoints.desktop;
  const isLandscape = windowWidth > windowHeight;
  const availableHeightRatio = isLandscape ? 0.4 : 0.46;
  const stageHeight = Math.max(
    150,
    Math.min(isDesktop ? 430 : isTablet ? 390 : 340, windowHeight * availableHeightRatio),
  );
  const markerVisualSize = fontScale > 1.25 || windowWidth < theme.breakpoints.smallPhone ? 20 : isTablet ? 28 : 23;
  const pearlVisualSize = markerVisualSize + (isTablet ? 13 : 11);
  const visibleBeads = useMemo(() => beads.filter(hasVisibleMarker), [beads]);
  const activeMarkerIndex = useMemo(
    () => highlightedMarkerIndex(beads, visibleBeads, currentBeadIndex),
    [beads, currentBeadIndex, visibleBeads],
  );
  const activeMarkerId = visibleBeads[activeMarkerIndex]?.id;
  const numberById = useMemo(() => physicalBeadNumbers(visibleBeads), [visibleBeads]);
  const markerTurns = useMemo(
    () => weightedMarkerTurns(visibleBeads, Math.max(0, activeMarkerIndex)),
    [activeMarkerIndex, visibleBeads],
  );
  const completedIds = useMemo(() => new Set(completedBeadIds), [completedBeadIds]);
  const sourceIndexById = useMemo(() => new Map(beads.map((bead, index) => [bead.id, index])), [beads]);
  const progressText = t("rosary.arc.progress", { current: progress.currentIndex, total: progress.total });
  const markers = useMemo<ArcMarker[]>(
    () =>
      visibleBeads.map((bead, index) => {
        const sourceIndex = sourceIndexById.get(bead.id) ?? -1;
        return {
          bead,
          displayNumber: numberById.get(bead.id),
          position: markerPosition({
            height: stageHeight,
            id: bead.id,
            isActive: index === activeMarkerIndex,
            turn: markerTurns[index] ?? 0,
            width: stageWidth,
          }),
          sourceIndex,
          state: resolveMarkerState({
            activeMarkerId,
            bead,
            completedBeadIds: completedIds,
            currentBeadIndex,
            sourceIndex,
          }),
        };
      }),
    [
      activeMarkerId,
      activeMarkerIndex,
      completedIds,
      currentBeadIndex,
      markerTurns,
      numberById,
      sourceIndexById,
      stageHeight,
      stageWidth,
      visibleBeads,
    ],
  );

  useEffect(() => {
    const movementDirection = activeMarkerIndex >= previousMarkerIndex.current ? 1 : -1;
    previousMarkerIndex.current = activeMarkerIndex;
    arcOffset.value = reduceMotion ? 0 : movementDirection * 10;
    arcOffset.value = withTiming(0, { duration: reduceMotion ? 0 : 320 });
  }, [activeMarkerIndex, arcOffset, reduceMotion]);

  useEffect(() => {
    cancelAnimation(activeScale);
    if (reduceMotion) {
      activeScale.value = 1.18;
      return;
    }
    activeScale.value = withRepeat(
      withSequence(withTiming(1.22, { duration: 850 }), withTiming(1.15, { duration: 850 })),
      -1,
      true,
    );
    return () => cancelAnimation(activeScale);
  }, [activeMarkerId, activeScale, reduceMotion]);

  useEffect(
    () => () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    },
    [],
  );

  const arcMotionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arcOffset.value }],
  }));
  const activeMarkerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: activeScale.value }],
  }));

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .withTestId("rosary-arc-swipe-gesture")
        .activeOffsetX([-14, 14])
        .failOffsetY([-24, 24])
        .runOnJS(true)
        .onEnd((event) => {
          if (isTransitioning || Math.abs(event.translationX) < SWIPE_THRESHOLD) return;
          if (event.translationX < 0) onNext();
          else onPrevious();
        }),
    [isTransitioning, onNext, onPrevious],
  );

  /** Updates responsive arc geometry from the actual content width. */
  function handleStageLayout(event: { nativeEvent: { layout: { width: number } } }) {
    setStageWidth(event.nativeEvent.layout.width);
  }

  /** Replays the short focus motion when the already-current marker is activated. */
  function focusCurrentMarker() {
    if (isTransitioning) return;
    arcOffset.value = reduceMotion ? 0 : -8;
    arcOffset.value = withTiming(0, { duration: reduceMotion ? 0 : 220 });
  }

  /** Activates only completed markers; current and upcoming markers cannot change progress. */
  function handleMarkerPress(marker: ArcMarker) {
    if (isTransitioning) return;
    if (marker.state === "completed") onSelectBead(marker.bead.id);
    else if (marker.state === "active") focusCurrentMarker();
  }

  /** Shows a temporary visual prayer-name label while keeping screen-reader labels permanently descriptive. */
  function handleMarkerLongPress(marker: ArcMarker) {
    const prayerName = marker.bead.prayer?.name ?? t(`rosary.bead.${marker.bead.type}`);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setTooltip({ id: marker.bead.id, prayerName });
    tooltipTimer.current = setTimeout(() => setTooltip(undefined), TOOLTIP_DURATION_MS);
  }

  /** Renders one continuous gold chain segment between neighboring markers. */
  function renderChainSegment(marker: ArcMarker, index: number) {
    const nextMarker = markers[(index + 1) % markers.length];
    if (!nextMarker) return null;
    const completedSegment = marker.state === "completed" && nextMarker.state !== "upcoming";
    return (
      <View
        key={`chain-${marker.bead.id}`}
        pointerEvents="none"
        style={[
          styles.chainSegment,
          chainSegmentStyle(marker.position, nextMarker.position),
          completedSegment && styles.completedChainSegment,
        ]}
      />
    );
  }

  /** Renders a decorative connector at the boundary after each Our Father bead. */
  function renderConnector(marker: ArcMarker, index: number) {
    if (marker.bead.type !== "ourFather") return null;
    const nextMarker = markers[(index + 1) % markers.length];
    if (!nextMarker) return null;
    return (
      <View
        key={`connector-${marker.bead.id}`}
        pointerEvents="none"
        style={[
          styles.connector,
          {
            left: (marker.position.x + nextMarker.position.x) / 2 - 3,
            top: (marker.position.y + nextMarker.position.y) / 2 - 3,
          },
        ]}
        testID={`rosary-arc-connector-${marker.bead.id}`}
      />
    );
  }

  /** Renders one accessible rose, pearl, or crucifix marker at its calculated arc position. */
  function renderMarker(marker: ArcMarker) {
    const isActive = marker.state === "active";
    const isCompleted = marker.state === "completed";
    const isCrucifix = marker.bead.type === "creed";
    const isPearl = marker.bead.type === "ourFather";
    const visualSize = isCrucifix ? pearlVisualSize : isPearl ? pearlVisualSize : markerVisualSize;
    const label = markerAccessibilityLabel({
      bead: marker.bead,
      displayNumber: marker.displayNumber,
      state: marker.state,
      t,
    });
    const prayerName = marker.bead.prayer?.name ?? t(`rosary.bead.${marker.bead.type}`);
    const markerBody = isCrucifix ? (
      <View
        style={[
          styles.crucifix,
          marker.state === "upcoming" && styles.upcomingCrucifix,
          isCompleted && styles.completedMarkerGlow,
          isActive && styles.currentMarkerGlow,
        ]}
        testID={`rosary-arc-crucifix-${marker.bead.id}`}
      >
        <Image
          accessible={false}
          contentFit="contain"
          source={crucifixImage}
          style={styles.crucifixImage}
          testID={`rosary-arc-crucifix-artwork-${marker.bead.id}`}
        />
      </View>
    ) : isPearl ? (
      <View
        style={[
          styles.pearl,
          { height: visualSize, width: visualSize },
          marker.state === "upcoming" && styles.upcomingPearl,
          isCompleted && styles.completedMarkerGlow,
          isActive && styles.currentMarkerGlow,
        ]}
        testID={`rosary-arc-pearl-${marker.bead.id}`}
      >
        <View style={styles.pearlHighlight} />
      </View>
    ) : (
      <View
        style={[
          styles.roseShell,
          { height: visualSize, width: visualSize },
          isCompleted && styles.completedMarkerGlow,
          isActive && styles.currentMarkerGlow,
        ]}
        testID={`rosary-arc-rose-${marker.bead.id}`}
      >
        <Image
          accessible={false}
          contentFit="contain"
          source={roseImage}
          style={[styles.roseImage, marker.state === "upcoming" && styles.upcomingRose]}
        />
        {marker.state === "upcoming" ? <View pointerEvents="none" style={styles.upcomingRoseScrim} /> : null}
      </View>
    );

    return (
      <Pressable
        accessibilityHint={
          isCompleted
            ? t("rosary.arc.completedHint")
            : isActive
              ? t("rosary.arc.currentHint")
              : t("rosary.arc.upcomingHint")
        }
        accessibilityLabel={label}
        accessibilityRole={marker.state === "upcoming" ? "image" : "button"}
        accessibilityState={isActive ? { selected: true } : undefined}
        disabled={isTransitioning}
        key={marker.bead.id}
        onLongPress={() => handleMarkerLongPress(marker)}
        onPress={marker.state === "upcoming" ? undefined : () => handleMarkerPress(marker)}
        style={[
          styles.markerTarget,
          {
            left: marker.position.x - theme.sizes.touchTarget / 2,
            top: marker.position.y - theme.sizes.touchTarget / 2,
            zIndex: isActive ? 4 : isCompleted ? 3 : 2,
          },
        ]}
        testID={marker.bead.isPhysicalBead === false ? undefined : `rosary-arc-physical-${marker.bead.id}`}
      >
        <Animated.View style={[styles.markerVisual, isActive && activeMarkerStyle]}>{markerBody}</Animated.View>
        {tooltip?.id === marker.bead.id ? (
          <View
            accessibilityLabel={t("rosary.arc.prayerName", { prayer: prayerName })}
            accessibilityLiveRegion="polite"
            style={styles.tooltip}
          >
            <Text numberOfLines={2} style={styles.tooltipText}>
              {prayerName}
            </Text>
          </View>
        ) : null}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityHint={t("rosary.arc.swipeHint")}
      accessibilityLabel={t("rosary.arc.label")}
      style={[styles.container, { height: stageHeight }]}
    >
      <GestureDetector gesture={panGesture}>
        <View onLayout={handleStageLayout} style={styles.stage} testID="rosary-arc-stage">
          <Animated.View style={[styles.movingLayer, arcMotionStyle]}>
            {markers.map(renderChainSegment)}
            {markers.map(renderConnector)}
            {markers.map(renderMarker)}
          </Animated.View>
          <View pointerEvents="none" style={styles.indicator}>
            <Text accessibilityRole="header" numberOfLines={2} style={styles.prayerName}>
              {progress.prayerName}
            </Text>
            <View
              accessible
              accessibilityLabel={t("rosary.arc.progressLabel", {
                current: progress.currentIndex,
                total: progress.total,
              })}
              accessibilityRole="progressbar"
              accessibilityValue={{
                max: progress.total,
                min: 0,
                now: progress.currentIndex,
                text: progressText,
              }}
            >
              <Text style={styles.progress}>{progressText}</Text>
            </View>
          </View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  container: {
    alignSelf: "center",
    maxWidth: 980,
    minWidth: 0,
    overflow: "hidden",
    width: "100%",
  },
  stage: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  movingLayer: {
    ...StyleSheet.absoluteFill,
  },
  chainSegment: {
    backgroundColor: theme.rosary.colors.chain,
    height: theme.borderWidths.thin,
    opacity: 0.72,
    position: "absolute",
  },
  completedChainSegment: {
    backgroundColor: theme.rosary.colors.goldBright,
    opacity: 0.9,
    ...theme.rosary.shadows.activeBead,
  },
  connector: {
    backgroundColor: theme.rosary.colors.gold,
    borderColor: theme.rosary.colors.goldBright,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: 6,
    position: "absolute",
    width: 6,
    zIndex: 1,
  },
  markerTarget: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    position: "absolute",
    width: theme.sizes.touchTarget,
  },
  markerVisual: {
    alignItems: "center",
    justifyContent: "center",
  },
  roseShell: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    justifyContent: "center",
    overflow: "visible",
  },
  roseImage: {
    height: "100%",
    width: "100%",
  },
  upcomingRose: {
    opacity: 0.48,
  },
  upcomingRoseScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(31, 6, 11, 0.34)",
    borderRadius: theme.radii.pill,
  },
  pearl: {
    alignItems: "flex-start",
    backgroundColor: theme.rosary.colors.pearl,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldEmphasis,
    justifyContent: "flex-start",
  },
  pearlHighlight: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: theme.radii.pill,
    height: "32%",
    marginLeft: "20%",
    marginTop: "16%",
    width: "32%",
  },
  upcomingPearl: {
    backgroundColor: theme.rosary.colors.pearlShadow,
    borderColor: theme.rosary.colors.goldMuted,
    opacity: 0.68,
  },
  completedMarkerGlow: {
    ...theme.rosary.shadows.activeBead,
  },
  currentMarkerGlow: {
    borderColor: theme.rosary.colors.goldBright,
    borderWidth: theme.rosary.borderWidths.goldEmphasis,
    ...theme.rosary.shadows.activeBead,
  },
  crucifix: {
    alignItems: "center",
    borderRadius: theme.radii.md,
    height: 62,
    justifyContent: "center",
    width: 50,
  },
  crucifixImage: {
    height: "100%",
    width: "100%",
  },
  upcomingCrucifix: {
    opacity: 0.52,
  },
  indicator: {
    alignItems: "center",
    left: "17%",
    position: "absolute",
    right: "17%",
    top: "30%",
    zIndex: 6,
  },
  prayerName: {
    ...theme.typography.heading2,
    color: theme.rosary.colors.immersivePrimary,
    textAlign: "center",
    textShadowColor: theme.colors.background.overlay,
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 5,
  },
  progress: {
    ...theme.typography.label,
    color: theme.rosary.colors.immersiveGold,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  tooltip: {
    backgroundColor: theme.rosary.colors.immersiveControl,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.md,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    bottom: theme.sizes.touchTarget,
    maxWidth: 150,
    minWidth: 92,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    position: "absolute",
    zIndex: 8,
  },
  tooltipText: {
    ...theme.typography.caption,
    color: theme.rosary.colors.immersivePrimary,
    textAlign: "center",
  },
}));
