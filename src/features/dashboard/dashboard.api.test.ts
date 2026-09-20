import {
  getConscienceQuestion,
  getRosaryReminder,
  getWeeklyGlobalLeaderboard,
  getYearlyGlobalLeaderboard,
} from "./dashboard.api";

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

  it("requests and maps exactly the top-three weekly global leaderboard", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: {
          currentUserEntry: {
            isCurrentUser: true,
            period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
            points: 105,
            prayers_count: 1,
            profile: {
              avatar_url: "https://i.pravatar.cc/256?u=testuser",
              countryCode: "US",
              display_name: "Test User",
              title: "Faithful Beginner",
              user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
              username: "testuser",
            },
            rank: 2,
            rosaries_count: 0,
            scope_reference: "global",
            scope_type: "global",
            scripture_readings_count: 2,
            user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
          },
          entries: [
            {
              isCurrentUser: false,
              period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
              points: 110,
              prayers_count: 0,
              profile: {
                avatar_url: "https://i.pravatar.cc/256?u=mariasantos",
                countryCode: "MX",
                display_name: "Maria Santos",
                title: "Prayer Champion",
                user_id: "11111111-1111-4111-8111-111111111111",
                username: "mariasantos",
              },
              rank: 1,
              rosaries_count: 0,
              scope_reference: "global",
              scope_type: "global",
              scripture_readings_count: 0,
              user_id: "11111111-1111-4111-8111-111111111111",
            },
            {
              isCurrentUser: true,
              period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
              points: 105,
              prayers_count: 1,
              profile: {
                avatar_url: "https://i.pravatar.cc/256?u=testuser",
                countryCode: "US",
                display_name: "Test User",
                title: "Faithful Beginner",
                user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
                username: "testuser",
              },
              rank: 2,
              rosaries_count: 0,
              scope_reference: "global",
              scope_type: "global",
              scripture_readings_count: 2,
              user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
            },
            {
              isCurrentUser: false,
              period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
              points: 40,
              prayers_count: 0,
              profile: {
                avatar_url: "https://i.pravatar.cc/256?u=johnpaul",
                countryCode: "US",
                display_name: "John Paul",
                title: "Scripture Seeker",
                user_id: "22222222-2222-4222-8222-222222222222",
                username: "johnpaul",
              },
              rank: 3,
              rosaries_count: 0,
              scope_reference: "global",
              scope_type: "global",
              scripture_readings_count: 0,
              user_id: "22222222-2222-4222-8222-222222222222",
            },
          ],
          period: {
            code: "week-2026-W38",
            ends_at: "2026-09-21T00:00:00+00:00",
            id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
            name: "Week of 2026-09-14",
            period_type: "weekly",
            starts_at: "2026-09-14T00:00:00+00:00",
            status: "active",
          },
        },
        meta: { limit: 3, offset: 0, total: 3 },
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getWeeklyGlobalLeaderboard()).resolves.toEqual([
      {
        avatarUrl: "https://i.pravatar.cc/256?u=mariasantos",
        displayName: "Maria Santos",
        rank: 1,
        rosaries: 0,
      },
      {
        avatarUrl: "https://i.pravatar.cc/256?u=testuser",
        displayName: "Test User",
        rank: 2,
        rosaries: 0,
      },
      {
        avatarUrl: "https://i.pravatar.cc/256?u=johnpaul",
        displayName: "John Paul",
        rank: 3,
        rosaries: 0,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/leaderboards?periodType=weekly&scopeType=global&scopeReference=global&limit=3",
      {
        headers: { Accept: "application/json", Authorization: "Bearer test-token" },
        method: "GET",
      },
    );
  });

  it("requests and maps exactly the top-ten yearly global leaderboard", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: {
          entries: [
            {
              profile: { avatar_url: null, display_name: "Year Leader" },
              rank: 1,
              rosaries_count: 412,
            },
          ],
        },
        meta: { limit: 10, offset: 0, total: 1 },
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getYearlyGlobalLeaderboard()).resolves.toEqual([
      { avatarUrl: null, displayName: "Year Leader", rank: 1, rosaries: 412 },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/leaderboards?periodType=yearly&scopeType=global&scopeReference=global&limit=10",
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
