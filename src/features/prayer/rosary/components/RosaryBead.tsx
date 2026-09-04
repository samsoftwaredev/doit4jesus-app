import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { BeadState, RosaryBead as RosaryBeadModel } from "@/features/prayer/rosary/types";

interface RosaryBeadProps {
  bead: RosaryBeadModel;
  state: BeadState;
  compact?: boolean;
  displayNumber?: number;
  disabled?: boolean;
  onPress: (beadId: string) => void;
}

const prayerNameByBeadType: Record<RosaryBeadModel["type"], string> = {
  creed: "Apostles' Creed",
  fatimaPrayer: "Fatima Prayer",
  gloryBe: "Glory Be",
  hailHolyQueen: "Hail, Holy Queen",
  hailMary: "Hail Mary",
  ourFather: "Our Father",
  signOfCross: "Sign of the Cross",
};

/** Returns a visually distinct bead diameter while preserving the separate minimum touch target. */
function beadDiameter(type: RosaryBeadModel["type"], compact: boolean) {
  if (type === "ourFather") return compact ? 32 : 38;
  if (type === "hailMary") return compact ? 18 : 22;
  return compact ? 22 : 28;
}

/**
 * Renders one selectable Rosary marker with prayer-specific sizing and current-position state.
 * The Apostles' Creed uses a crucifix marker, while physical beads use their Rosary bead number.
 */
export function RosaryBead({
  bead,
  state,
  compact = false,
  displayNumber,
  disabled = false,
  onPress,
}: RosaryBeadProps) {
  const styles = useThemedStyles(styleSheet);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const beadSize = beadDiameter(bead.type, compact);
  const isActive = state === "active";
  const isCrucifix = bead.type === "creed";
  const visibleNumber = displayNumber ?? bead.sequence;

  useEffect(() => {
    cancelAnimation(scale);
    if (isActive && !reduceMotion) {
      scale.value = withRepeat(
        withSequence(withTiming(theme.rosary.glow.activeScale, { duration: 840 }), withTiming(1, { duration: 840 })),
        -1,
        false,
      );
    } else {
      scale.value = withTiming(1, { duration: reduceMotion ? 0 : 180 });
    }
    opacity.value = withTiming(state === "upcoming" ? 0.62 : 1, {
      duration: reduceMotion ? 0 : 180,
    });
  }, [isActive, opacity, reduceMotion, scale, state]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const stateLabel = state === "active" ? "current" : state;
  const markerLabel = isCrucifix
    ? `${stateLabel} crucifix, ${prayerNameByBeadType[bead.type]}`
    : `${stateLabel} bead ${visibleNumber}, ${prayerNameByBeadType[bead.type]}`;

  return (
    <Pressable
      accessibilityHint={`Double tap to move directly to this ${isCrucifix ? "crucifix" : "bead"}.`}
      accessibilityLabel={markerLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isActive }}
      disabled={disabled}
      hitSlop={theme.spacing[2]}
      onPress={() => onPress(bead.id)}
      style={({ pressed }) => [styles.touchTarget, pressed && !disabled && styles.pressed]}
      testID={`${isCrucifix ? "rosary-crucifix" : "rosary-bead"}-${bead.sequence}`}
    >
      {isCrucifix ? (
        <Animated.View
          style={[
            styles.crucifix,
            isActive && styles.activeCrucifix,
            isActive && theme.rosary.shadows.activeBead,
            animatedStyle,
          ]}
          testID={`rosary-crucifix-shape-${bead.sequence}`}
        >
          <View
            style={[
              styles.crossHorizontal,
              { backgroundColor: isActive ? theme.rosary.colors.goldBright : theme.rosary.colors.gold },
            ]}
          />
          <View
            style={[
              styles.crossVertical,
              { backgroundColor: isActive ? theme.rosary.colors.goldBright : theme.rosary.colors.gold },
            ]}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.bead,
            {
              borderColor: isActive ? theme.rosary.colors.goldBright : theme.rosary.colors.gold,
              height: beadSize,
              width: beadSize,
            },
            state === "completed" && styles.completedBead,
            isActive && styles.activeBead,
            isActive && theme.rosary.shadows.activeBead,
            animatedStyle,
          ]}
          testID={`rosary-bead-shape-${bead.sequence}`}
        >
          {isActive ? <View style={styles.activeCore} /> : null}
        </Animated.View>
      )}
      {!isCrucifix ? (
        <Text accessible={false} style={[styles.sequence, compact && styles.compactSequence]}>
          {visibleNumber}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  touchTarget: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    minWidth: theme.sizes.touchTarget,
    position: "relative",
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  bead: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.pearl,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    justifyContent: "center",
  },
  completedBead: {
    backgroundColor: "#E9ECE9",
  },
  activeBead: {
    backgroundColor: "#FFF9EA",
    borderWidth: theme.rosary.borderWidths.goldEmphasis,
  },
  activeCore: {
    backgroundColor: theme.rosary.colors.goldBright,
    borderRadius: theme.radii.pill,
    height: theme.spacing[1.5],
    width: theme.spacing[1.5],
  },
  crucifix: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: theme.radii.md,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.spacing[10],
    justifyContent: "center",
    width: theme.spacing[10],
  },
  activeCrucifix: {
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: theme.rosary.colors.goldBright,
  },
  crossHorizontal: {
    height: theme.spacing[1],
    position: "absolute",
    width: theme.spacing[7],
  },
  crossVertical: {
    height: theme.spacing[9],
    position: "absolute",
    width: theme.spacing[1],
  },
  sequence: {
    ...theme.typography.caption,
    color: theme.rosary.colors.goldBright,
    fontSize: 9,
    position: "absolute",
    right: -theme.spacing[3],
  },
  compactSequence: {
    fontSize: 8,
    right: -theme.spacing[2.5],
  },
}));
