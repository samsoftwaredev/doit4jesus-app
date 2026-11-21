import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { CELEBRATION_COLORS, seeded } from "./celebrationTheme";

/** Dims the whole field so the stars sit softly behind the content. */
const STAR_OPACITY = 0.5;

type StarSpec = { delay: number; id: number; left: number; size: number; top: number };

function Star({ animated, spec }: { animated: boolean; spec: StarSpec }) {
  const twinkle = useSharedValue(animated ? 0.15 : 0.85);

  useEffect(() => {
    if (!animated) return;
    twinkle.value = withDelay(
      spec.delay,
      withRepeat(withSequence(withTiming(1, { duration: 900 }), withTiming(0.15, { duration: 1100 })), -1, false),
    );
  }, [animated, spec.delay, twinkle]);

  const style = useAnimatedStyle(() => ({
    opacity: twinkle.value * STAR_OPACITY,
    transform: [{ scale: 0.6 + twinkle.value * 0.6 }],
  }));

  return (
    <Animated.Text style={[styles.star, { fontSize: spec.size, left: `${spec.left}%`, top: `${spec.top}%` }, style]}>
      ✦
    </Animated.Text>
  );
}

/** Scatters twinkling gold stars across its container; static when `animated` is false or motion is reduced. */
export function StarField({
  animated = true,
  count = 30,
  seed = 7,
}: {
  animated?: boolean;
  count?: number;
  seed?: number;
}) {
  const reduceMotion = useReducedMotion();
  const stars = useMemo<StarSpec[]>(() => {
    const random = seeded(seed);
    return Array.from({ length: count }, (_, id) => ({
      delay: Math.round(random() * 2200),
      id,
      left: Math.round(random() * 96),
      size: 8 + Math.round(random() * random() * 22),
      top: Math.round(random() * 96),
    }));
  }, [count, seed]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      {stars.map((spec) => (
        <Star animated={animated && !reduceMotion} key={spec.id} spec={spec} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: { color: CELEBRATION_COLORS.goldBright, position: "absolute" },
});
