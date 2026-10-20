import {
  getConscienceQuestions,
  getConscienceQuestion,
  getLifetimeGlobalLeaderboard,
  getRosaryReminder,
  getWeeklyGlobalLeaderboard,
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

  it("maps the complete examination list from the conscience endpoint", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: [
          { category: "married", id: "question-1", question: "Did I show patience?", title: "Patience" },
          { category: "religious", id: "question-2", question: "Did I keep my vows?", title: "Obedience" },
        ],
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(getConscienceQuestions()).resolves.toEqual([
      { category: "married", id: "question-1", question: "Did I show patience?", title: "Patience" },
      { category: "religious", id: "question-2", question: "Did I keep my vows?", title: "Obedience" },
    ]);
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

  it("requests and maps the top-three weekly global Rosary leaderboard", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: {
          currentUserEntry: {
            isCurrentUser: true,
            period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
            profile: {
              avatar_url: "https://i.pravatar.cc/256?u=testuser",
              countryCode: "US",
              display_name: "Test User",
              saintAvatarId: null,
              title: "Faithful Beginner",
              user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
              username: "testuser",
            },
            rank: 2,
            rosaries_count: 0,
            scope_reference: "global",
            scope_type: "global",
            updated_at: "2026-10-19T18:05:00.000Z",
            user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
          },
          entries: [
            {
              isCurrentUser: false,
              period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
              profile: {
                avatar_url: "https://i.pravatar.cc/256?u=mariasantos",
                countryCode: "MX",
                display_name: "Maria Santos",
                saintAvatarId: "a1000000-0000-4000-8000-000000000005",
                title: "Prayer Champion",
                user_id: "11111111-1111-4111-8111-111111111111",
                username: "mariasantos",
              },
              rank: 1,
              rosaries_count: 0,
              scope_reference: "global",
              scope_type: "global",
              updated_at: "2026-10-19T18:05:00.000Z",
              user_id: "11111111-1111-4111-8111-111111111111",
            },
            {
              isCurrentUser: true,
              period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
              profile: {
                avatar_url: "https://i.pravatar.cc/256?u=testuser",
                countryCode: "US",
                display_name: "Test User",
                saintAvatarId: null,
                title: "Faithful Beginner",
                user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
                username: "testuser",
              },
              rank: 2,
              rosaries_count: 0,
              scope_reference: "global",
              scope_type: "global",
              updated_at: "2026-10-19T18:05:00.000Z",
              user_id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
            },
            {
              isCurrentUser: false,
              period_id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
              profile: {
                avatar_url: "https://i.pravatar.cc/256?u=johnpaul",
                countryCode: "US",
                display_name: "John Paul",
                saintAvatarId: null,
                title: "Scripture Seeker",
                user_id: "22222222-2222-4222-8222-222222222222",
                username: "johnpaul",
              },
              rank: 3,
              rosaries_count: 0,
              scope_reference: "global",
              scope_type: "global",
              updated_at: "2026-10-19T18:05:00.000Z",
              user_id: "22222222-2222-4222-8222-222222222222",
            },
          ],
          period: {
            code: "week-2026-W38",
            created_at: "2026-09-14T00:00:00+00:00",
            ends_at: "2026-09-21T00:00:00+00:00",
            finalized_at: null,
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

    await expect(getWeeklyGlobalLeaderboard()).resolves.toMatchObject({
      currentUserEntry: {
        displayName: "Test User",
        isCurrentUser: true,
        rank: 2,
        rosaries: 0,
        userId: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
      },
      entries: [
        {
          displayName: "Maria Santos",
          isCurrentUser: false,
          rank: 1,
          rosaries: 0,
          saintAvatarId: "a1000000-0000-4000-8000-000000000005",
          userId: "11111111-1111-4111-8111-111111111111",
        },
        { displayName: "Test User", isCurrentUser: true, rank: 2 },
        { displayName: "John Paul", isCurrentUser: false, rank: 3 },
      ],
      meta: { limit: 3, offset: 0, total: 3 },
      period: {
        code: "week-2026-W38",
        createdAt: "2026-09-14T00:00:00+00:00",
        endsAt: "2026-09-21T00:00:00+00:00",
        finalizedAt: null,
        id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
        name: "Week of 2026-09-14",
        periodType: "weekly",
        startsAt: "2026-09-14T00:00:00+00:00",
        status: "active",
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/leaderboards?periodType=weekly&scopeType=global&scopeReference=global&limit=3&offset=0",
      {
        headers: { Accept: "application/json", Authorization: "Bearer test-token" },
        method: "GET",
      },
    );
  });

  it("requests and maps the top-ten lifetime global Rosary leaderboard", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: {
          currentUserEntry: null,
          entries: [
            {
              isCurrentUser: false,
              period_id: "lifetime-period",
              profile: {
                avatar_url: null,
                countryCode: "MX",
                display_name: "Lifetime Leader",
                saintAvatarId: null,
                title: "Prayer Champion",
                user_id: "lifetime-leader",
                username: "lifetimeleader",
              },
              rank: 1,
              rosaries_count: 412,
              scope_reference: "global",
              scope_type: "global",
              updated_at: "2026-10-19T15:00:00Z",
              user_id: "lifetime-leader",
            },
          ],
          period: {
            code: "lifetime",
            created_at: "2026-10-19T15:00:00Z",
            ends_at: "2026-10-19T15:00:00Z",
            finalized_at: null,
            id: "lifetime-period",
            name: "Lifetime",
            period_type: "lifetime",
            starts_at: "2024-01-15T12:00:00Z",
            status: "active",
          },
        },
        meta: { limit: 10, offset: 0, total: 1 },
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getLifetimeGlobalLeaderboard()).resolves.toMatchObject({
      currentUserEntry: null,
      entries: [{ countryCode: "MX", displayName: "Lifetime Leader", rank: 1, rosaries: 412 }],
      meta: { limit: 10, offset: 0, total: 1 },
      period: { code: "lifetime", periodType: "lifetime" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/leaderboards?periodType=lifetime&scopeType=global&scopeReference=global&limit=10&offset=0",
      {
        headers: { Accept: "application/json", Authorization: "Bearer test-token" },
        method: "GET",
      },
    );
  });

  it("accepts an empty leaderboard and a null current-user entry", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          currentUserEntry: null,
          entries: [],
          period: {
            code: "lifetime",
            created_at: "2026-10-19T15:00:00Z",
            ends_at: "2026-10-19T15:00:00Z",
            finalized_at: null,
            id: "lifetime-period",
            name: "Lifetime",
            period_type: "lifetime",
            starts_at: "2024-01-15T12:00:00Z",
            status: "active",
          },
        },
        meta: { limit: 10, offset: 0, total: 0 },
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(getLifetimeGlobalLeaderboard()).resolves.toMatchObject({
      currentUserEntry: null,
      entries: [],
      meta: { limit: 10, offset: 0, total: 0 },
    });
  });

  it("rejects a malformed successful global leaderboard response", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: { currentUserEntry: null, entries: [] }, meta: { limit: 3, offset: 0, total: 0 } }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(getWeeklyGlobalLeaderboard()).rejects.toThrow("leaderboard period");
  });

  it("surfaces a global leaderboard endpoint failure instead of manufacturing data", async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 422 })) as unknown as typeof fetch;
    await expect(getLifetimeGlobalLeaderboard()).rejects.toThrow("Unable to load dashboard data (422).");
  });
});
