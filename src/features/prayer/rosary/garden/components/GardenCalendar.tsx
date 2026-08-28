import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { GardenDayCell } from "@/features/prayer/rosary/garden/components/GardenDayCell";
import { theme } from "@/theme/tokens";
import type { RosaryGardenDay } from "@/features/prayer/rosary/garden/types";

interface GardenCalendarProps {
  days: RosaryGardenDay[];
  month: number;
  year: number;
}

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const daysInWeek = weekDays.length;
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

export function GardenCalendar({ days, month, year }: GardenCalendarProps) {
  const reduceMotion = useReducedMotion();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const calendarRows = buildCalendarRows(days, month, year);
  const isFullBloom =
    days.filter((day) => day.isEligible).length > 0 &&
    days.filter((day) => day.isEligible).every((day) => day.completed);

  return (
    <View accessibilityLabel="Monthly Rosary Garden calendar" style={[styles.card, isFullBloom && styles.fullBloom]}>
      {isFullBloom ? <Text style={styles.fullBloomLabel}>Garden in Full Bloom</Text> : null}
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(10, 38, 55, 0.92)",
    borderColor: "rgba(72, 129, 154, 0.74)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[2],
    ...theme.shadows.medium,
  },
  fullBloom: { borderColor: theme.rosary.colors.gold, ...theme.rosary.shadows.activeBead },
  fullBloomLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing[1],
    textAlign: "center",
  },
  column: { flex: 1, minWidth: 0 },
  weekHeader: { flexDirection: "row", gap: gridGap, marginBottom: gridGap },
  weekDay: { ...theme.typography.labelSmall, color: theme.colors.text.muted, textAlign: "center" },
  grid: { gap: gridGap, width: "100%" },
  calendarRow: { flexDirection: "row", gap: gridGap, width: "100%" },
  dateCell: { aspectRatio: 1, overflow: "hidden" },
  emptyCell: { flex: 1 },
});
