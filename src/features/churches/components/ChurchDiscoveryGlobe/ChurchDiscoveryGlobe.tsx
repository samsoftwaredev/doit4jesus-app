import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
import { Easing, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export const CHURCH_GLOBE_ROTATION_DURATION_MS = 8_000;

/** Displays a responsive rotating Earth while discovery is waiting for a submitted ZIP search. */
export function ChurchDiscoveryGlobe() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(0);
  const globeSize = Math.max(96, Math.min(144, width * 0.26));

  useEffect(() => {
    cancelAnimation(rotation);
    rotation.value = 0;
    if (reduceMotion) return;
    rotation.value = withRepeat(
      withTiming(360, { duration: CHURCH_GLOBE_ROTATION_DURATION_MS, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, [reduceMotion, rotation]);

  const globeStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View accessibilityLabel={t("churches.search.globeLabel")} style={styles.background}>
      <View style={styles.glow} />
      <Animated.View style={globeStyle}>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.accent.amberLight}
          name="earth"
          size={globeSize}
        />
      </Animated.View>
      <Text style={styles.prompt}>{t("churches.search.globePrompt")}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  background: {
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    gap: theme.spacing[4],
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
    padding: theme.spacing[6],
    position: "relative",
    width: "100%",
  },
  glow: {
    backgroundColor: theme.colors.surface.green,
    borderRadius: theme.radii.pill,
    height: 260,
    opacity: 0.4,
    position: "absolute",
    width: 260,
  },
  prompt: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    maxWidth: 360,
    textAlign: "center",
  },
}));
