import { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DEFAULT_COLORS = ["#F1C46A", "#72C58D", "#70B4DD", "#E18489", "#A99CD3"] as const;
const DEFAULT_DURATION = 2_400;
const DEFAULT_PARTICLE_COUNT = 42;
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

function boundedInteger(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(1, Math.round(value ?? fallback)), MAX_PARTICLE_COUNT);
}

function positiveNumber(value: number | undefined, fallback: number) {
  return Number.isFinite(value) && value && value > 0 ? value : fallback;
}

function seededUnit(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43_758.5453;
  return value - Math.floor(value);
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
  particleCount = DEFAULT_PARTICLE_COUNT,
  style,
  testID,
  trigger = 0,
}: ConfettiProps) {
  const { height, width } = useWindowDimensions();
  const safeParticleCount = boundedInteger(particleCount, DEFAULT_PARTICLE_COUNT);
  const safeDuration = positiveNumber(duration, DEFAULT_DURATION);
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;

  if (!active || !width || !height) return null;

  return (
    <View accessible={false} pointerEvents="none" style={[styles.overlay, style]} testID={testID}>
      {Array.from({ length: safeParticleCount }, (_, index) => (
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

function ConfettiParticle({ color, duration, height, index, trigger, width }: ConfettiParticleProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const size = 6 + Math.round(seededUnit(index, 1) * 7);
  const startX = seededUnit(index, 2) * Math.max(width - size, 0);
  const startOffset = 8 + seededUnit(index, 3) * 72;
  const drift = (seededUnit(index, 4) - 0.5) * Math.min(width * 0.42, 180);
  const spin = (seededUnit(index, 5) > 0.5 ? 1 : -1) * (360 + seededUnit(index, 6) * 540);
  const fallDuration = duration * (0.72 + seededUnit(index, 7) * 0.56);

  useEffect(() => {
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(1, { duration: reduceMotion ? 0 : fallDuration });

    return () => cancelAnimation(progress);
  }, [fallDuration, progress, reduceMotion, trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentProgress = progress.value;
    const fadeOutProgress = Math.max(0, (currentProgress - 0.86) / 0.14);

    return {
      opacity: 1 - fadeOutProgress,
      transform: [
        { translateX: drift * currentProgress + Math.sin(currentProgress * Math.PI * 3) * 10 },
        { translateY: -startOffset + currentProgress * (height + startOffset + size) },
        { rotate: `${spin * currentProgress}deg` },
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
