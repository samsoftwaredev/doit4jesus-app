import { Image } from "expo-image";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { textShadow } from "@/theme/boxShadow";

import { CELEBRATION_COLORS } from "./celebrationTheme";

export const CELEBRATION_LOGO = require("../../../../../../assets/images/icon.png") as number;

const BEAD_COUNT = 54;

export interface StreakEmblemProps {
  animated?: boolean;
  caption: string;
  size: number;
  streak: string;
}

/**
 * A golden rosary ring with the DoIt4Jesus logo hanging from it as the pendant and the streak number glowing
 * inside. The ring's beads slowly turn and the number pops in when `animated`.
 */
export function StreakEmblem({ animated = true, caption, size, streak }: StreakEmblemProps) {
  const reduceMotion = useReducedMotion();
  const motion = animated && !reduceMotion;
  const spin = useSharedValue(0);
  const pop = useSharedValue(motion ? 0.4 : 1);
  const glow = useSharedValue(0.5);
  const radius = size * 0.42;
  const center = size / 2;

  useEffect(() => {
    if (!motion) return;
    spin.value = withRepeat(withTiming(360, { duration: 70000, easing: Easing.linear }), -1, false);
    pop.value = withSpring(1, { damping: 7, stiffness: 110 });
    glow.value = withDelay(
      400,
      withRepeat(withSequence(withTiming(1, { duration: 1400 }), withTiming(0.45, { duration: 1400 })), -1, false),
    );
  }, [glow, motion, pop, spin]);

  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const numberStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: motion ? glow.value : 0.7 }));

  const beads = useMemo(
    () =>
      Array.from({ length: BEAD_COUNT }, (_, index) => {
        const angle = (index / BEAD_COUNT) * Math.PI * 2 - Math.PI / 2;
        const large = index % 9 === 0;
        const diameter = size * (large ? 0.04 : 0.026);
        return {
          diameter,
          id: index,
          left: center + Math.cos(angle) * radius - diameter / 2,
          top: center + Math.sin(angle) * radius - diameter / 2,
        };
      }),
    [center, radius, size],
  );
  const logoSize = size * 0.2;

  return (
    <View style={{ height: size + logoSize * 0.5, width: size }}>
      <Animated.View
        style={[
          styles.glow,
          { borderRadius: size, height: size * 0.84, left: size * 0.08, top: size * 0.08, width: size * 0.84 },
          glowStyle,
        ]}
      />
      <Animated.View style={[{ height: size, position: "absolute", width: size }, spinStyle]}>
        {beads.map((bead) => (
          <View
            key={bead.id}
            style={[
              styles.bead,
              {
                borderRadius: bead.diameter,
                height: bead.diameter,
                left: bead.left,
                top: bead.top,
                width: bead.diameter,
              },
            ]}
          />
        ))}
      </Animated.View>

      <View style={[styles.center, { height: size, width: size }]}>
        <Animated.View style={[styles.centerContent, numberStyle]}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.number, { fontSize: size * 0.4, lineHeight: size * 0.46 }]}
          >
            {streak}
          </Text>
          <Text style={[styles.caption, { fontSize: size * 0.07, letterSpacing: size * 0.012 }]}>{caption}</Text>
        </Animated.View>
      </View>

      <View
        style={[
          styles.pendant,
          {
            borderRadius: logoSize,
            height: logoSize,
            left: center - logoSize / 2,
            top: center + radius - logoSize * 0.2,
            width: logoSize,
          },
        ]}
      >
        <Image
          accessibilityLabel="DoIt4Jesus"
          contentFit="cover"
          source={CELEBRATION_LOGO}
          style={styles.pendantImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bead: { backgroundColor: CELEBRATION_COLORS.gold, position: "absolute" },
  caption: { color: CELEBRATION_COLORS.goldBright, fontWeight: "700", marginTop: 2 },
  center: { alignItems: "center", justifyContent: "center", position: "absolute" },
  centerContent: { alignItems: "center", justifyContent: "center", maxWidth: "70%" },
  glow: {
    backgroundColor: "rgba(255, 224, 154, 0.16)",
    boxShadow: "0px 0px 80px 20px rgba(255, 224, 154, 0.35)",
    position: "absolute",
  },
  number: {
    color: CELEBRATION_COLORS.text,
    fontWeight: "800",
    textAlign: "center",
    ...textShadow("rgba(255, 224, 154, 0.9)", 0, 24),
  },
  pendant: {
    borderColor: CELEBRATION_COLORS.goldBright,
    borderWidth: 2,
    overflow: "hidden",
    position: "absolute",
  },
  pendantImage: { height: "100%", width: "100%" },
});
