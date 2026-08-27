import type { RosaryMysteryType } from "@/features/prayer/rosary/types";

const mysteryByWeekday: Record<number, RosaryMysteryType> = {
  0: "glorious",
  1: "joyful",
  2: "sorrowful",
  3: "glorious",
  4: "luminous",
  5: "sorrowful",
  6: "joyful",
};

export function getTodayRosaryMysteryType(date = new Date()): RosaryMysteryType {
  return mysteryByWeekday[date.getDay()] ?? "joyful";
}

export function getWeekdayLabel(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: "long" });
}
