import { describe, expect, it } from "vitest";

import {
  buildRosaryGardenMonth,
  calculateStreaks,
  getFlowerVariant,
  isMonthAfter,
  isMonthBefore,
} from "@/data/rosaryGardenUtils";

describe("RosaryGardenScreen", () => {
  it("should render the selected month", () => {
    const month = buildRosaryGardenMonth({
      completionDates: new Set(),
      month: 2,
      today: "2024-02-29",
      userCreatedAt: "2024-01-01",
      year: 2024,
    });

    expect(month.days).toHaveLength(29);
    expect(month.month).toBe(2);
  });

  it("should show a flower for a completed rosary day", () => {
    const month = buildRosaryGardenMonth({
      completionDates: new Set(["2026-05-05"]),
      month: 5,
      today: "2026-05-10",
      userCreatedAt: "2026-01-01",
      year: 2026,
    });

    expect(month.days[4]).toMatchObject({ completed: true, flowerVariant: getFlowerVariant("2026-05-05") });
  });

  it("should show a sprout for an incomplete day", () => {
    const month = buildRosaryGardenMonth({
      completionDates: new Set(),
      month: 5,
      today: "2026-05-10",
      userCreatedAt: "2026-01-01",
      year: 2026,
    });

    expect(month.days[4]).toMatchObject({ completed: false, flowerVariant: undefined, isEligible: true });
  });

  it("should calculate the current streak", () => {
    const streaks = calculateStreaks(new Set(["2026-05-07", "2026-05-08", "2026-05-09"]), "2026-05-10");

    expect(streaks.currentStreak).toBe(3);
  });

  it("should calculate the longest streak", () => {
    const streaks = calculateStreaks(new Set(["2026-05-01", "2026-05-02", "2026-05-04", "2026-05-05", "2026-05-06"]), "2026-05-10");

    expect(streaks.longestStreak).toBe(3);
  });

  it("should not count future days as missed", () => {
    const month = buildRosaryGardenMonth({
      completionDates: new Set(["2026-05-09"]),
      month: 5,
      today: "2026-05-10",
      userCreatedAt: "2026-01-01",
      year: 2026,
    });

    expect(month.days[10]).toMatchObject({ completed: false, isEligible: false, isFuture: true });
  });

  it("should start tracking from the user creation date", () => {
    const month = buildRosaryGardenMonth({
      completionDates: new Set(["2026-05-05", "2026-05-16"]),
      month: 5,
      today: "2026-05-20",
      userCreatedAt: "2026-05-15",
      year: 2026,
    });

    expect(month.days[4]).toMatchObject({ completed: false, isEligible: false });
    expect(month.days[15]).toMatchObject({ completed: true, isEligible: true });
  });

  it("should compare month boundaries for navigation", () => {
    expect(isMonthBefore(2025, 12, 2026, 1)).toBe(true);
    expect(isMonthBefore(2026, 1, 2026, 2)).toBe(true);
    expect(isMonthBefore(2026, 2, 2026, 2)).toBe(false);
    expect(isMonthAfter(2027, 1, 2026, 12)).toBe(true);
    expect(isMonthAfter(2026, 3, 2026, 2)).toBe(true);
    expect(isMonthAfter(2026, 2, 2026, 2)).toBe(false);
  });

  it("should tolerate an invalid creation date and a completed current day", () => {
    const month = buildRosaryGardenMonth({
      completionDates: new Set(["2026-05-10"]),
      month: 5,
      today: "2026-05-10",
      userCreatedAt: "not-a-date",
      year: 2026,
    });
    const streaks = calculateStreaks(new Set(["2026-05-09", "2026-05-10"]), "2026-05-10");

    expect(month.days[0].isEligible).toBe(true);
    expect(streaks.currentStreak).toBe(2);
  });
});
