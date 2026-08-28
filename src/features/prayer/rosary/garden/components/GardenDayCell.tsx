import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { DayCalendarTile } from "@/components/ui";
import { theme } from "@/theme/tokens";
import type { RosaryGardenDay } from "@/features/prayer/rosary/garden/types";

interface GardenDayCellProps {
  day: RosaryGardenDay;
  size: number;
}

export function GardenDayCell({ day, size }: GardenDayCellProps) {
  const reduceMotion = useReducedMotion();
  const bloom = useSharedValue(day.completed ? 1 : 0.96);

  useEffect(() => {
    bloom.value =
      day.completed && !reduceMotion
        ? withSequence(withTiming(0.9, { duration: 160 }), withTiming(1, { duration: 520 }))
        : withTiming(1, { duration: reduceMotion ? 0 : 180 });
  }, [bloom, day.completed, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: bloom.value }] }));
  const state = day.completed
    ? "completed"
    : day.isFuture
      ? "future"
      : day.isToday
        ? "current"
        : day.isEligible
          ? "incomplete"
          : "unavailable";
  const status = day.completed
    ? "Rosary completed."
    : day.isFuture
      ? "Future date."
      : day.isEligible
        ? "Rosary not completed."
        : "Not yet eligible.";
  const dateLabel = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(`${day.date}T12:00:00Z`),
  );

  return (
    <Animated.View style={[styles.cell, { height: size, width: size }, animatedStyle]}>
      <DayCalendarTile
        accessibilityLabel={`${dateLabel}. ${status}`}
        day={day.day}
        flowerVariant={day.flowerVariant}
        state={state}
        style={styles.tile}
        testID={`garden-day-${day.date}`}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: { minWidth: 0 },
  tile: { flex: 1, minHeight: 0, padding: theme.spacing[1] },
});
