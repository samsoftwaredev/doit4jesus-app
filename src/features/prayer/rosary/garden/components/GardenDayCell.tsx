import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { DayCalendarTile } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import type { RosaryGardenDay } from "@/features/prayer/rosary/garden/types";

interface GardenDayCellProps {
  day: RosaryGardenDay;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function GardenDayCell({ day }: GardenDayCellProps) {
  const styles = useThemedStyles(styleSheet);
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
    ? "completed"
    : day.isFuture
      ? "future date"
      : day.isEligible
        ? "not completed"
        : "not yet eligible";
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${day.date}T12:00:00Z`));

  return (
    <Animated.View style={[styles.cell, animatedStyle]}>
      <DayCalendarTile
        accessibilityLabel={`${dateLabel}, ${status}`}
        day={day.day}
        flowerVariant={day.flowerVariant}
        state={state}
        style={styles.tile}
        testID={`garden-day-${day.date}`}
      />
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  cell: { flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" },
  tile: { flex: 1, minHeight: 0, minWidth: 0, padding: theme.spacing[1] },
}));
