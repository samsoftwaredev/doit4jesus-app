import { getTodayRosaryMysteryType, localIsoDateToDate } from "./schedule";

describe("Rosary mystery schedule", () => {
  it("uses the traditional weekday mystery schedule", () => {
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 24, 12))).toBe("joyful"); // Monday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 25, 12))).toBe("sorrowful"); // Tuesday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 26, 12))).toBe("glorious"); // Wednesday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 27, 12))).toBe("luminous"); // Thursday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 30, 12))).toBe("glorious"); // Sunday
  });

  it("parses a local calendar date at noon without crossing a weekday boundary", () => {
    const date = localIsoDateToDate("2026-08-24");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(7);
    expect(date.getDate()).toBe(24);
    expect(date.getHours()).toBe(12);
    expect(getTodayRosaryMysteryType(date)).toBe("joyful");
  });
});
