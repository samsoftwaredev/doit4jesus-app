import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { useCallback, useRef, useState } from "react";
import { FlatList, type ListRenderItemInfo, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { SacredAtmosphere } from "@/components/ui";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type LandingSlide = {
  descriptionKey?: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  id: "mission" | "difference" | "competition" | "sainthood";
  labelKey?: string;
  titleKey: string;
};

const slides: readonly LandingSlide[] = [
  {
    id: "mission",
    icon: "shield-cross",
    labelKey: "landing.brand",
    titleKey: "landing.missionTitle",
    descriptionKey: "landing.missionDescription",
  },
  {
    id: "difference",
    icon: "sword-cross",
    titleKey: "landing.differenceTitle",
  },
  {
    id: "competition",
    icon: "account-group",
    labelKey: "landing.competitionLabel",
    titleKey: "landing.competitionTitle",
  },
  {
    id: "sainthood",
    icon: "crown-outline",
    labelKey: "landing.sainthoodLabel",
    titleKey: "landing.sainthoodTitle",
  },
];

const missionActions = ["landing.mission1", "landing.mission2", "landing.mission3"];
const competitionActions = [
  "landing.competition1",
  "landing.competition2",
  "landing.competition3",
  "landing.competition4",
];
const appComparisons = ["landing.comparisonPrayer", "landing.comparisonBible", "landing.comparisonHabit"];
const sainthoodActions = ["landing.sainthood1", "landing.sainthood2", "landing.sainthood3"];

/** Renders the public landing carousel with shared light and foreground dust. */
export default function LandingScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const listRef = useRef<FlatList<LandingSlide>>(null);
  const router = useRouter();
  const { isDesktop, isLandscape, isLargeText, isTablet, width } = useResponsiveLayout();
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      const nextSlide = Math.max(0, Math.min(index, slides.length - 1));
      listRef.current?.scrollToOffset({ animated: true, offset: nextSlide * width });
      setActiveSlide(nextSlide);
    },
    [width],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LandingSlide>) => (
      <LandingSlideContent
        isLargeText={isLargeText}
        useWideLayout={isDesktop || (isTablet && isLandscape)}
        onStartJourney={() => router.push("/sign-up")}
        slide={item}
        width={width}
      />
    ),
    [isDesktop, isLandscape, isLargeText, isTablet, router, width],
  );

  const backgroundSource = isDesktop
    ? require("../assets/backgrounds/cathedralDesktop.png")
    : isTablet
      ? require("../assets/backgrounds/cathedralTablet.png")
      : require("../assets/backgrounds/cathedraMobile.png");

  return (
    <View style={styles.page}>
      <Image
        accessible={false}
        contentFit="cover"
        pointerEvents="none"
        source={backgroundSource}
        style={styles.backgroundImage}
      />
      <LinearGradient colors={theme.colors.gradients.landing} pointerEvents="none" style={styles.backgroundOverlay} />
      <SacredAtmosphere />

      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel={t("landing.signIn")}
            accessibilityRole="button"
            hitSlop={theme.spacing[2]}
            onPress={() => router.push("/sign-in")}
            style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
          >
            <Text style={styles.signIn}>{t("landing.signIn")}</Text>
          </Pressable>
        </View>

        <FlatList
          data={slides}
          decelerationRate="fast"
          directionalLockEnabled
          getItemLayout={(_, index) => ({ index, length: width, offset: width * index })}
          horizontal
          key={`landing-carousel-${width}`}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(event) => {
            setActiveSlide(Math.round(event.nativeEvent.contentOffset.x / width));
          }}
          pagingEnabled
          ref={listRef}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        />

        <View style={styles.controls}>
          <Pressable
            accessibilityLabel={t("landing.previous")}
            accessibilityRole="button"
            accessibilityState={{ disabled: activeSlide === 0 }}
            disabled={activeSlide === 0}
            hitSlop={theme.spacing[2]}
            onPress={() => goToSlide(activeSlide - 1)}
            style={({ pressed }) => [
              styles.arrowButton,
              activeSlide === 0 && styles.arrowButtonDisabled,
              pressed && activeSlide > 0 && styles.pressed,
            ]}
          >
            <Feather
              accessible={false}
              color={theme.colors.text.primary}
              name="chevron-left"
              size={theme.sizes.iconMedium}
            />
          </Pressable>

          <View
            accessibilityLabel={t("landing.screenProgress", { screen: activeSlide + 1, total: slides.length })}
            accessible
            style={styles.pagination}
          >
            {slides.map((slide, index) => (
              <View
                accessibilityElementsHidden
                key={slide.id}
                style={[styles.dot, index === activeSlide && styles.activeDot]}
              />
            ))}
          </View>

          <Pressable
            accessibilityLabel={t("landing.next")}
            accessibilityRole="button"
            accessibilityState={{ disabled: activeSlide === slides.length - 1 }}
            disabled={activeSlide === slides.length - 1}
            hitSlop={theme.spacing[2]}
            onPress={() => goToSlide(activeSlide + 1)}
            style={({ pressed }) => [
              styles.arrowButton,
              activeSlide === slides.length - 1 && styles.arrowButtonDisabled,
              pressed && activeSlide < slides.length - 1 && styles.pressed,
            ]}
          >
            <Feather
              accessible={false}
              color={theme.colors.text.primary}
              name="chevron-right"
              size={theme.sizes.iconMedium}
            />
          </Pressable>
        </View>
      </SafeAreaView>
      <SacredAtmosphere layer="foregroundDust" testID="landing-atmosphere-foreground" />
    </View>
  );
}

