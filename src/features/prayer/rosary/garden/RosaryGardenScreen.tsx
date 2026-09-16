import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { SacredAtmosphere } from "@/components/ui";
import {
  GardenCalendar,
  GardenHero,
  GardenMotivationCard,
  GardenQuoteCard,
  GardenStats,
  MonthNavigator,
  PrayTodayButton,
} from "@/features/prayer/rosary/garden/components";
import { useRosaryGarden } from "@/features/prayer/rosary/garden/useRosaryGarden";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders the rosary garden and its progress within the shared atmosphere. */
export function RosaryGardenScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= theme.breakpoints.tablet;
  const garden = useRosaryGarden();

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} includeAtmosphere={false} style={styles.safeArea}>
      <LinearGradient
        colors={theme.colors.gradients.garden}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.background}
      >
        <SacredAtmosphere />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.atmosphereContent}
        >
          <View style={[styles.page, isTablet && styles.tabletPage]}>
            <View style={styles.topBar}>
              <Pressable
                accessibilityLabel={t("rosary.garden.return")}
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Feather color={theme.colors.text.white} name="chevron-left" size={theme.sizes.iconMedium} />
              </Pressable>
              {garden.isUsingMockData ? (
                <Text accessibilityLabel={t("rosary.garden.previewLabel")} style={styles.offlineLabel}>
                  {t("rosary.garden.preview")}
                </Text>
              ) : null}
            </View>
            <GardenHero />
            <MonthNavigator
              canGoNext={garden.canGoNext}
              canGoPrevious={garden.canGoPrevious}
              month={garden.selectedMonthNumber}
              onNext={garden.goToNextMonth}
              onPrevious={garden.goToPreviousMonth}
              year={garden.selectedYear}
            />
            <View style={[styles.calendarArea, isTablet && styles.tabletCalendarArea]}>
              <View style={styles.calendarWrap}>
                <GardenCalendar days={garden.days} month={garden.selectedMonthNumber} year={garden.selectedYear} />
              </View>
              <View style={[styles.quoteWrap, isTablet && styles.tabletQuoteWrap]}>
                <GardenQuoteCard />
              </View>
            </View>
            <GardenStats stats={garden.stats} />
            <GardenMotivationCard />
            <PrayTodayButton onPress={() => router.navigate("/prayer")} />
          </View>
        </ScrollView>
      </LinearGradient>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safeArea: { backgroundColor: "#071B2A", flex: 1 },
  background: { flex: 1, position: "relative" },
  atmosphereContent: { zIndex: theme.zIndex.card },
  scrollContent: { flexGrow: 1 },
  page: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 900,
    paddingBottom: theme.spacing[7],
    paddingHorizontal: theme.spacing[3],
    width: "100%",
  },
  tabletPage: { gap: theme.spacing[5], paddingHorizontal: theme.spacing[7] },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: theme.sizes.touchTarget,
    paddingTop: theme.spacing[1],
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  offlineLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.wider,
  },
  calendarArea: { gap: theme.spacing[3] },
  tabletCalendarArea: {
    alignItems: "stretch",
    flexDirection: "row",
    gap: theme.spacing[4],
  },
  calendarWrap: { flex: 1, minWidth: 0 },
  quoteWrap: { width: "100%" },
  tabletQuoteWrap: { flex: 0.38, minWidth: 220 },
}));
