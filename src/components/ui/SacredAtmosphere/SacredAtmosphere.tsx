import { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const MOBILE_PARTICLE_COUNT = 36;
const TABLET_PARTICLE_COUNT = 52;
const DESKTOP_PARTICLE_COUNT = 68;
const REDUCED_MOTION_PARTICLE_COUNT = 7;

export type SacredAtmosphereProps = {
  layer?: "background" | "foregroundDust";
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

type DustParticleProps = {
  height: number;
  index: number;
  reduceMotion: boolean;
  width: number;
};

/**
 * Produces a stable pseudo-random value for a particle property.
 *
 * @param index Particle index within the current layer.
 * @param salt Unique property seed so each visual trait varies independently.
 * @returns A number greater than or equal to zero and less than one.
 */
function seededUnit(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43_758.5453;
  return value - Math.floor(value);
}

/**
 * Selects a calm-but-visible number of particles for the current viewport.
 *
 * @param width Current viewport width.
 * @param reduceMotion Whether non-essential animation should be minimized.
 * @returns The number of dust motes to render.
 */
export function getSacredAtmosphereParticleCount(width: number, reduceMotion: boolean) {
  if (reduceMotion) return REDUCED_MOTION_PARTICLE_COUNT;
  if (width >= theme.breakpoints.desktop) return DESKTOP_PARTICLE_COUNT;
  if (width >= theme.breakpoints.tablet) return TABLET_PARTICLE_COUNT;
  return MOBILE_PARTICLE_COUNT;
}

/**
 * Returns an independent dust travel duration that remains gentle while being
 * visible enough to read as motion over foreground content.
 *
 * @param index Particle index within the current layer.
 * @returns A duration between seven and eighteen seconds.
 */
export function getSacredAtmosphereDustDuration(index: number) {
  return 7_000 + seededUnit(index, 9) * 11_000;
}

/**
 * Renders either the warm background light or the foreground dust layer.
 * It intentionally receives neither touch events nor accessibility focus.
 *
 * @param props Optional layer selection, style, and test identifier for the full-screen visual.
 * @returns A responsive, reduced-motion-aware atmosphere visual.
 */
export function SacredAtmosphere({ layer = "background", style, testID = "sacred-atmosphere" }: SacredAtmosphereProps) {
  const styles = useThemedStyles(styleSheet);
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const particleCount = getSacredAtmosphereParticleCount(width, reduceMotion);

  if (!width || !height) return null;

  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={[styles.container, layer === "foregroundDust" && styles.foregroundContainer, style]}
      testID={testID}
    >
      {layer === "background" ? <SunlightAndHaze height={height} reduceMotion={reduceMotion} /> : null}
      {layer === "foregroundDust" ? (
        <View pointerEvents="none" style={styles.dustLayer}>
          {Array.from({ length: particleCount }, (_, index) => (
            <DustParticle height={height} index={index} key={index} reduceMotion={reduceMotion} width={width} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Renders the slowly breathing sunlight and distant haze depth layer.
 *
 * @param props Viewport height and the system reduced-motion setting.
 * @returns Decorative light and haze elements that do not receive input.
 */
function SunlightAndHaze({ height, reduceMotion }: { height: number; reduceMotion: boolean }) {
  const styles = useThemedStyles(styleSheet);
  const { theme: appTheme } = useAppTheme();
  const glow = useSharedValue(0);
  const haze = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(glow);
    cancelAnimation(haze);

    if (reduceMotion) {
      glow.value = 0;
      haze.value = 0;
      return;
    }

    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 14_000 }), withTiming(0, { duration: 17_000 })),
      -1,
      false,
    );
    haze.value = withRepeat(
      withSequence(withTiming(1, { duration: 36_000 }), withTiming(0, { duration: 47_000 })),
      -1,
      false,
    );

    return () => {
      cancelAnimation(glow);
      cancelAnimation(haze);
    };
  }, [glow, haze, reduceMotion]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.76 + glow.value * 0.24,
    transform: [{ translateX: glow.value * 14 }, { translateY: glow.value * 6 }],
  }));
  const beamOneStyle = useAnimatedStyle(() => ({
    opacity: 0.48 + glow.value * 0.18,
    transform: [{ translateX: glow.value * 20 }, { rotate: "-13deg" }],
  }));
  const beamTwoStyle = useAnimatedStyle(() => ({
    opacity: 0.28 + glow.value * 0.14,
    transform: [{ translateX: -glow.value * 13 }, { rotate: "-21deg" }],
  }));
  const hazeStyle = useAnimatedStyle(() => ({
    opacity: 0.7 + haze.value * 0.3,
    transform: [{ translateX: -32 + haze.value * 64 }],
  }));

  return (
    <View pointerEvents="none" style={styles.lightLayer}>
      <Animated.View style={[styles.sunGlowOuter, glowStyle]} testID="sacred-atmosphere-sunlight" />
      <Animated.View style={[styles.sunGlowMiddle, glowStyle]} />
      <Animated.View style={[styles.sunGlowInner, glowStyle]} />
      <Animated.View style={[styles.sunBeam, styles.sunBeamOne, { height: height * 1.25 }, beamOneStyle]}>
        <LinearGradient
          colors={[
            appTheme.colors.atmosphere.beamEdge,
            appTheme.colors.atmosphere.beamPrimary,
            appTheme.colors.atmosphere.beamEdge,
          ]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.sunBeam, styles.sunBeamTwo, { height: height * 1.18 }, beamTwoStyle]}>
        <LinearGradient
          colors={[
            appTheme.colors.atmosphere.beamEdge,
            appTheme.colors.atmosphere.beamSecondary,
            appTheme.colors.atmosphere.beamEdge,
          ]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.haze, hazeStyle]} testID="sacred-atmosphere-haze" />
    </View>
  );
}

