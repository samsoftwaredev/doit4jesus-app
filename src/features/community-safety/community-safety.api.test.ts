import { blockAccount, fetchBlockedAccounts, reportContent, unblockAccount } from "./community-safety.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

describe("community safety API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
    globalThis.fetch = jest.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/blocks") && !init?.method) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: [{ userId: "user-2", displayName: "John", username: "john" }] }),
        };
      }
      return { ok: true, status: init?.method === "DELETE" ? 204 : 201, json: async () => ({ data: {} }) };
    }) as unknown as typeof fetch;
  });

  afterEach(() => delete process.env.EXPO_PUBLIC_API_URL);

  it("submits categorized reports with an authenticated bearer token", async () => {
    await reportContent({ targetType: "event", targetId: "event-1", reason: "privacy", details: "Private address" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/reports",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          targetType: "event",
          targetId: "event-1",
          reason: "privacy",
          details: "Private address",
        }),
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      }),
    );
  });

  it("blocks, lists, and unblocks accounts", async () => {
    await blockAccount("user-2");
    expect(await fetchBlockedAccounts()).toEqual([expect.objectContaining({ userId: "user-2" })]);
    await unblockAccount("user-2");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/blocks/user-2",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
