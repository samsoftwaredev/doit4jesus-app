import { addDaysToIsoDate, canNavigateToNextLiturgyDate, getLocalIsoDate } from "@/features/liturgy/liturgy.dates";

describe("daily liturgy date navigation", () => {
  it("moves across calendar boundaries and limits Next to tomorrow", () => {
    expect(getLocalIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getLocalIsoDate(new Date(2026, 0, 2))).toBe("2026-01-02");
    expect(addDaysToIsoDate("2026-08-31", 1)).toBe("2026-09-01");
    expect(addDaysToIsoDate("2027-01-01", -1)).toBe("2026-12-31");
    expect(canNavigateToNextLiturgyDate("2026-08-22", "2026-08-22")).toBe(true);
    expect(canNavigateToNextLiturgyDate("2026-08-23", "2026-08-22")).toBe(false);
  });
});
