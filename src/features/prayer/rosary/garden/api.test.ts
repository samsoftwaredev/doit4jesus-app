import { fetchRosaryCompletion, fetchRosaryStreak } from "./api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

describe("Rosary Garden API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  describe("fetchRosaryCompletion", () => {
    it("parses a valid completion response", async () => {
      const payload = {
        data: {
          completedDays: 2,
          days: [
            { completed: true, date: "2026-08-01", day: 1 },
            { completed: false, date: "2026-08-02", day: 2 },
            { completed: null, date: "2026-08-31", day: 31 },
          ],
          eligibleDays: 21,
          selectedMonth: 8,
          year: 2026,
          yearToDatePercentage: 9.52,
        },
      };
      globalThis.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => payload,
      })) as unknown as typeof fetch;

      const result = await fetchRosaryCompletion(2026, 8);

      expect(result.year).toBe(2026);
      expect(result.selectedMonth).toBe(8);
      expect(result.completedDays).toBe(2);
      expect(result.eligibleDays).toBe(21);
      expect(result.days).toHaveLength(3);
      expect(result.days[0]).toEqual({ completed: true, date: "2026-08-01", day: 1 });
    });

    it("sends the year and month as query parameters", async () => {
      const fetchMock = jest.fn(async () => ({
        ok: true,
        json: async () => ({
          data: {
            completedDays: 0,
            days: [],
            eligibleDays: 0,
            selectedMonth: 7,
            year: 2026,
            yearToDatePercentage: 0,
          },
        }),
      }));
      globalThis.fetch = fetchMock as unknown as typeof fetch;

      await fetchRosaryCompletion(2026, 7);

      const [url] = fetchMock.mock.calls[0] as unknown as [string];
      expect(url).toContain("selectedYear=2026");
      expect(url).toContain("selectedMonth=7");
    });

    it("throws when the API returns a non-ok response", async () => {
      globalThis.fetch = jest.fn(async () => ({
        ok: false,
        status: 401,
      })) as unknown as typeof fetch;

      await expect(fetchRosaryCompletion(2026, 8)).rejects.toThrow("401");
    });

    it("throws when EXPO_PUBLIC_API_URL is not set", async () => {
      delete process.env.EXPO_PUBLIC_API_URL;
      await expect(fetchRosaryCompletion(2026, 8)).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
    });

    it("throws when the response payload is malformed", async () => {
      globalThis.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({ data: { days: "not-an-array" } }),
      })) as unknown as typeof fetch;

      await expect(fetchRosaryCompletion(2026, 8)).rejects.toThrow();
    });
  });

  describe("fetchRosaryStreak", () => {
    it("parses a valid streak response", async () => {
      const payload = {
        data: {
          asOfDate: "2026-08-21",
          currentStreak: 5,
          longestStreak: 12,
          timezone: "America/New_York",
        },
      };
      globalThis.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => payload,
      })) as unknown as typeof fetch;

      const result = await fetchRosaryStreak();

      expect(result.currentStreak).toBe(5);
      expect(result.longestStreak).toBe(12);
      expect(result.asOfDate).toBe("2026-08-21");
      expect(result.timezone).toBe("America/New_York");
    });

    it("throws when the streak payload is malformed", async () => {
      globalThis.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({ data: { currentStreak: "not-a-number" } }),
      })) as unknown as typeof fetch;

      await expect(fetchRosaryStreak()).rejects.toThrow();
    });
  });
});
