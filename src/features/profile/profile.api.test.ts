import { updateCurrentUserProfile } from "@/features/profile/profile.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-access-token"),
}));

const profilePayload = {
  data: {
    avatarUrl: null,
    cityId: "city-austin",
    cityName: "Austin",
    countryCode: "US",
    createdAt: "2026-08-22T15:28:02.335433+00:00",
    displayName: "Samuel Ruiz",
    gender: "male",
    leaderboardVisibility: "public",
    preferredLanguage: "en",
    prayerMapVisibility: "aggregated",
    saintAvatarId: "a1000000-0000-4000-8000-000000000002",
    state: "Texas",
    timezone: "America/Chicago",
    title: "Faithful Beginner",
    updatedAt: "2026-08-24T12:00:00.000Z",
    userId: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
    username: "testuser",
  },
};

describe("current profile API", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("PATCHes only permitted display, gender, and saint fields", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => profilePayload,
      ok: true,
    }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await updateCurrentUserProfile({
      displayName: "Samuel Ruiz",
      gender: "male",
      saintAvatarId: "a1000000-0000-4000-8000-000000000002",
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/me", {
      body: JSON.stringify({
        displayName: "Samuel Ruiz",
        gender: "male",
        saintAvatarId: "a1000000-0000-4000-8000-000000000002",
      }),
      headers: {
        Accept: "application/json",
        Authorization: "Bearer test-access-token",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    expect(result.cityName).toBe("Austin");
    expect(result.saintAvatarId).toBe("a1000000-0000-4000-8000-000000000002");
  });
});
