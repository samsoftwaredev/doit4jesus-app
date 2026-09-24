import { fetchScreenData } from "./screenData.api";

const fetchMock = jest.fn();

jest.mock("@/lib/supabase", () => ({ getSupabaseAccessToken: jest.fn().mockResolvedValue("access-token") }));

describe("fetchScreenData", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
  });

  it("authenticates the aggregate request and retains a section's data, metadata, and safe error", async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        data: {
          screen: "home",
          sections: { progress: { data: { lifetimePoints: 12 }, meta: { source: "fresh" } }, rosaryStats: null },
        },
        meta: {
          errors: {
            rosaryStats: { code: "UPSTREAM_UNAVAILABLE", message: "Rosary statistics are temporarily unavailable." },
          },
        },
      }),
      ok: true,
    });

    await expect(
      fetchScreenData({ country: "US", diocese: "dallas", locale: "en-US", screen: "home" }),
    ).resolves.toEqual({
      errors: {
        rosaryStats: { code: "UPSTREAM_UNAVAILABLE", message: "Rosary statistics are temporarily unavailable." },
      },
      screen: "home",
      sections: { progress: { data: { lifetimePoints: 12 }, meta: { source: "fresh" } }, rosaryStats: null },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/screen-data?screen=home&country=US&diocese=dallas&locale=en-US",
      expect.objectContaining({
        headers: { Accept: "application/json", Authorization: "Bearer access-token" },
        method: "GET",
      }),
    );
  });

  it("rejects a malformed aggregate envelope", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ data: { screen: "home" } }), ok: true });
    await expect(fetchScreenData({ screen: "home" })).rejects.toThrow("invalid sections");
  });
});
