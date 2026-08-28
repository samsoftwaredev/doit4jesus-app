import {
  createPrayerIntention,
  fetchApprovedPrayerIntentions,
  fetchMyPrayerIntentions,
  fetchPrayerIntentionPrayerSummary,
  recordPrayerForIntention,
} from "./prayerIntentions.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

const pageMeta = { hasMore: false, limit: 10, nextOffset: null, offset: 0 };
const approvedIntention = {
  approvedAt: "2026-08-20T00:00:00.000Z",
  createdAt: "2026-08-19T00:00:00.000Z",
  creator: { avatarUrl: null, countryCode: "US", displayName: "Maria" },
  description: "For my family.",
  expiresAt: "2026-09-20T00:00:00.000Z",
  id: "intention-1",
  symbol: "candle",
  title: "Family",
};
const myIntention = {
  createdAt: "2026-08-19T00:00:00.000Z",
  description: "For my family.",
  expiresAt: null,
  id: "intention-1",
  reviewedAt: null,
  status: "visible",
  symbol: "candle",
  title: "Family",
};

function successResponse(data: unknown) {
  return { json: async () => data, ok: true, status: 200 };
}

describe("prayer intentions API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
    globalThis.fetch = jest.fn(async (input: string, init?: RequestInit) => {
      if (input.includes("/me/prayer-intentions")) {
        return successResponse({ data: [myIntention], meta: pageMeta });
      }
      if (input.endsWith("/prayers") && init?.method === "POST") {
        return successResponse({
          data: { id: "event-1", intentionId: "intention-1", prayedAt: "2026-08-20T00:00:00.000Z", prayerCount: 4 },
        });
      }
      if (input.endsWith("/prayers")) {
        return successResponse({ data: { ...approvedIntention, prayerCount: 4 } });
      }
      if (init?.method === "POST") {
        return successResponse({ data: myIntention });
      }
      return successResponse({ data: [approvedIntention], meta: pageMeta });
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("loads approved and personal prayer-intention pages with constrained pagination", async () => {
    const [approved, mine] = await Promise.all([
      fetchApprovedPrayerIntentions({ limit: 200, offset: -1 }),
      fetchMyPrayerIntentions({ limit: 0, offset: -1, status: "visible" }),
    ]);

    expect(approved.data[0]).toMatchObject({ creator: { displayName: "Maria" }, title: "Family" });
    expect(mine.data[0]).toMatchObject({ expiresAt: null, reviewedAt: null, status: "visible" });
    const fetchMock = globalThis.fetch as unknown as jest.Mock;
    expect(fetchMock.mock.calls[0][0]).toContain("limit=100&offset=0");
    expect(fetchMock.mock.calls[1][0]).toContain("limit=1&offset=0&status=visible");
  });

  it("creates intentions and records and summarizes their prayers", async () => {
    const created = await createPrayerIntention({
      description: "  For my family. ",
      symbol: "candle",
      title: " Family ",
    });
    const recorded = await recordPrayerForIntention("intention/1");
    const summary = await fetchPrayerIntentionPrayerSummary("intention/1");

    expect(created).toMatchObject({ status: "visible", title: "Family" });
    expect(recorded).toEqual({
      id: "event-1",
      intentionId: "intention-1",
      prayedAt: "2026-08-20T00:00:00.000Z",
      prayerCount: 4,
    });
    expect(summary).toMatchObject({ prayerCount: 4, title: "Family" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/prayer-intentions",
      expect.objectContaining({
        body: JSON.stringify({ description: "For my family.", symbol: "candle", title: "Family" }),
        headers: expect.objectContaining({ Authorization: "Bearer test-token", "Content-Type": "application/json" }),
        method: "POST",
      }),
    );
  });

  it("rejects invalid input, invalid response data, request failures, and missing configuration", async () => {
    await expect(
      createPrayerIntention({ description: "A valid description", symbol: "cross", title: " " }),
    ).rejects.toThrow("Title is required");
    await expect(createPrayerIntention({ description: " ", symbol: "cross", title: "Valid" })).rejects.toThrow(
      "Description is required",
    );

    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: [{ ...myIntention, status: "unknown" }], meta: pageMeta }),
      ok: true,
    })) as unknown as typeof fetch;
    await expect(fetchMyPrayerIntentions()).rejects.toThrow("unsupported intention status");

    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 500 })) as unknown as typeof fetch;
    await expect(fetchApprovedPrayerIntentions()).rejects.toThrow("500");

    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(fetchApprovedPrayerIntentions()).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
  });
});
