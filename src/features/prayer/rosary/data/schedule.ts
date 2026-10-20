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

/** Parses an ISO calendar date as local noon so weekday selection never crosses a timezone boundary. */
export function localIsoDateToDate(localIsoDate: string) {
  const [year, month, day] = localIsoDate.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function getTodayRosaryMysteryType(date = new Date()): RosaryMysteryType {
  return mysteryByWeekday[date.getDay()] ?? "joyful";
}

export function getWeekdayLabel(date = new Date(), locale?: string) {
  return date.toLocaleDateString(locale, { weekday: "long" });
}
