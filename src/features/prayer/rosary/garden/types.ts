export type FlowerVariant =
  | "redRose"
  | "pinkRose"
  | "whiteLily"
  | "blueFlower"
  | "mixedFlowers"
  | "purpleTulip"
  | "sunflower"
  | "orangeMarigold"
  | "lavender"
  | "whiteDaisy"
  | "pinkPeony"
  | "magentaOrchid"
  | "redPoppy"
  | "blueHydrangea"
  | "orangeHibiscus";

export interface RosaryGardenDay {
  date: string;
  day: number;
  completed: boolean;
  flowerVariant?: FlowerVariant;
  isToday: boolean;
  isFuture: boolean;
  isEligible: boolean;
}

export interface RosaryGardenMonth {
  year: number;
  /** One-based month number, where January is 1. */
  month: number;
  days: RosaryGardenDay[];
}

export interface RosaryGardenStats {
  completedDays: number;
  eligibleDays: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
}

export interface RosaryCompletionApiDay {
  date: string;
  day: number;
  completed: boolean | null;
}

export interface RosaryCompletionApiResponse {
  days: RosaryCompletionApiDay[];
  year: number;
  selectedMonth: number;
  eligibleDays: number;
  completedDays: number;
  yearToDatePercentage: number;
}

export interface RosaryStreakApiResponse {
  currentStreak: number;
  longestStreak: number;
  asOfDate: string;
  timezone: string;
}

export interface UseRosaryGardenOptions {
  userCreatedAt?: string;
  rosaryCompletionDates?: string[];
  selectedYear?: number;
  selectedMonth?: number;
  userTimezone?: string;
}