/**
 * Renders one deterministic dust mote with an independent drift and fade.
 *
 * @param props Viewport measurements, particle index, and motion preference.
 * @returns A non-accessible animated particle.
 */
function DustParticle({ height, index, reduceMotion, width }: DustParticleProps) {
  const styles = useThemedStyles(styleSheet);
  const { theme: appTheme } = useAppTheme();
  const initialProgress = seededUnit(index, 1);
  const travel = useSharedValue(initialProgress);
  const depth = seededUnit(index, 2);
  const isForegroundParticle = index % 11 === 0;
  const size = 2.2 + depth * 4.7 + (isForegroundParticle ? 3.6 : 0);
  const startX = seededUnit(index, 3) * width;
  const startY = seededUnit(index, 4) * height;
  const horizontalDrift = (seededUnit(index, 5) - 0.5) * (38 + depth * 76);
  const verticalDrift = (seededUnit(index, 6) - 0.5) * (30 + depth * 58);
  const sway = 5 + seededUnit(index, 7) * 13;
  const phase = seededUnit(index, 8) * Math.PI * 2;
  const duration = getSacredAtmosphereDustDuration(index);
  const inSunlight = startX < width * 0.7 && startY < height * 0.78;
  const baseOpacity = (0.035 + depth * 0.065) * (inSunlight ? 1.48 : 0.92) * (isForegroundParticle ? 1.16 : 1);

  useEffect(() => {
    cancelAnimation(travel);
    if (reduceMotion) {
      travel.value = initialProgress;
      return;
    }

    travel.value = withRepeat(withTiming(1, { duration }), -1, false);
    return () => cancelAnimation(travel);
  }, [duration, initialProgress, reduceMotion, travel]);

  const animatedStyle = useAnimatedStyle(() => {
    const progress = travel.value;
    const fade = Math.sin(progress * Math.PI);
    const horizontalSway = Math.sin(progress * Math.PI * 2.2 + phase) * sway;
    const verticalSway = Math.cos(progress * Math.PI * 1.7 + phase) * (sway * 0.55);

    return {
      opacity: baseOpacity * (reduceMotion ? 0.68 : fade),
      transform: [
        { translateX: horizontalDrift * progress + horizontalSway },
        { translateY: verticalDrift * progress + verticalSway },
      ],
    };
  });

  return (
    <Animated.View
      accessible={false}
      style={[
        styles.dustParticle,
        {
          backgroundColor: inSunlight ? appTheme.colors.atmosphere.dustWarm : appTheme.colors.atmosphere.dustCool,
          borderRadius: size / 2,
          height: size,
          left: startX,
          top: startY,
          width: size,
        },
        animatedStyle,
      ]}
      testID="sacred-atmosphere-dust"
    />
  );
}

const styleSheet = createThemedStyles((theme) => ({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    zIndex: theme.zIndex.base,
  },
  foregroundContainer: {
    zIndex: theme.zIndex.sticky,
  },
  dustLayer: {
    ...StyleSheet.absoluteFill,
  },
  dustParticle: {
    position: "absolute",
  },
  haze: {
    backgroundColor: theme.colors.atmosphere.haze,
    borderRadius: theme.radii.pill,
    height: 220,
    left: "-24%",
    position: "absolute",
    top: 130,
    width: "148%",
  },
  lightLayer: {
    ...StyleSheet.absoluteFill,
  },
  sunBeam: {
    overflow: "hidden",
    position: "absolute",
    top: -150,
    width: 150,
  },
  sunBeamOne: {
    left: "9%",
  },
  sunBeamTwo: {
    left: "37%",
    width: 110,
  },
  sunGlowInner: {
    backgroundColor: theme.colors.atmosphere.sunInner,
    borderRadius: theme.radii.pill,
    height: 350,
    left: -90,
    position: "absolute",
    top: -210,
    width: 510,
  },
  sunGlowMiddle: {
    backgroundColor: theme.colors.atmosphere.sunMiddle,
    borderRadius: theme.radii.pill,
    height: 520,
    left: -180,
    position: "absolute",
    top: -310,
    width: 720,
  },
  sunGlowOuter: {
    backgroundColor: theme.colors.atmosphere.sunOuter,
    borderRadius: theme.radii.pill,
    height: 760,
    left: -290,
    position: "absolute",
    top: -480,
    width: 980,
  },
}));
