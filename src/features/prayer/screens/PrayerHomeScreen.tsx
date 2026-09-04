import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { SacredAtmosphere } from "@/components/ui";
import { OrnateCard } from "@/features/prayer/components";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { cacheApprovedPrayerIntentions, fetchApprovedPrayerIntentions } from "@/features/prayer/intentions";
import { PrayerIntentionCard } from "@/features/prayer/intentions/components";
import { RosaryMysteryCard } from "@/features/prayer/rosary/components";
import { getRosaryMysterySet, rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";
import { getTodayRosaryMysteryType, getWeekdayLabel } from "@/features/prayer/rosary/data/schedule";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const previewLimit = 10;

/** Renders the daily prayer dashboard within the shared atmosphere. */
export function PrayerScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { contentWidth, gutter, isDesktop, isLargeText, isNarrowPhone, isTablet, width } = useResponsiveLayout();
  const [intentions, setIntentions] = useState<ApprovedPrayerIntention[]>([]);
  const [isLoadingIntentions, setIsLoadingIntentions] = useState(true);
  const [intentionsError, setIntentionsError] = useState<string>();
  const todayMysteryType = getTodayRosaryMysteryType();
  const todaySet = getRosaryMysterySet(todayMysteryType);
  const columnGap = theme.spacing[2];
  const containerMaxWidth = isDesktop ? 960 : isTablet ? 760 : width;
  const usableWidth = Math.max(0, Math.min(contentWidth, containerMaxWidth) - gutter * 2);
  const mysteryColumns = isLargeText || isNarrowPhone ? 1 : isDesktop ? 4 : 2;
  const mysteryCardWidth = Math.max(
    theme.sizes.touchTarget * 3,
    (usableWidth - columnGap * (mysteryColumns - 1)) / mysteryColumns,
  );

  const loadIntentions = useCallback(async () => {
    setIntentionsError(undefined);
    setIsLoadingIntentions(true);
    try {
      const page = await fetchApprovedPrayerIntentions({ limit: previewLimit });
      cacheApprovedPrayerIntentions(page.data);
      setIntentions(page.data);
    } catch (error) {
      setIntentionsError(error instanceof Error ? error.message : "Couldn't load prayer intentions.");
    } finally {
      setIsLoadingIntentions(false);
    }
  }, []);

  useEffect(() => {
    void loadIntentions();
  }, [loadIntentions]);

  const openRosary = (mysteryType: typeof todayMysteryType, source: "today" | "manual") => {
    router.push({
      pathname: "/rosary",
      params: { isDecade: "false", mysteryType, source },
    });
  };

  return (
    <AtmosphericSafeAreaView edges={["top"]} includeAtmosphere={false} style={styles.safeArea}>
      <LinearGradient colors={theme.colors.gradients.prayerHome} style={styles.background}>
        <SacredAtmosphere />
        <ScrollView
          contentContainerStyle={[styles.content, { maxWidth: containerMaxWidth, paddingHorizontal: gutter }]}
          showsVerticalScrollIndicator={false}
          style={styles.atmosphereContent}
        >
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.brandEyebrow}>A MOMENT OF PRAYER</Text>
              <Text accessibilityRole="header" style={styles.brand}>
                Rosary
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Open Rosary Garden"
              accessibilityRole="button"
              onPress={() => router.push("/rosary-garden")}
              style={styles.gardenButton}
            >
              <Feather
                accessible={false}
                color={theme.rosary.colors.goldBright}
                name="calendar"
                size={theme.sizes.iconMedium}
              />
            </Pressable>
          </View>
          <TodayRosaryCard
            mysteryTitle={todaySet.title}
            onPress={() => openRosary(todayMysteryType, "today")}
            weekday={getWeekdayLabel()}
          />

          <SectionLabel label="All Mysteries" />
          <View style={[styles.mysteryGrid, { columnGap, rowGap: columnGap }]}>
            {rosaryMysterySets.map((set) => (
              <RosaryMysteryCard
                key={set.type}
                mysterySet={set}
                onPress={() => openRosary(set.type, "manual")}
                width={mysteryCardWidth}
              />
            ))}
          </View>

          <View style={styles.intentionsHeader}>
            <SectionLabel label="Prayers by Others" />
            <Pressable
              accessibilityLabel="See all prayer intentions"
              accessibilityRole="button"
              onPress={() => router.push("/prayer-intentions")}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAll}>See All</Text>
              <Feather
                accessible={false}
                color={theme.rosary.colors.goldBright}
                name="chevron-right"
                size={theme.sizes.iconSmall}
              />
            </Pressable>
          </View>

          {isLoadingIntentions ? <PrayerIntentionSkeletons /> : null}
          {intentionsError ? (
            <View accessibilityRole="alert" style={styles.intentionState}>
              <Text style={styles.stateText}>Couldn&apos;t load prayer intentions.</Text>
              <Pressable accessibilityRole="button" onPress={() => void loadIntentions()} style={styles.retryButton}>
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : null}
          {!isLoadingIntentions && !intentionsError && intentions.length === 0 ? (
            <View style={styles.intentionState}>
              <Text style={styles.stateText}>No prayer intentions yet.</Text>
              <Text style={styles.stateCopy}>Be the first to share an intention.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/create-prayer-intention")}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Share a Prayer Intention</Text>
              </Pressable>
            </View>
          ) : null}
          {!isLoadingIntentions && !intentionsError && intentions.length > 0 ? (
            <ScrollView contentContainerStyle={styles.intentionsList} horizontal showsHorizontalScrollIndicator={false}>
              {intentions.map((intention) => (
                <PrayerIntentionCard
                  key={intention.id}
                  intention={intention}
                  onPress={() =>
                    router.push({
                      pathname: "/intention-rosary",
                      params: { intentionId: intention.id },
                    })
                  }
                />
              ))}
            </ScrollView>
          ) : null}
          <View style={styles.managementRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/create-prayer-intention")}
              style={styles.managementButton}
            >
              <Feather accessible={false} color={theme.rosary.colors.gold} name="plus" size={theme.sizes.iconSmall} />
              <Text style={styles.managementText}>Share an intention</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/my-prayer-intentions")}
              style={styles.managementButton}
            >
              <Feather accessible={false} color={theme.rosary.colors.gold} name="list" size={theme.sizes.iconSmall} />
              <Text style={styles.managementText}>My intentions</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </AtmosphericSafeAreaView>
  );
}

