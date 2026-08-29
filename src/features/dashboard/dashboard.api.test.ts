import { getConscienceQuestion, getRosaryReminder, getWeeklyGlobalLeaderboard } from "./dashboard.api";

jest.mock("@/features/progress", () => ({
  fetchDashboardProgress: jest.fn(),
  fetchRosaryStats: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

describe("dashboard API", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("maps only the conscience question and reflection fields", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: {
          category: "single",
          commandment: 8,
          description: "Revealing faults unjustly harms others (CCC 2477).",
          id: "question-1",
          question: "Have I seriously damaged someone's reputation?",
          saints: ["St. Francis de Sales"],
        },
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getConscienceQuestion()).resolves.toEqual({
      id: "question-1",
      question: "Have I seriously damaged someone's reputation?",
      reflection: "Revealing faults unjustly harms others (CCC 2477).",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/examination-of-conscience?randomQuestion=true",
      {
        headers: { Accept: "application/json", Authorization: "Bearer test-token" },
        method: "GET",
      },
    );
  });

  it("maps the server-authoritative Rosary reminder", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          deadlineAt: "2026-08-30T05:00:00.000Z",
          serverNow: "2026-08-29T18:14:00.000Z",
          streak: { current: 28, longest: 42, status: "at-risk" },
          todayRosaryCompleted: false,
        },
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(getRosaryReminder()).resolves.toEqual({
      completed: false,
      deadlineAt: "2026-08-30T05:00:00.000Z",
      serverNow: "2026-08-29T18:14:00.000Z",
      streak: { current: 28, longest: 42, status: "at-risk" },
    });
  });

  it("requests and maps exactly the top-five weekly global leaderboard", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: {
          entries: [
            {
              profile: { avatar_url: null, display_name: "St. Michael" },
              rank: 1,
              rosaries_count: 245,
            },
          ],
        },
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getWeeklyGlobalLeaderboard()).resolves.toEqual([
      { avatarUrl: null, displayName: "St. Michael", rank: 1, rosaries: 245 },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/leaderboards?periodType=weekly&scopeType=global&scopeReference=global&limit=5",
      {
        headers: { Accept: "application/json", Authorization: "Bearer test-token" },
        method: "GET",
      },
    );
  });

  it("surfaces an endpoint failure instead of manufacturing dashboard data", async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 })) as unknown as typeof fetch;
    await expect(getRosaryReminder()).rejects.toThrow("Unable to load dashboard data (503).");
  });
});
