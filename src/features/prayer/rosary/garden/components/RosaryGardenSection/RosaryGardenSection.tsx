import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useRosaryGarden } from "@/features/prayer/rosary/garden/useRosaryGarden";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { GardenCalendar } from "../GardenCalendar";
import { GardenHero } from "../GardenHero";
import { GardenMotivationCard } from "../GardenMotivationCard";
import { GardenQuoteCard } from "../GardenQuoteCard";
import { GardenStats } from "../GardenStats";
import { MonthNavigator } from "../MonthNavigator";
import { PrayTodayButton } from "../PrayTodayButton";

export type RosaryGardenSectionProps = {
  onPrayToday: () => void;
};

/** Embeds the complete Rosary Garden experience inside a parent prayer page. */
export function RosaryGardenSection({ onPrayToday }: RosaryGardenSectionProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { isLargeText, isTablet } = useResponsiveLayout();
  const garden = useRosaryGarden();
  const useCalendarColumns = isTablet && !isLargeText;

  return (
    <View style={styles.section}>
      {garden.isUsingMockData ? (
        <Text accessibilityLabel={t("rosary.garden.previewLabel")} style={styles.offlineLabel}>
          {t("rosary.garden.preview")}
        </Text>
      ) : null}
      <GardenHero />
      <MonthNavigator
        canGoNext={garden.canGoNext}
        canGoPrevious={garden.canGoPrevious}
        month={garden.selectedMonthNumber}
        onNext={garden.goToNextMonth}
        onPrevious={garden.goToPreviousMonth}
        year={garden.selectedYear}
      />
      <View
        style={[styles.calendarArea, useCalendarColumns && styles.tabletCalendarArea]}
        testID="garden-calendar-area"
      >
        <View style={styles.calendarWrap}>
          <GardenCalendar days={garden.days} month={garden.selectedMonthNumber} year={garden.selectedYear} />
        </View>
        <View style={[styles.quoteWrap, useCalendarColumns && styles.tabletQuoteWrap]}>
          <GardenQuoteCard />
        </View>
      </View>
      <GardenStats stats={garden.stats} />
      <GardenMotivationCard />
      <PrayTodayButton onPress={onPrayToday} />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  calendarArea: {
    gap: theme.spacing[3],
  },
  calendarWrap: {
    flex: 1,
    minWidth: theme.spacing[0],
  },
  offlineLabel: {
    ...theme.typography.labelSmall,
    alignSelf: "flex-end",
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.wider,
  },
  quoteWrap: {
    width: "100%",
  },
  section: {
    gap: theme.spacing[4],
    minWidth: theme.spacing[0],
    width: "100%",
  },
  tabletCalendarArea: {
    alignItems: "stretch",
    flexDirection: "row",
    gap: theme.spacing[4],
  },
  tabletQuoteWrap: {
    flex: 0.38,
    minWidth: 220,
  },
}));