/** Renders TodayRosaryCard with styles resolved from the active appearance. */
function TodayRosaryCard({
  mysteryTitle,
  onPress,
  weekday,
}: {
  mysteryTitle: string;
  onPress: () => void;
  weekday: string;
}) {
  const styles = useThemedStyles(styleSheet);
  return (
    <OrnateCard style={styles.todayCard}>
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../../assets/saints/blessed-virgin-mary.png")}
        style={styles.todayImage}
      />
      <LinearGradient colors={theme.colors.gradients.prayerImage} style={StyleSheet.absoluteFill} />
      <View style={styles.todayContent}>
        <View style={styles.todayLabel}>
          <Feather accessible={false} color={theme.rosary.colors.gold} name="calendar" size={theme.sizes.iconSmall} />
          <Text style={styles.sectionLabel}>TODAY&apos;S ROSARY</Text>
        </View>
        <Text style={styles.todayTitle}>{mysteryTitle}</Text>
        <Text style={styles.weekday}>{weekday}</Text>
        <Pressable
          accessibilityLabel={`Pray today's ${mysteryTitle}`}
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [styles.todayAction, pressed && styles.pressed]}
        >
          <Text style={styles.todayActionText}>Pray Today&apos;s Rosary</Text>
          <Feather
            accessible={false}
            color={theme.colors.text.inverse}
            name="chevron-right"
            size={theme.sizes.iconSmall}
          />
        </Pressable>
      </View>
    </OrnateCard>
  );
}

/** Renders SectionLabel with styles resolved from the active appearance. */
function SectionLabel({ label }: { label: string }) {
  const styles = useThemedStyles(styleSheet);
  return <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>;
}

/** Renders PrayerIntentionSkeletons with styles resolved from the active appearance. */
function PrayerIntentionSkeletons() {
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel="Loading prayer intentions" style={styles.skeletonRow}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <ActivityIndicator color={theme.rosary.colors.gold} />
        </View>
      ))}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  background: { flex: 1, position: "relative" },
  atmosphereContent: { zIndex: theme.zIndex.card },
  brand: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    marginTop: theme.spacing[0.5],
  },
  brandEyebrow: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
  gardenButton: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  intentionState: {
    alignItems: "flex-start",
    backgroundColor: "rgba(15, 42, 62, 0.82)",
    borderColor: "rgba(230, 186, 100, 0.34)",
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.hairline,
    padding: theme.spacing[4],
  },
  intentionsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing[1],
    flexWrap: "wrap",
  },
  intentionsList: { gap: theme.spacing[2], paddingRight: theme.spacing[3] },
  managementButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    minHeight: theme.sizes.touchTarget,
  },
  managementRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    justifyContent: "center",
  },
  managementText: {
    ...theme.typography.caption,
    color: theme.rosary.colors.goldBright,
  },
  mysteryGrid: { flexDirection: "row", flexWrap: "wrap" },
  pressed: { opacity: theme.opacity.pressed },
  retryButton: {
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    justifyContent: "center",
  },
  retryText: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
  safeArea: { backgroundColor: theme.rosary.colors.canvas, flex: 1 },
  sectionLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  seeAll: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
  seeAllButton: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget,
  },
  skeletonCard: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderRadius: theme.radii.lg,
    height: 178,
    justifyContent: "center",
    width: 142,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: theme.spacing[2],
    overflow: "hidden",
  },
  stateCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  stateText: { ...theme.typography.bodyMedium, color: theme.colors.text.white },
  todayAction: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    marginTop: theme.spacing[4],
    minHeight: theme.sizes.buttonHeight,
    paddingHorizontal: theme.spacing[3],
  },
  todayActionText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  todayCard: { backgroundColor: theme.rosary.colors.cardInset, minHeight: 272 },
  todayContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: theme.spacing[4],
  },
  todayImage: { height: "100%", position: "absolute", right: 0, width: "100%" },
  todayLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  todayTitle: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    marginTop: theme.spacing[2],
    maxWidth: "72%",
  },
  weekday: {
    ...theme.typography.bodyMedium,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
  },
}));
