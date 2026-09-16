import {
  fetchDashboardProgress,
  fetchEarnedBadges,
  fetchLevels,
  fetchRecentRosaryActivities,
  fetchRosaryStats,
  fetchUserProgress,
} from "./progress.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

const progressPayload = {
  data: {
    currentLevel: {
      code: "disciple",
      level_number: 3,
      minimum_total_xp: 750,
      name: "Disciple",
    },
    lastActivityAt: "2026-08-26T14:30:00.000Z",
    levelProgressPercentage: 100,
    lifetimePoints: 4320,
    nextLevel: {
      code: "witness",
      level_number: 4,
      minimum_total_xp: 1500,
      name: "Witness",
    },
    totalXp: 4320,
    updatedAt: "2026-08-26T14:30:00.000Z",
    version: 18,
    weeklyPoints: 240,
    xpIntoCurrentLevel: 3570,
    xpRequiredForNextLevel: 750,
    yearlyPoints: 1250,
  },
};

describe("progress API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("fetches authenticated Rosary stats", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { rosariesPrayed: 25 } }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchRosaryStats()).resolves.toEqual({ rosariesPrayed: 25 });
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/me/rosary/stats", {
      headers: { Accept: "application/json", Authorization: "Bearer test-token" },
      method: "GET",
    });
  });

  it("uses lifetime points from the authenticated progress endpoint", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => progressPayload,
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchUserProgress()).resolves.toMatchObject({
      currentLevel: { levelNumber: 3, minimumTotalXp: 750, name: "Disciple" },
      lifetimePoints: 4320,
      nextLevel: { levelNumber: 4, name: "Witness" },
    });
  });

  it("maps only the dashboard progress fields and safely accepts a missing current level", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: { currentLevel: null, lifetimePoints: 4320 } }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchDashboardProgress()).resolves.toEqual({
      currentLevel: null,
      levelProgressPercentage: null,
      lifetimePoints: 4320,
      nextLevel: null,
      totalXp: null,
      weeklyPoints: null,
      xpIntoCurrentLevel: null,
      xpRequiredForNextLevel: null,
      yearlyPoints: null,
    });
  });

  it("loads the authenticated level catalogue used for the next-level goal", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            code: "faithful",
            level_number: 4,
            minimum_total_xp: 6000,
            name: "Faithful",
          },
        ],
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchLevels()).resolves.toEqual([
      { code: "faithful", levelNumber: 4, minimumTotalXp: 6000, name: "Faithful" },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/levels", {
      headers: { Accept: "application/json", Authorization: "Bearer test-token" },
      method: "GET",
    });
  });

  it("loads authenticated Rosary activity records without treating the page size as a total", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            activity_code: "ROSARY",
            completed_at: "2026-08-29T15:25:00.000Z",
            id: "activity-uuid",
            occurred_at: "2026-08-29T15:00:00.000Z",
            quantity: 1,
          },
        ],
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchRecentRosaryActivities()).resolves.toEqual([
      {
        completedAt: "2026-08-29T15:25:00.000Z",
        id: "activity-uuid",
        occurredAt: "2026-08-29T15:00:00.000Z",
        quantity: 1,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/activities?limit=20&activityCode=ROSARY", {
      headers: { Accept: "application/json", Authorization: "Bearer test-token" },
      method: "GET",
    });
  });

  it("supports nullable optional progress fields", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          ...progressPayload.data,
          lastActivityAt: null,
          nextLevel: null,
        },
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchUserProgress()).resolves.toMatchObject({
      lastActivityAt: null,
      nextLevel: null,
    });
  });

  it("flattens every earned instance and omits locked badges", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            definition: {
              code: "FIRST_ROSARY",
              description: "Prayed your first rosary.",
              icon_url: "/badges/first-rosary.png",
              id: "definition-1",
              name: "First Rosary",
            },
            earned: [
              { earned_at: "2026-01-10T12:00:00.000Z", id: "earned-1" },
              { earned_at: "2026-02-10T12:00:00.000Z", id: "earned-2" },
            ],
          },
          {
            definition: {
              code: "DEVOTED",
              description: "Prayed 25 rosaries.",
              icon_url: null,
              id: "definition-2",
              name: "Devoted",
            },
            earned: [],
          },
        ],
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchEarnedBadges()).resolves.toEqual([
      {
        code: "FIRST_ROSARY",
        description: "Prayed your first rosary.",
        earnedAt: "2026-02-10T12:00:00.000Z",
        iconUrl: "/badges/first-rosary.png",
        id: "earned-2",
        name: "First Rosary",
      },
      {
        code: "FIRST_ROSARY",
        description: "Prayed your first rosary.",
        earnedAt: "2026-01-10T12:00:00.000Z",
        iconUrl: "/badges/first-rosary.png",
        id: "earned-1",
        name: "First Rosary",
      },
    ]);
  });

  it("treats a missing badge image as optional", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            definition: {
              code: "DEVOTED",
              description: "Prayed 25 rosaries.",
              id: "definition-2",
              name: "Devoted",
            },
            earned: [{ earned_at: "2026-02-05T12:00:00.000Z", id: "earned-2" }],
          },
        ],
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchEarnedBadges()).resolves.toEqual([expect.objectContaining({ iconUrl: null, name: "Devoted" })]);
  });

  it("rejects malformed or unsuccessful responses", async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 401 })) as unknown as typeof fetch;
    await expect(fetchEarnedBadges()).rejects.toThrow("401");

    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: { rosariesPrayed: "25" } }),
      ok: true,
    })) as unknown as typeof fetch;
    await expect(fetchRosaryStats()).rejects.toThrow("Rosaries prayed");
  });

  it("requires an API URL", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(fetchRosaryStats()).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
  });
});
