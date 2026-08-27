import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { GardenDayCell } from "@/features/prayer/rosary/garden/components/GardenDayCell";
import { theme } from "@/theme/tokens";
import type { RosaryGardenDay } from "@/features/prayer/rosary/types";

interface GardenCalendarProps {
  days: RosaryGardenDay[];
  month: number;
  year: number;
}

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export function GardenCalendar({ days, month, year }: GardenCalendarProps) {
  const [calendarWidth, setCalendarWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const gap = theme.spacing[1];
  const cellSize = calendarWidth ? Math.floor((calendarWidth - gap * 6) / 7) : 42;
  const isFullBloom =
    days.filter((day) => day.isEligible).length > 0 &&
    days.filter((day) => day.isEligible).every((day) => day.completed);
  const blanks = Array.from({ length: firstWeekday });

  return (
    <View
      accessibilityLabel="Monthly Rosary Garden calendar"
      onLayout={(event: LayoutChangeEvent) => setCalendarWidth(event.nativeEvent.layout.width)}
      style={[styles.card, isFullBloom && styles.fullBloom]}
    >
      {isFullBloom ? <Text style={styles.fullBloomLabel}>Garden in Full Bloom</Text> : null}
      <View accessible={false} style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <Text key={`${day}-${index}`} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(220)}
        key={`${year}-${month}`}
        style={[styles.grid, { gap }]}
      >
        {blanks.map((_, index) => (
          <View key={`blank-${index}`} style={{ height: cellSize, width: cellSize }} />
        ))}
        {days.map((day) => (
          <GardenDayCell day={day} key={day.date} size={cellSize} />
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
  weekHeader: { flexDirection: "row", marginBottom: theme.spacing[1] },
  weekDay: { ...theme.typography.labelSmall, color: theme.colors.text.muted, flex: 1, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
});
