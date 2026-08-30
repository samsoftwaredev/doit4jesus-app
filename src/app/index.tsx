import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/tokens";

type LandingSlide = {
  description?: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  id: "mission" | "difference" | "competition" | "sainthood";
  label?: string;
  title: string;
};

const slides: readonly LandingSlide[] = [
  {
    id: "mission",
    icon: "shield-cross",
    label: "DOIT4JESUS",
    title: "FIGHT FOR SOMETHING GREATER",
    description: "Turn your Catholic life into a daily spiritual mission.",
  },
  {
    id: "difference",
    icon: "sword-cross",
    title: "THIS ISN'T ANOTHER PRAYER APP.",
  },
  {
    id: "competition",
    icon: "account-group",
    label: "HOLY COMPETITION",
    title: "GROW TOGETHER",
  },
  {
    id: "sainthood",
    icon: "crown-outline",
    label: "THE ULTIMATE GOAL?",
    title: "SAINTHOOD.",
  },
];

const missionActions = ["Pray.", "Fight temptation.", "Build virtue."];
const competitionActions = [
  "Challenge friends.",
  "Track progress.",
  "Encourage each other.",
  "Compete in becoming better Catholics.",
];
const appComparisons = ["Prayer apps help you listen.", "Bible apps help you read.", "Habit apps help you track."];
const sainthoodActions = ["Build discipline.", "Grow in virtue.", "Get closer to Christ."];

export default function LandingScreen() {
  const listRef = useRef<FlatList<LandingSlide>>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
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
      <LandingSlideContent onStartJourney={() => router.push("/sign-up")} slide={item} width={width} />
    ),
    [router, width],
  );

  return (
    <View style={styles.page}>
      <Image
        accessible={false}
        contentFit="cover"
        pointerEvents="none"
        source={require("../assets/backgrounds/cathedraMobile.png")}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={["rgba(3, 11, 18, 0.75)", "rgba(4, 17, 27, 0.88)", "#07131D"]}
        pointerEvents="none"
        style={styles.backgroundOverlay}
      />

      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View style={styles.topBar}>
          <View accessible accessibilityLabel="Do It For Jesus" style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <MaterialCommunityIcons
                accessible={false}
                color={theme.rosary.colors.goldBright}
                name="shield-cross"
                size={theme.sizes.iconSmall}
              />
            </View>
            <Text style={styles.brand}>doit4Jesus</Text>
          </View>
          <Pressable
            accessibilityLabel="Sign in"
            accessibilityRole="button"
            hitSlop={theme.spacing[2]}
            onPress={() => router.push("/sign-in")}
            style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}
          >
            <Text style={styles.signIn}>Sign in</Text>
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
            accessibilityLabel="Previous landing screen"
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
            accessibilityLabel={`Screen ${activeSlide + 1} of ${slides.length}`}
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
            accessibilityLabel="Next landing screen"
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
    </View>
  );
}

function LandingSlideContent({
  onStartJourney,
  slide,
  width,
}: {
  onStartJourney: () => void;
  slide: LandingSlide;
  width: number;
}) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.slideContent}>
        <View style={[styles.artworkHalo, slide.id === "sainthood" && styles.crownHalo]}>
          <View style={styles.artworkCircle}>
            <MaterialCommunityIcons
              accessible={false}
              color={theme.rosary.colors.goldBright}
              name={slide.icon}
              size={theme.sizes.iconXL}
            />
          </View>
        </View>

        <View style={styles.copy}>
          {slide.label ? <Text style={styles.eyebrow}>{slide.label}</Text> : null}
          <Text accessibilityRole="header" style={styles.title}>
            {slide.title}
          </Text>
          {slide.description ? <Text style={styles.description}>{slide.description}</Text> : null}

          {slide.id === "mission" ? <ActionList items={missionActions} /> : null}
          {slide.id === "difference" ? <DifferenceCopy /> : null}
          {slide.id === "competition" ? <ActionList items={competitionActions} /> : null}
          {slide.id === "sainthood" ? (
            <View style={styles.finalContent}>
              <ActionList items={sainthoodActions} />
              <Pressable
                accessibilityLabel="Start your journey"
                accessibilityRole="button"
                onPress={onStartJourney}
                style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
              >
                <Text style={styles.startButtonText}>DO IT FOR JESUS</Text>
                <View style={styles.startButtonDivider} />
                <Text style={styles.startButtonLabel}>START YOUR JOURNEY</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function ActionList({ items }: { items: readonly string[] }) {
  return (
    <View style={styles.actionList}>
      {items.map((item) => (
        <View key={item} style={styles.actionRow}>
          <View style={styles.actionMarker} />
          <Text style={styles.actionText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function DifferenceCopy() {
  return (
    <View style={styles.differenceContent}>
      <View style={styles.comparisonList}>
        {appComparisons.map((comparison) => (
          <Text key={comparison} style={styles.comparisonText}>
            {comparison}
          </Text>
        ))}
      </View>
      <View style={styles.differenceCallout}>
        <Text style={styles.calloutIntro}>DoIt4Jesus helps you fight.</Text>
        <Text style={styles.calloutCopy}>
          Your Catholic life becomes an adventure where what you do in the real world determines what happens in the
          game.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  backgroundImage: { ...StyleSheet.absoluteFill, opacity: 0.68 },
  backgroundOverlay: { ...StyleSheet.absoluteFill },
  brand: {
    ...theme.typography.label,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.devotional,
    fontSize: theme.fontSizes.lg,
  },
  brandIcon: {
    alignItems: "center",
    backgroundColor: "rgba(7, 19, 29, 0.78)",
    borderColor: "rgba(241, 196, 106, 0.56)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  brandRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
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
  crownHalo: { backgroundColor: "rgba(230, 186, 100, 0.18)" },
  description: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[4],
    maxWidth: 400,
    textAlign: "center",
  },
  differenceCallout: {
    backgroundColor: "rgba(7, 19, 29, 0.72)",
    borderColor: "rgba(241, 196, 106, 0.42)",
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
  page: { backgroundColor: theme.colors.background.deep, flex: 1 },
  pagination: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.96 }] },
  safeArea: { flex: 1 },
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
    flex: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
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
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[2],
  },
});
