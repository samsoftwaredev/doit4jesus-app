import Feather from "@expo/vector-icons/Feather";
import { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { RosaryBead } from "@/components/rosary/RosaryBead";
import { theme } from "@/theme/tokens";
import type { RosaryBead as RosaryBeadModel } from "@/types/rosary";

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
  const scrollView = useRef<ScrollView>(null);
  const reduceMotion = useReducedMotion();
  const chainOffset = useSharedValue(0);
  const rowHeight = compact ? 44 : 52;

  useEffect(() => {
    const targetOffset = Math.max(0, currentBeadIndex * rowHeight - rowHeight * 1.8);
    scrollView.current?.scrollTo({ y: targetOffset, animated: !reduceMotion });
    chainOffset.value = withTiming(-Math.min(currentBeadIndex * 2, 18), {
      duration: reduceMotion ? 0 : 260,
    });
  }, [chainOffset, currentBeadIndex, reduceMotion, rowHeight]);

  const chainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chainOffset.value }],
  }));

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
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

  const beadState = (bead: RosaryBeadModel, index: number) => {
    if (index === currentBeadIndex) return "active" as const;
    if (completedBeadIds.includes(bead.id) || index < currentBeadIndex) return "completed" as const;
    return "upcoming" as const;
  };

  return (
    <View accessibilityLabel="Rosary bead navigator" style={[styles.container, compact && styles.compactContainer]}>
      <View style={styles.instructionRow}>
        <Pressable
          accessibilityLabel="Previous bead"
          accessibilityRole="button"
          accessibilityState={{ disabled: currentBeadIndex === 0 || isTransitioning }}
          disabled={currentBeadIndex === 0 || isTransitioning}
          hitSlop={theme.spacing[2]}
          onPress={onPrevious}
          style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}
          testID="previous-bead-button"
        >
          <Feather color={theme.rosary.colors.goldBright} name="chevron-up" size={theme.sizes.iconMedium} />
        </Pressable>
        {!compact ? <Text style={styles.instruction}>Previous{`\n`}bead</Text> : null}
      </View>

      <GestureDetector gesture={panGesture}>
        <View style={styles.gestureArea}>
          <View pointerEvents="none" style={styles.guide} />
          <ScrollView
            contentContainerStyle={styles.beadList}
            ref={scrollView}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <Animated.View style={chainStyle}>
              {beads.map((bead, index) => (
                <View key={bead.id} style={[styles.beadRow, { minHeight: rowHeight }]}>
                  <RosaryBead
                    bead={bead}
                    compact={compact}
                    disabled={isTransitioning}
                    onPress={onSelectBead}
                    state={beadState(bead, index)}
                  />
                  {index < beads.length - 1 ? <View style={styles.chainLink} /> : null}
                </View>
              ))}
              <View style={styles.medalWrap}>
                <View accessibilityLabel="Marian medal" style={styles.medal}>
                  <Text style={styles.medalText}>M</Text>
                </View>
              </View>
              <View style={styles.additionalBeads}>
                <View style={styles.smallBead} />
                <View style={styles.shortChain} />
                <View style={styles.smallBead} />
              </View>
              <View accessibilityLabel="Rosary crucifix" style={styles.crucifix}>
                <View style={styles.crossHorizontal} />
                <View style={styles.crossVertical} />
              </View>
            </Animated.View>
          </ScrollView>
        </View>
      </GestureDetector>

      <Text accessibilityRole="text" style={[styles.swipeHint, compact && styles.compactHint]}>
        Swipe up or down{`\n`}to move bead by bead
      </Text>

      <View style={styles.instructionRow}>
        <Pressable
          accessibilityLabel="Next bead"
          accessibilityRole="button"
          accessibilityState={{ disabled: isTransitioning || beads.length === 0 }}
          disabled={isTransitioning || beads.length === 0}
          hitSlop={theme.spacing[2]}
          onPress={onNext}
          style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}
          testID="next-bead-button"
        >
          <Feather color={theme.rosary.colors.goldBright} name="chevron-down" size={theme.sizes.iconMedium} />
        </Pressable>
        {!compact ? <Text style={styles.instruction}>Next{`\n`}bead</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(8, 31, 47, 0.64)",
    borderColor: "rgba(230, 186, 100, 0.38)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },
  compactContainer: {
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing[0.5],
  },
  instructionRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget,
    width: "100%",
  },
  arrowButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    minWidth: theme.sizes.touchTarget,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  instruction: {
    ...theme.typography.caption,
    color: theme.rosary.colors.scripture,
    fontSize: 9,
    lineHeight: 12,
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
  medalWrap: {
    alignItems: "center",
    marginTop: theme.spacing[1],
  },
  medal: {
    alignItems: "center",
    backgroundColor: "#27445A",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldEmphasis,
    height: theme.spacing[8],
    justifyContent: "center",
    width: theme.spacing[8],
  },
  medalText: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.goldBright,
    fontFamily: theme.fontFamilies.display,
    fontSize: theme.fontSizes.lg,
  },
  additionalBeads: {
    alignItems: "center",
    marginTop: theme.spacing[2],
  },
  smallBead: {
    backgroundColor: theme.rosary.colors.pearlShadow,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.spacing[3],
    width: theme.spacing[3],
  },
  shortChain: {
    backgroundColor: theme.rosary.colors.chain,
    height: theme.spacing[2],
    width: theme.borderWidths.thin,
  },
  crucifix: {
    alignItems: "center",
    height: theme.spacing[8],
    justifyContent: "center",
    marginTop: theme.spacing[1],
    width: theme.spacing[8],
  },
  crossHorizontal: {
    backgroundColor: theme.rosary.colors.gold,
    height: theme.spacing[1],
    position: "absolute",
    width: theme.spacing[6],
  },
  crossVertical: {
    backgroundColor: theme.rosary.colors.gold,
    height: theme.spacing[8],
    position: "absolute",
    width: theme.spacing[1],
  },
  swipeHint: {
    ...theme.typography.caption,
    color: theme.rosary.colors.scripture,
    fontSize: 9,
    lineHeight: 12,
    marginVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
    textAlign: "center",
  },
  compactHint: {
    fontSize: 8,
    lineHeight: 10,
  },
});
