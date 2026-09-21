import {
  fetchBadgeCatalog,
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

  it("parses the complete badge catalog with aggregate and requirement progress", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            definition: {
              category: "discipline",
              code: "PRAYER_STREAK",
              description: "Pray on seven consecutive days.",
              icon_url: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/prayer-streak.png",
              id: "definition-streak",
              is_repeatable: false,
              name: "Prayer Streak",
              points_reward: 100,
              rarity: "rare",
              requirement_value: 7,
            },
            earned: [],
            progress: {
              current_value: 3,
              progress_percentage: 42.86,
              required_value: 7,
            },
            requirements: [],
          },
          {
            definition: {
              category: "prayer",
              code: "SHIELD_OF_FAITH",
              description: "Sustain prayer, Scripture, and trust.",
              icon_url: null,
              id: "definition-shield",
              is_repeatable: false,
              name: "Shield of Faith",
              points_reward: 150,
              rarity: "rare",
              requirement_value: 3,
            },
            earned: [{ earned_at: "2026-09-21T01:52:14.618419+00:00", id: "earned-shield" }],
            progress: null,
            requirements: [
              {
                complete: false,
                completedAt: null,
                currentValue: 1,
                definition: {
                  description: "Seven days of prayer.",
                  display_order: 1,
                  id: "requirement-prayer",
                },
                requiredValue: 7,
                updatedAt: "2026-09-21T03:52:14.618419+00:00",
              },
            ],
          },
        ],
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchBadgeCatalog()).resolves.toEqual([
      {
        category: "discipline",
        code: "PRAYER_STREAK",
        description: "Pray on seven consecutive days.",
        earned: [],
        iconUrl: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/prayer-streak.png",
        id: "definition-streak",
        isRepeatable: false,
        name: "Prayer Streak",
        pointsReward: 100,
        progress: { currentValue: 3, percentage: 42.86, requiredValue: 7 },
        rarity: "rare",
        requirementValue: 7,
        requirements: [],
      },
      {
        category: "prayer",
        code: "SHIELD_OF_FAITH",
        description: "Sustain prayer, Scripture, and trust.",
        earned: [{ earnedAt: "2026-09-21T01:52:14.618419+00:00", id: "earned-shield" }],
        iconUrl: null,
        id: "definition-shield",
        isRepeatable: false,
        name: "Shield of Faith",
        pointsReward: 150,
        progress: null,
        rarity: "rare",
        requirementValue: 3,
        requirements: [
          {
            complete: false,
            currentValue: 1,
            description: "Seven days of prayer.",
            displayOrder: 1,
            id: "requirement-prayer",
            requiredValue: 7,
          },
        ],
      },
    ]);
  });

  it("flattens every earned instance and omits locked badges", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            definition: {
              category: "prayer",
              code: "FIRST_ROSARY",
              description: "Prayed your first rosary.",
              icon_url: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/first-rosary.png",
              id: "definition-1",
              is_repeatable: true,
              locked_icon_url: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/locked.png",
              name: "First Rosary",
              points_reward: 25,
              rarity: "common",
              requirement_value: 1,
            },
            earned: [
              { earned_at: "2026-01-10T12:00:00.000Z", id: "earned-1" },
              { earned_at: "2026-02-10T12:00:00.000Z", id: "earned-2" },
            ],
            progress: null,
            requirements: [],
          },
          {
            definition: {
              category: "prayer",
              code: "DEVOTED",
              description: "Prayed 25 rosaries.",
              icon_url: null,
              id: "definition-2",
              is_repeatable: false,
              name: "Devoted",
              points_reward: 100,
              rarity: "rare",
              requirement_value: 25,
            },
            earned: [],
            progress: null,
            requirements: [],
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
        iconUrl: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/first-rosary.png",
        id: "earned-2",
        name: "First Rosary",
      },
      {
        code: "FIRST_ROSARY",
        description: "Prayed your first rosary.",
        earnedAt: "2026-01-10T12:00:00.000Z",
        iconUrl: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/first-rosary.png",
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
              category: "prayer",
              code: "DEVOTED",
              description: "Prayed 25 rosaries.",
              id: "definition-2",
              is_repeatable: false,
              name: "Devoted",
              points_reward: 100,
              rarity: "rare",
              requirement_value: 25,
            },
            earned: [{ earned_at: "2026-02-05T12:00:00.000Z", id: "earned-2" }],
            progress: null,
            requirements: [],
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
