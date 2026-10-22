import { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/theme/tokens";

const DEFAULT_COLORS = ["#F1C46A", "#72C58D", "#70B4DD", "#E18489", "#A99CD3"] as const;
const DEFAULT_DURATION = 2_400;
const PHONE_PARTICLE_COUNT = 56;
const TABLET_PARTICLE_COUNT = 80;
const DESKTOP_PARTICLE_COUNT = 96;
const MAX_PARTICLE_COUNT = 100;

export type ConfettiProps = {
  /** Shows the confetti burst. Set to false to remove it from the screen. */
  active?: boolean;
  colors?: readonly string[];
  /** Base fall duration in milliseconds. Each particle varies slightly for a natural effect. */
  duration?: number;
  particleCount?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Change this value to replay a burst while `active` remains true. */
  trigger?: number | string;
};

type ConfettiParticleProps = {
  color: string;
  duration: number;
  height: number;
  index: number;
  trigger: number | string;
  width: number;
};

/** Coerces a requested particle count into the safe rendering range. */
function boundedInteger(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(1, Math.round(value ?? fallback)), MAX_PARTICLE_COUNT);
}

/** Returns a positive animation value or its stable default. */
function positiveNumber(value: number | undefined, fallback: number) {
  return Number.isFinite(value) && value && value > 0 ? value : fallback;
}

/** Produces deterministic visual variation without changing during rerenders. */
function seededUnit(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43_758.5453;
  return value - Math.floor(value);
}

/** Resolves phone, tablet, or desktop density unless an explicit count is supplied. */
export function getConfettiParticleCount(width: number, requestedCount?: number) {
  const responsiveCount =
    width >= theme.breakpoints.desktop
      ? DESKTOP_PARTICLE_COUNT
      : width >= theme.breakpoints.tablet
        ? TABLET_PARTICLE_COUNT
        : PHONE_PARTICLE_COUNT;
  return boundedInteger(requestedCount, responsiveCount);
}

/**
 * A screen-sized confetti overlay that falls from top to bottom.
 *
 * Render it as the last child of a full-screen container so it layers above
 * the screen content without intercepting touches.
 */
export function Confetti({
  active = true,
  colors = DEFAULT_COLORS,
  duration = DEFAULT_DURATION,
  particleCount,
  style,
  testID,
  trigger = 0,
}: ConfettiProps) {
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const safeParticleCount = getConfettiParticleCount(width, particleCount);
  const safeDuration = positiveNumber(duration, DEFAULT_DURATION);
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;

  if (!active || !width || !height) return null;

  return (
    <View accessible={false} pointerEvents="none" style={[styles.overlay, style]} testID={testID}>
      {reduceMotion
        ? null
        : Array.from({ length: safeParticleCount }, (_, index) => (
            <ConfettiParticle
              color={palette[index % palette.length]}
              duration={safeDuration}
              height={height}
              index={index}
              key={index}
              trigger={trigger}
              width={width}
            />
          ))}
    </View>
  );
}

/** Animates one deterministic particle through a delayed, fluttering viewport fall. */
function ConfettiParticle({ color, duration, height, index, trigger, width }: ConfettiParticleProps) {
  const progress = useSharedValue(0);
  const size = 6 + Math.round(seededUnit(index, 1) * 7);
  const startX = seededUnit(index, 2) * Math.max(width - size, 0);
  const startOffset = 12 + seededUnit(index, 3) * 84;
  const drift = (seededUnit(index, 4) - 0.5) * Math.min(width * 0.42, 180);
  const spin = (seededUnit(index, 5) > 0.5 ? 1 : -1) * (360 + seededUnit(index, 6) * 540);
  const fallDuration = duration * (0.82 + seededUnit(index, 7) * 0.26);
  const startDelay = seededUnit(index, 8) * 360;
  const flutterCycles = 2.5 + seededUnit(index, 9) * 2.5;
  const flutterDistance = 8 + seededUnit(index, 10) * 10;

  useEffect(() => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withSequence(withTiming(0, { duration: startDelay }), withTiming(1, { duration: fallDuration }));

    return () => cancelAnimation(progress);
  }, [fallDuration, progress, startDelay, trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentProgress = progress.value;
    const fadeInProgress = Math.min(1, currentProgress / 0.08);
    const fadeOutProgress = Math.max(0, (currentProgress - 0.88) / 0.12);

    return {
      opacity: fadeInProgress * (1 - fadeOutProgress),
      transform: [
        {
          translateX: drift * currentProgress + Math.sin(currentProgress * Math.PI * flutterCycles) * flutterDistance,
        },
        { translateY: -startOffset + currentProgress * (height + startOffset + size) },
        { rotate: `${spin * currentProgress}deg` },
        { scaleX: Math.cos(currentProgress * Math.PI * 4) },
      ],
    };
  });

  return (
    <Animated.View
      accessible={false}
      style={[
        styles.particle,
        {
          backgroundColor: color,
          borderRadius: index % 3 === 0 ? size / 2 : 1,
          height: index % 4 === 0 ? size * 0.55 : size,
          left: startX,
          top: 0,
          width: size,
        },
        animatedStyle,
      ]}
      testID="confetti-particle"
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    zIndex: 100,
  },
  particle: {
    position: "absolute",
  },
});
