import {
  completeOnboarding,
  getCountries,
  getNotificationPreferences,
  getRandomUsernames,
  OnboardingApiError,
  updateNotificationPreferences,
  validateUsername,
} from "./onboarding.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-access-token"),
}));

const preferences = {
  confessionReminder: true,
  dailyRosaryReminder: true,
  eucharisticAdoration: false,
};

const completeProfile = {
  avatarUrl: null,
  countryCode: "US",
  countryName: "United States",
  createdAt: "2026-08-28T12:00:00.000Z",
  displayName: "Virgin Mary",
  gender: "male",
  leaderboardVisibility: "public",
  preferredLanguage: "en",
  profileSetup: {
    complete: true,
    completedAt: "2026-08-28T12:30:00.000Z",
    missingFields: [],
    nextStep: null,
  },
  prayerMapVisibility: "aggregated",
  saintAvatarId: null,
  timezone: "America/Chicago",
  title: "Faithful Beginner",
  updatedAt: "2026-08-28T12:30:00.000Z",
  userId: "user-1",
  username: "VirginMary",
};

function response(payload: unknown, status = 200) {
  return {
    json: async () => payload,
    ok: status >= 200 && status < 300,
    status,
  };
}

describe("onboarding API", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("validates usernames and uses API-provided suggestions", async () => {
    globalThis.fetch = jest.fn(async () =>
      response({
        data: {
          available: false,
          normalizedUsername: "joyful_clare",
          reason: "USERNAME_TAKEN",
          suggestions: ["faithful_clare1842", "monica_dove7391"],
          username: "joyful_clare",
          valid: true,
        },
      }),
    ) as unknown as typeof fetch;

    await expect(validateUsername("joyful_clare")).resolves.toMatchObject({
      available: false,
      reason: "USERNAME_TAKEN",
      suggestions: ["faithful_clare1842", "monica_dove7391"],
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/usernames/validate?username=joyful_clare",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("loads available random usernames through the authenticated onboarding API", async () => {
    const usernames = [
      "faithful_clare1842",
      "monica_dove7391",
      "hopeful_pilgrim2318",
      "dominic_witness4430",
      "joyful_rosary8724",
    ];
    globalThis.fetch = jest.fn(async () => response({ data: { usernames } })) as unknown as typeof fetch;

    await expect(getRandomUsernames()).resolves.toEqual(usernames);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/usernames/random",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer test-access-token",
        }),
        method: "GET",
      }),
    );
  });

  it("rejects an empty random username response", async () => {
    globalThis.fetch = jest.fn(async () => response({ data: { usernames: [] } })) as unknown as typeof fetch;

    await expect(getRandomUsernames()).rejects.toThrow("invalid username suggestions");
  });

  it("searches and paginates countries through the location API", async () => {
    globalThis.fetch = jest.fn(async () =>
      response({
        data: [{ code: "US", latitude: 39.8283, longitude: -98.5795, name: "United States" }],
        meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 },
      }),
    ) as unknown as typeof fetch;

    await expect(getCountries({ q: "united" })).resolves.toMatchObject({
      countries: [{ code: "US", name: "United States" }],
      meta: { hasMore: true, nextOffset: 20 },
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/locations/countries?q=united&limit=20&offset=0",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("loads and partially updates notification preferences", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(response({ data: preferences }))
      .mockResolvedValueOnce(response({ data: { ...preferences, eucharisticAdoration: true } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getNotificationPreferences()).resolves.toEqual(preferences);
    await expect(updateNotificationPreferences({ eucharisticAdoration: true })).resolves.toMatchObject({
      eucharisticAdoration: true,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example.test/api/v1/me/notification-preferences",
      expect.objectContaining({ body: JSON.stringify({ eucharisticAdoration: true }), method: "PATCH" }),
    );
  });

  it("completes onboarding with the required profile fields only", async () => {
    globalThis.fetch = jest.fn(async () => response({ data: { profile: completeProfile } })) as unknown as typeof fetch;
    const payload = {
      countryCode: "US",
      displayName: "Virgin Mary",
      gender: "male" as const,
      username: "VirginMary",
    };

    await expect(completeOnboarding(payload)).resolves.toMatchObject({
      profile: { profileSetup: { complete: true } },
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/onboarding/complete",
      expect.objectContaining({ body: JSON.stringify(payload), method: "POST" }),
    );
  });

  it("preserves HTTP status, reason, and suggestions for conflicts", async () => {
    globalThis.fetch = jest.fn(async () =>
      response({ data: { reason: "USERNAME_TAKEN", suggestions: ["virgin_mary_123"] } }, 409),
    ) as unknown as typeof fetch;

    const error = await validateUsername("virginmary").catch((caught) => caught);
    expect(error).toBeInstanceOf(OnboardingApiError);
    expect(error).toMatchObject({ reason: "USERNAME_TAKEN", status: 409, suggestions: ["virgin_mary_123"] });
  });
});
