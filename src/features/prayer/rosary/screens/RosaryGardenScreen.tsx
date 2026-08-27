import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  GardenCalendar,
  GardenHero,
  GardenMotivationCard,
  GardenQuoteCard,
  GardenStats,
  MonthNavigator,
  PrayTodayButton,
} from "@/features/prayer/rosary/garden/components";
import { useRosaryGarden } from "@/features/prayer/rosary/hooks/useRosaryGarden";
import { theme } from "@/theme/tokens";

export function RosaryGardenScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= theme.breakpoints.tablet;
  const garden = useRosaryGarden();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <LinearGradient
        colors={["#071B2A", "#0A2C3A", "#071B2A"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.page, isTablet && styles.tabletPage]}>
            <View style={styles.topBar}>
              <Pressable
                accessibilityLabel="Return to Rosary prayer"
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Feather color={theme.colors.text.white} name="chevron-left" size={theme.sizes.iconMedium} />
              </Pressable>
              {garden.isUsingMockData ? (
                <Text accessibilityLabel="Garden preview data" style={styles.offlineLabel}>
                  Garden preview
                </Text>
              ) : null}
            </View>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <MaterialCommunityIcons
                  color={theme.colors.gold.pale}
                  name="shield-cross"
                  size={theme.sizes.iconMedium}
                />
              </View>
              <Text style={styles.brand}>doit4Jesus</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#071B2A", flex: 1 },
  background: { flex: 1 },
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
  brand: { ...theme.typography.heading3, color: theme.colors.text.primary },
  brandIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  brandRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[2],
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
});