/** Renders one vertically scrollable landing page and reflows its art beside copy when space permits. */
function LandingSlideContent({
  isLargeText,
  onStartJourney,
  slide,
  useWideLayout,
  width,
}: {
  isLargeText: boolean;
  onStartJourney: () => void;
  slide: LandingSlide;
  useWideLayout: boolean;
  width: number;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <ScrollView
      contentContainerStyle={[styles.slideContent, useWideLayout && styles.slideContentWide]}
      showsVerticalScrollIndicator={false}
      style={[styles.slide, { width }]}
    >
      <View
        style={[
          styles.artworkHalo,
          isLargeText && styles.artworkHaloLargeText,
          slide.id === "sainthood" && styles.crownHalo,
        ]}
      >
        <View style={styles.artworkCircle}>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.rosary.colors.goldBright}
            name={slide.icon}
            size={theme.sizes.iconXL}
          />
        </View>
      </View>

      <View style={[styles.copy, useWideLayout && styles.copyWide]}>
        {slide.labelKey ? (
          <Text style={[styles.eyebrow, useWideLayout && styles.textWide]}>{t(slide.labelKey)}</Text>
        ) : null}
        <Text accessibilityRole="header" style={[styles.title, useWideLayout && styles.textWide]}>
          {t(slide.titleKey)}
        </Text>
        {slide.descriptionKey ? (
          <Text style={[styles.description, useWideLayout && styles.textWide]}>{t(slide.descriptionKey)}</Text>
        ) : null}

        {slide.id === "mission" ? <ActionList items={missionActions} /> : null}
        {slide.id === "difference" ? <DifferenceCopy /> : null}
        {slide.id === "competition" ? <ActionList items={competitionActions} /> : null}
        {slide.id === "sainthood" ? (
          <View style={styles.finalContent}>
            <ActionList items={sainthoodActions} />
            <Pressable
              accessibilityLabel={t("landing.startAction")}
              accessibilityRole="button"
              onPress={onStartJourney}
              style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
            >
              <Text style={styles.startButtonText}>{t("landing.brand")}</Text>
              <View style={styles.startButtonDivider} />
              <Text style={styles.startButtonLabel}>{t("landing.start")}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

/** Displays short landing actions as readable, wrapping bullet rows. */
function ActionList({ items }: { items: readonly string[] }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <View style={styles.actionList}>
      {items.map((item) => (
        <View key={item} style={styles.actionRow}>
          <View style={styles.actionMarker} />
          <Text style={styles.actionText}>{t(item)}</Text>
        </View>
      ))}
    </View>
  );
}

/** Explains the product distinction in a callout that preserves contrast in either appearance. */
function DifferenceCopy() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <View style={styles.differenceContent}>
      <View style={styles.comparisonList}>
        {appComparisons.map((comparison) => (
          <Text key={comparison} style={styles.comparisonText}>
            {t(comparison)}
          </Text>
        ))}
      </View>
      <View style={styles.differenceCallout}>
        <Text style={styles.calloutIntro}>{t("landing.differenceIntro")}</Text>
        <Text style={styles.calloutCopy}>{t("landing.differenceCopy")}</Text>
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  actionList: {
    alignItems: "flex-start",
    gap: theme.spacing[2],
    marginTop: theme.spacing[7],
  },
  actionMarker: {
    backgroundColor: theme.rosary.colors.goldBright,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2],
    width: theme.spacing[2],
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  actionText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.bodyMedium,
  },
  activeDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    borderColor: theme.rosary.colors.goldBright,
    width: theme.spacing[6],
  },
  arrowButton: {
    alignItems: "center",
    backgroundColor: "rgba(7, 19, 29, 0.68)",
    borderColor: "rgba(241, 196, 106, 0.5)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  arrowButtonDisabled: { opacity: theme.opacity.disabled },
  artworkCircle: {
    alignItems: "center",
    backgroundColor: "rgba(7, 19, 29, 0.88)",
    borderColor: "rgba(241, 196, 106, 0.8)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.spacing[24],
    justifyContent: "center",
    width: theme.spacing[24],
  },
  artworkHalo: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: "rgba(230, 186, 100, 0.25)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: 136,
    justifyContent: "center",
    width: 136,
  },
  artworkHaloLargeText: {
    height: 112,
    width: 112,
  },
  backgroundImage: { ...StyleSheet.absoluteFill, opacity: 0.68 },
  backgroundOverlay: { ...StyleSheet.absoluteFill },
  calloutCopy: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
    textAlign: "left",
  },
  calloutIntro: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.goldBright,
    fontFamily: theme.fontFamilies.devotional,
  },
  carousel: { flex: 1 },
  comparisonList: { gap: theme.spacing[3] },
  comparisonText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[2],
  },
  copy: { alignItems: "center", maxWidth: 520, width: "100%" },
  copyWide: { alignItems: "flex-start", flex: 1, minWidth: 0 },
  crownHalo: { backgroundColor: "rgba(230, 186, 100, 0.18)" },
  description: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[4],
    maxWidth: 400,
    textAlign: "center",
  },
  differenceCallout: {
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[1],
    marginTop: theme.spacing[6],
    padding: theme.spacing[4],
  },
  differenceContent: { marginTop: theme.spacing[6], width: "100%" },
  dot: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    borderColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.spacing[2],
    width: theme.spacing[2],
  },
  eyebrow: {
    ...theme.typography.label,
    color: theme.rosary.colors.goldBright,
    letterSpacing: theme.letterSpacing.widest,
    marginBottom: theme.spacing[2],
    textAlign: "center",
  },
  finalContent: { alignItems: "center", width: "100%" },
  page: { backgroundColor: theme.colors.background.deep, flex: 1, position: "relative" },
  pagination: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.96 }] },
  safeArea: { flex: 1, position: "relative", zIndex: theme.zIndex.card },
  signIn: {
    ...theme.typography.label,
    color: theme.colors.text.primary,
  },
  signInButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[2],
  },
  slide: { flex: 1 },
  slideContent: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
  },
  slideContentWide: {
    flexDirection: "row",
    gap: theme.spacing[12],
    paddingHorizontal: theme.spacing[10],
  },
  startButton: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.goldBright,
    borderColor: theme.colors.gold.primary,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.medium,
    gap: theme.spacing[1.5],
    marginTop: theme.spacing[7],
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
    width: "100%",
  },
  startButtonDivider: {
    backgroundColor: "rgba(8, 20, 30, 0.24)",
    height: theme.borderWidths.thin,
    width: "100%",
  },
  startButtonLabel: {
    ...theme.typography.label,
    color: theme.colors.text.inverse,
    letterSpacing: theme.letterSpacing.wider,
  },
  startButtonPressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.98 }] },
  startButtonText: {
    ...theme.typography.heading3,
    color: theme.colors.text.inverse,
    fontFamily: theme.fontFamilies.devotional,
  },
  title: {
    ...theme.typography.displayMedium,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.devotional,
    letterSpacing: theme.letterSpacing.normal,
    textAlign: "center",
  },
  textWide: { textAlign: "left" },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[2],
  },
}));
