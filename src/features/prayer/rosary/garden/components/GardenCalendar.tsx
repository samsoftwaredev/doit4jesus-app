import { Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { GardenDayCell } from "@/features/prayer/rosary/garden/components/GardenDayCell";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { RosaryGardenDay } from "@/features/prayer/rosary/garden/types";
import { useAppLanguage } from "@/localization";

interface GardenCalendarProps {
  days: RosaryGardenDay[];
  month: number;
  year: number;
}

const daysInWeek = 7;
const gridGap = theme.spacing[1];

export function buildCalendarRows(days: RosaryGardenDay[], month: number, year: number) {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const cells: (RosaryGardenDay | null)[] = [...Array.from({ length: firstWeekday }, () => null), ...days];
  const trailingCellCount = (daysInWeek - (cells.length % daysInWeek)) % daysInWeek;

  cells.push(...Array.from({ length: trailingCellCount }, () => null));

  return Array.from({ length: cells.length / daysInWeek }, (_, rowIndex) =>
    cells.slice(rowIndex * daysInWeek, (rowIndex + 1) * daysInWeek),
  );
}

/** Renders the monthly Garden grid without introducing a nested card surface. */
export function GardenCalendar({ days, month, year }: GardenCalendarProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const reduceMotion = useReducedMotion();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const calendarRows = buildCalendarRows(days, month, year);
  const isFullBloom =
    days.filter((day) => day.isEligible).length > 0 &&
    days.filter((day) => day.isEligible).every((day) => day.completed);
  const weekDays = Array.from({ length: daysInWeek }, (_, dayIndex) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }).format(
      new Date(Date.UTC(2026, 7, 2 + dayIndex)),
    ),
  );

  return (
    <View accessibilityLabel={t("rosary.garden.calendarLabel")} style={styles.card} testID="garden-calendar">
      {isFullBloom ? <Text style={styles.fullBloomLabel}>{t("rosary.garden.fullBloom")}</Text> : null}
      <View accessible={false} style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={`${day}-${index}`} style={styles.column} testID={`garden-weekday-${index}`}>
            <Text style={styles.weekDay}>{day}</Text>
          </View>
        ))}
      </View>
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(220)}
        key={`${year}-${month}`}
        style={styles.grid}
        testID="garden-calendar-grid"
      >
        {calendarRows.map((row, rowIndex) => (
          <View key={`week-${rowIndex}`} style={styles.calendarRow} testID={`garden-calendar-row-${rowIndex}`}>
            {row.map((day, columnIndex) => {
              const cellIndex = rowIndex * daysInWeek + columnIndex;
              const isLeadingCell = day === null && cellIndex < firstWeekday;

              return (
                <View
                  accessible={false}
                  key={day?.date ?? `empty-${cellIndex}`}
                  style={[styles.column, styles.dateCell]}
                  testID={`garden-calendar-cell-${rowIndex}-${columnIndex}`}
                >
                  {day ? (
                    <GardenDayCell day={day} />
                  ) : (
                    <View
                      accessible={false}
                      style={styles.emptyCell}
                      testID={`${isLeadingCell ? "garden-leading-empty" : "garden-trailing-empty"}-${cellIndex}`}
                    />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.transparent,
    borderRadius: theme.spacing[0],
    borderWidth: theme.spacing[0],
  },
  fullBloomLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing[1],
    textAlign: "center",
  },
  column: { flex: 1, minWidth: 0 },
  weekHeader: { flexDirection: "row", gap: gridGap, marginBottom: gridGap },
  weekDay: { ...theme.typography.labelSmall, color: theme.rosary.colors.gardenTextMuted, textAlign: "center" },
  grid: { gap: gridGap, width: "100%" },
  calendarRow: { flexDirection: "row", gap: gridGap, width: "100%" },
  dateCell: { aspectRatio: 1, overflow: "hidden" },
  emptyCell: { flex: 1 },
}));
