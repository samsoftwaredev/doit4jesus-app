import { getGlobalRosaryStats } from "./globalRosaryStats.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

describe("global Rosary statistics API", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("loads the authenticated global total with a nullable current-user contribution", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { currentUserContribution: null, totalRosariesPrayed: 26 } }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getGlobalRosaryStats()).resolves.toEqual({
      currentUserContribution: null,
      totalRosariesPrayed: 26,
    });
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.test/api/v1/rosary/stats", {
      headers: { Accept: "application/json", Authorization: "Bearer test-token" },
      method: "GET",
    });
  });

  it("preserves the current user's Rosary count and global percentage", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          currentUserContribution: { percentage: 96.1538, rosariesPrayed: 25 },
          totalRosariesPrayed: 26,
        },
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(getGlobalRosaryStats()).resolves.toEqual({
      currentUserContribution: { percentage: 96.1538, rosariesPrayed: 25 },
      totalRosariesPrayed: 26,
    });
  });

  it.each([
    { currentUserContribution: 4, totalRosariesPrayed: 26 },
    { currentUserContribution: { percentage: "96.1538", rosariesPrayed: 25 }, totalRosariesPrayed: 26 },
    { currentUserContribution: { percentage: 96.1538, rosariesPrayed: "25" }, totalRosariesPrayed: 26 },
    { currentUserContribution: null, totalRosariesPrayed: "26" },
  ])("rejects malformed statistics payloads", async (data) => {
    globalThis.fetch = jest.fn(async () => ({ json: async () => ({ data }), ok: true })) as unknown as typeof fetch;

    await expect(getGlobalRosaryStats()).rejects.toThrow("invalid global Rosary statistics");
  });

  it("surfaces an endpoint failure", async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 })) as unknown as typeof fetch;

    await expect(getGlobalRosaryStats()).rejects.toThrow("Unable to load global Rosary statistics (503).");
  });
});
