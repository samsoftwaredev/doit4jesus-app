import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { parseRosaryCompletionData, parseRosaryStreakData } from "@/features/prayer/rosary/garden/api";
import { useRosaryGarden } from "@/features/prayer/rosary/garden/useRosaryGarden";
import { parseCurrentUserProfileData } from "@/features/profile/profile.api";
import type { ScreenDataResponse } from "@/features/screen-data";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { GardenCalendar } from "../GardenCalendar";
import { GardenHero } from "../GardenHero";
import { GardenStats } from "../GardenStats";
import { MonthNavigator } from "../MonthNavigator";
import { PrayTodayButton } from "../PrayTodayButton";

export type RosaryGardenSectionProps = {
  initialData?: ScreenDataResponse;
  onPrayToday: () => void;
};

/** Embeds the complete Rosary Garden experience within one continuous bordered surface. */
export function RosaryGardenSection({ initialData, onPrayToday }: RosaryGardenSectionProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const completion = initialData?.sections.rosaryCompletion;
  const streak = initialData?.sections.rosaryStreak;
  const me = initialData?.sections.me;
  const garden = useRosaryGarden({
    ...(completion ? { initialCompletion: parseRosaryCompletionData(completion.data) } : {}),
    ...(me ? { initialUser: parseCurrentUserProfileData(me.data) } : {}),
    ...(streak ? { initialStreak: parseRosaryStreakData(streak.data) } : {}),
  });

  return (
    <View style={styles.section}>
      <View style={styles.card} testID="rosary-garden-card">
        <GardenHero />
        <View style={styles.body}>
          {garden.isUsingMockData ? (
            <Text accessibilityLabel={t("rosary.garden.previewLabel")} style={styles.offlineLabel}>
              {t("rosary.garden.preview")}
            </Text>
          ) : null}
          <MonthNavigator
            canGoNext={garden.canGoNext}
            canGoPrevious={garden.canGoPrevious}
            isLoading={garden.isLoading}
            month={garden.selectedMonthNumber}
            onNext={garden.goToNextMonth}
            onPrevious={garden.goToPreviousMonth}
            year={garden.selectedYear}
          />
          {garden.hasNavigationError ? (
            <View accessibilityRole="alert" style={styles.navigationError}>
              <Text style={styles.navigationErrorText}>{t("rosary.garden.monthLoadError")}</Text>
              <Pressable
                accessibilityLabel={t("rosary.garden.retryMonthLoad")}
                accessibilityRole="button"
                onPress={garden.retryMonthLoad}
                style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
              >
                <Text style={styles.retryButtonText}>{t("rosary.garden.retryMonthLoad")}</Text>
              </Pressable>
            </View>
          ) : null}
          <View style={styles.calendarArea} testID="garden-calendar-area">
            <GardenCalendar days={garden.days} month={garden.selectedMonthNumber} year={garden.selectedYear} />
          </View>
          <GardenStats stats={garden.stats} />
          <PrayTodayButton onPress={onPrayToday} />
          <Text style={styles.dailyRosaryNote}>{t("rosary.garden.dailyRosaryNote")}</Text>
        </View>
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  body: {
    gap: theme.spacing[4],
    padding: theme.spacing[3],
  },
  card: {
    backgroundColor: theme.rosary.colors.card,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.rosary.borderWidths.goldHairline,
    overflow: "hidden",
    width: "100%",
  },
  calendarArea: {
    minWidth: theme.spacing[0],
    width: "100%",
  },
  dailyRosaryNote: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  offlineLabel: {
    ...theme.typography.labelSmall,
    alignSelf: "flex-end",
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.wider,
  },
  navigationError: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    justifyContent: "space-between",
  },
  navigationErrorText: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.gardenTextPrimary,
    flex: 1,
    minWidth: theme.spacing[0],
  },
  retryButton: {
    alignItems: "center",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  retryButtonPressed: { opacity: theme.opacity.pressed },
  retryButtonText: { ...theme.typography.labelSmall, color: theme.rosary.colors.gold },
  section: {
    minWidth: theme.spacing[0],
    width: "100%",
    ...theme.shadows.large,
  },
}));
