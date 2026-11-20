import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const SPARKS_PER_BURST = 10;
const BURST_COLORS = ["#FFE09A", "#FFFFFF", "#F4B860", "#FFD1DC", "#BDE3FF"];
/** Burst centres as fractions of the fireworks area (left %, top %), staggered so the show never goes quiet. */
const BURSTS = [
  { delay: 0, left: 12, radius: 46, top: 18 },
  { delay: 650, left: 86, radius: 52, top: 30 },
  { delay: 1300, left: 50, radius: 40, top: 4 },
  { delay: 1900, left: 6, radius: 38, top: 70 },
  { delay: 2400, left: 94, radius: 44, top: 76 },
] as const;
const STARS = [
  { delay: 0, left: 22, size: 16, top: 8 },
  { delay: 400, left: 78, size: 20, top: 14 },
  { delay: 800, left: 4, size: 14, top: 44 },
  { delay: 1200, left: 95, size: 14, top: 52 },
  { delay: 600, left: 30, size: 12, top: 92 },
  { delay: 1000, left: 70, size: 18, top: 90 },
  { delay: 1400, left: 50, size: 14, top: 0 },
] as const;

/** One spark that flies outward from its burst centre, then fades; repeats forever. */
function Spark({ angle, color, delay, radius }: { angle: number; color: string; delay: number; radius: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }), -1, false),
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value < 0.15 ? progress.value / 0.15 : 1 - (progress.value - 0.15) / 0.85,
    transform: [
      { translateX: Math.cos(angle) * radius * progress.value },
      { translateY: Math.sin(angle) * radius * progress.value + 14 * progress.value * progress.value },
      { scale: 1 - progress.value * 0.5 },
    ],
  }));

  return <Animated.View style={[styles.spark, { backgroundColor: color }, style]} />;
}

/** A star that twinkles in and out. */
function TwinklingStar({ delay, size }: { delay: number; size: number }) {
  const twinkle = useSharedValue(0.2);

  useEffect(() => {
    twinkle.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0.2, { duration: 900 })), -1, false),
    );
  }, [delay, twinkle]);

  const style = useAnimatedStyle(() => ({
    opacity: twinkle.value,
    transform: [{ scale: 0.7 + twinkle.value * 0.5 }],
  }));

  return <Animated.Text style={[styles.star, { fontSize: size }, style]}>✦</Animated.Text>;
}

/**
 * Decorative fireworks and twinkling stars drawn around its container (position it absolutely behind or around
 * a highlighted value). Reduced motion keeps only static stars.
 */
export function CelebrationFireworks({ testID }: { testID?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      testID={testID}
    >
      {STARS.map((star, index) =>
        reduceMotion ? (
          <Text
            key={`star-${index}`}
            style={[styles.star, styles.pos, { fontSize: star.size, left: `${star.left}%`, top: `${star.top}%` }]}
          >
            ✦
          </Text>
        ) : (
          <View key={`star-${index}`} style={[styles.pos, { left: `${star.left}%`, top: `${star.top}%` }]}>
            <TwinklingStar delay={star.delay} size={star.size} />
          </View>
        ),
      )}
      {reduceMotion
        ? null
        : BURSTS.map((burst, burstIndex) => (
            <View key={`burst-${burstIndex}`} style={[styles.pos, { left: `${burst.left}%`, top: `${burst.top}%` }]}>
              {Array.from({ length: SPARKS_PER_BURST }, (_, sparkIndex) => (
                <Spark
                  angle={(sparkIndex / SPARKS_PER_BURST) * Math.PI * 2 + burstIndex}
                  color={BURST_COLORS[(sparkIndex + burstIndex) % BURST_COLORS.length]}
                  delay={burst.delay}
                  key={sparkIndex}
                  radius={burst.radius}
                />
              ))}
            </View>
          ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pos: { position: "absolute" },
  spark: { borderRadius: 3, height: 5, position: "absolute", width: 5 },
  star: { color: "#FFE09A" },
});
