import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/theme/tokens";
import type { BeadState, RosaryBead } from "@/features/prayer/rosary/types";

interface RosaryBeadProps {
  bead: RosaryBead;
  state: BeadState;
  compact?: boolean;
  disabled?: boolean;
  onPress: (beadId: string) => void;
}

export function RosaryBead({ bead, state, compact = false, disabled = false, onPress }: RosaryBeadProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const beadSize = compact ? 24 : 30;
  const isActive = state === "active";

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

  return (
    <Pressable
      accessibilityHint="Double tap to move directly to this bead."
      accessibilityLabel={`${stateLabel} bead ${bead.sequence}, ${bead.type === "hailMary" ? "Hail Mary" : bead.type}`}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isActive }}
      disabled={disabled}
      hitSlop={theme.spacing[2]}
      onPress={() => onPress(bead.id)}
      style={({ pressed }) => [styles.touchTarget, pressed && !disabled && styles.pressed]}
      testID={`rosary-bead-${bead.sequence}`}
    >
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
      >
        {isActive ? <View style={styles.activeCore} /> : null}
      </Animated.View>
      <Text accessible={false} style={[styles.sequence, compact && styles.compactSequence]}>
        {bead.sequence}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
