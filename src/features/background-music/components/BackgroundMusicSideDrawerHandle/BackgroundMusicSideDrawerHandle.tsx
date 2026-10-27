import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { useBackgroundMusic } from "../BackgroundMusicProvider";

const DRAWER_WIDTH = 250;
const DRAWER_HEIGHT = 100;
const HANDLE_WIDTH = 44;
const DRAWER_DURATION_MS = 250;
const MARQUEE_GAP = 24;
const MARQUEE_SPEED = 35;

/** Renders the persistent right-edge music drawer and suppresses it while the Rosary video is active. */
export function BackgroundMusicSideDrawerHandle() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const { currentTrack, isLoading, isPlaying, pausePlayback, playNext, togglePlayback } = useBackgroundMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  const [titleMaskWidth, setTitleMaskWidth] = useState(0);
  const [titleWidth, setTitleWidth] = useState(0);
  const drawerWidth = Math.min(DRAWER_WIDTH, width);
  const panelWidth = drawerWidth - HANDLE_WIDTH;
  const hiddenOffset = panelWidth;
  const translateX = useSharedValue(hiddenOffset);
  const marqueeTranslateX = useSharedValue(0);
  const isRosaryVideo = pathname === "/rosary-video";
  const localizedTitle = currentTrack.title[language];
  const shouldMarquee = !reduceMotion && titleMaskWidth > 0 && titleWidth > titleMaskWidth;
  const minimumTop = insets.top + theme.spacing[2];
  const maximumTop = Math.max(minimumTop, height - insets.bottom - DRAWER_HEIGHT - theme.spacing[2]);
  const drawerTop = Math.min(Math.max((height - DRAWER_HEIGHT) / 2, minimumTop), maximumTop);

  useEffect(() => {
    translateX.value = withTiming(isExpanded ? 0 : hiddenOffset, {
      duration: reduceMotion ? 0 : DRAWER_DURATION_MS,
    });
  }, [hiddenOffset, isExpanded, reduceMotion, translateX]);

  useEffect(() => {
    cancelAnimation(marqueeTranslateX);
    marqueeTranslateX.value = 0;
    if (!shouldMarquee) return;

    const distance = titleWidth + MARQUEE_GAP;
    marqueeTranslateX.value = withRepeat(
      withTiming(-distance, { duration: Math.round((distance / MARQUEE_SPEED) * 1000) }),
      -1,
      false,
    );
  }, [localizedTitle, marqueeTranslateX, shouldMarquee, titleWidth]);

  useEffect(() => {
    if (isRosaryVideo) pausePlayback();
  }, [isRosaryVideo, pausePlayback]);

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const marqueeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: marqueeTranslateX.value }],
  }));

  /** Toggles the drawer without changing playback state. */
  const handleDrawerToggle = useCallback(() => {
    setIsExpanded((expanded) => !expanded);
  }, []);

  /** Collapses the drawer after an outside tap without changing playback. */
  const handleOutsidePress = useCallback(() => {
    setIsExpanded(false);
  }, []);

  /** Records the visible title viewport used to decide whether marquee motion is necessary. */
  const handleTitleMaskLayout = useCallback((event: LayoutChangeEvent) => {
    setTitleMaskWidth(event.nativeEvent.layout.width);
  }, []);

  /** Records the untruncated title width used to calculate seamless marquee distance and duration. */
  const handleTitleLayout = useCallback((event: LayoutChangeEvent) => {
    setTitleWidth(event.nativeEvent.layout.width);
  }, []);

  if (isRosaryVideo) return null;

  return (
    <View pointerEvents="box-none" style={styles.host}>
      {isExpanded ? (
        <Pressable
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          onPress={handleOutsidePress}
          style={styles.dismissBackdrop}
          testID="background-music-dismiss-backdrop"
        />
      ) : null}

      <Animated.View
        pointerEvents="box-none"
        style={[styles.drawer, { top: drawerTop, width: drawerWidth }, drawerAnimatedStyle]}
        testID="background-music-drawer"
      >
        <Pressable
          accessibilityLabel={t(isExpanded ? "backgroundMusic.close" : "backgroundMusic.open")}
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          onPress={handleDrawerToggle}
          style={({ pressed }) => [styles.handle, pressed && styles.pressed]}
        >
          <Feather
            accessible={false}
            color={theme.rosary.colors.immersiveGold}
            name="music"
            size={22}
            testID="background-music-handle-icon"
          />
        </Pressable>

        {isExpanded ? (
          <View style={[styles.panel, { width: panelWidth }]} testID="background-music-panel">
            <View style={styles.trackRow}>
              <Image
                accessible={false}
                contentFit="cover"
                source={currentTrack.artwork}
                style={styles.artwork}
                testID="background-music-artwork"
                transition={reduceMotion ? 0 : 160}
              />
              <View style={styles.trackDetails}>
                <View
                  accessible
                  accessibilityLabel={localizedTitle}
                  onLayout={handleTitleMaskLayout}
                  style={styles.titleMask}
                  testID="background-music-title-mask"
                >
                  <Text
                    accessible={false}
                    onLayout={handleTitleLayout}
                    numberOfLines={1}
                    style={[styles.title, styles.titleMeasure]}
                    testID="background-music-title-measure"
                  >
                    {localizedTitle}
                  </Text>
                  {shouldMarquee ? (
                    <Animated.View accessible={false} style={[styles.marqueeTrack, marqueeAnimatedStyle]}>
                      <Text numberOfLines={1} style={styles.title} testID="background-music-marquee-copy-1">
                        {localizedTitle}
                      </Text>
                      <View style={styles.marqueeGap} />
                      <Text numberOfLines={1} style={styles.title} testID="background-music-marquee-copy-2">
                        {localizedTitle}
                      </Text>
                    </Animated.View>
                  ) : (
                    <Text accessible={false} numberOfLines={1} style={styles.title}>
                      {localizedTitle}
                    </Text>
                  )}
                </View>

                <View style={styles.controls}>
                  <IconButton
                    accessibilityLabel={t(isPlaying ? "backgroundMusic.pause" : "backgroundMusic.play")}
                    loading={isLoading}
                    onPress={togglePlayback}
                    style={styles.controlButton}
                  >
                    <Feather
                      accessible={false}
                      color={theme.rosary.colors.immersiveGold}
                      name={isPlaying ? "pause" : "play"}
                      size={theme.sizes.iconMedium}
                    />
                  </IconButton>
                  <IconButton
                    accessibilityLabel={t("backgroundMusic.next")}
                    disabled={isLoading}
                    onPress={playNext}
                    style={styles.controlButton}
                  >
                    <Feather
                      accessible={false}
                      color={theme.rosary.colors.immersiveGold}
                      name="skip-forward"
                      size={theme.sizes.iconMedium}
                    />
                  </IconButton>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  dismissBackdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  drawer: {
    flexDirection: "row",
    height: DRAWER_HEIGHT,
    position: "absolute",
    right: 0,
    zIndex: theme.zIndex.drawer,
    ...theme.shadows.medium,
  },
  host: {
    bottom: 0,
    left: 0,
    pointerEvents: "box-none",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: theme.zIndex.drawer,
  },
  handle: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.rosary.colors.gold,
    borderBottomLeftRadius: theme.radii.lg,
    borderTopLeftRadius: theme.radii.lg,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: HANDLE_WIDTH,
  },
  panel: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.gold,
    borderBottomLeftRadius: theme.radii.xl,
    borderTopLeftRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.gold,
    height: DRAWER_HEIGHT,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: theme.spacing[2.5],
    paddingVertical: theme.spacing[2],
  },
  trackRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
    height: "100%",
    minWidth: 0,
    width: "100%",
  },
  artwork: {
    aspectRatio: 1,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.md,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    maxWidth: 50,
    width: 50,
  },
  trackDetails: {
    flex: 1,
    gap: theme.spacing[1],
    justifyContent: "center",
    minWidth: 0,
  },
  titleMask: {
    justifyContent: "center",
    height: theme.lineHeights.sm,
    minWidth: 0,
    overflow: "hidden",
  },
  title: {
    color: theme.rosary.colors.immersiveGold,
    fontFamily: theme.fontFamilies.devotional,
    fontSize: theme.fontSizes.sm,
    lineHeight: theme.lineHeights.sm,
    whiteSpace: "nowrap",
  },
  titleMeasure: {
    opacity: 0,
    position: "absolute",
  },
  marqueeTrack: {
    alignItems: "center",
    flexDirection: "row",
    width: "auto",
  },
  marqueeGap: {
    width: MARQUEE_GAP,
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "flex-start",
  },
  controlButton: {
    backgroundColor: theme.rosary.colors.card,
    borderColor: theme.rosary.colors.gold,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
}));
