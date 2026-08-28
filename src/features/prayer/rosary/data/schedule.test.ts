import { getTodayRosaryMysteryType } from "./schedule";

describe("Rosary mystery schedule", () => {
  it("uses the traditional weekday mystery schedule", () => {
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 24, 12))).toBe("joyful"); // Monday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 25, 12))).toBe("sorrowful"); // Tuesday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 26, 12))).toBe("glorious"); // Wednesday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 27, 12))).toBe("luminous"); // Thursday
    expect(getTodayRosaryMysteryType(new Date(2026, 7, 30, 12))).toBe("glorious"); // Sunday
  });
});
