import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

const companyLogoSources = {
  dark: require("../../../assets/svgs/whiteCompanyLogo.svg"),
  light: require("../../../assets/svgs/blackCompanyLogo.svg"),
} as const;

const PROGRESS_FILL_RATIO = 0.35;

/**
 * Displays the full-page branded loading state while account access resolves.
 *
 * @returns A theme-aware company logo with an accessible, reduced-motion-aware progress indicator.
 */
export function AppLoadingScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const { isNarrowPhone } = useResponsiveLayout();
  const reduceMotion = useReducedMotion();
  const travel = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    cancelAnimation(travel);
    travel.value = reduceMotion ? 0.5 : 0;

    if (reduceMotion) return;

    travel.value = withRepeat(withTiming(1, { duration: 1_150 }), -1, true);
    return () => cancelAnimation(travel);
  }, [reduceMotion, travel]);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: travel.value * trackWidth * (1 - PROGRESS_FILL_RATIO) }],
  }));

  /** Keeps the indeterminate fill's travel distance aligned with the responsive track width. */
  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.content} testID="app-loading-content">
        <Image
          accessibilityLabel="Do It for Jesus"
          accessibilityRole="image"
          accessible
          contentFit="contain"
          source={companyLogoSources[colorScheme]}
          style={[styles.logo, isNarrowPhone && styles.logoNarrow]}
        />
        <View
          accessibilityLabel={t("app.loadingAccount")}
          accessibilityRole="progressbar"
          accessibilityValue={{ text: t("app.loadingAccount") }}
          accessible
          onLayout={handleTrackLayout}
          style={styles.progressTrack}
        >
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: {
    alignItems: "center",
    gap: theme.spacing[6],
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    height: 100,
    width: 184,
  },
  logoNarrow: {
    height: 81,
    width: 148,
  },
  progressFill: {
    backgroundColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.pill,
    height: "100%",
    width: `${PROGRESS_FILL_RATIO * 100}%`,
  },
  progressTrack: {
    backgroundColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    height: theme.spacing[1],
    maxWidth: 280,
    minWidth: 176,
    overflow: "hidden",
    width: "68%",
  },
  screen: {
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
}));
