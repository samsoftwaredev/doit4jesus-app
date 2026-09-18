import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useRosaryGarden } from "@/features/prayer/rosary/garden/useRosaryGarden";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { GardenCalendar } from "../GardenCalendar";
import { GardenHero } from "../GardenHero";
import { GardenStats } from "../GardenStats";
import { MonthNavigator } from "../MonthNavigator";
import { PrayTodayButton } from "../PrayTodayButton";

export type RosaryGardenSectionProps = {
  onPrayToday: () => void;
};

/** Embeds the complete Rosary Garden experience within one continuous bordered surface. */
export function RosaryGardenSection({ onPrayToday }: RosaryGardenSectionProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const garden = useRosaryGarden();

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
            month={garden.selectedMonthNumber}
            onNext={garden.goToNextMonth}
            onPrevious={garden.goToPreviousMonth}
            year={garden.selectedYear}
          />
          <View style={styles.calendarArea} testID="garden-calendar-area">
            <GardenCalendar days={garden.days} month={garden.selectedMonthNumber} year={garden.selectedYear} />
          </View>
          <GardenStats stats={garden.stats} />
          <PrayTodayButton onPress={onPrayToday} />
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
  offlineLabel: {
    ...theme.typography.labelSmall,
    alignSelf: "flex-end",
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.wider,
  },
  section: {
    minWidth: theme.spacing[0],
    width: "100%",
    ...theme.shadows.large,
  },
}));
