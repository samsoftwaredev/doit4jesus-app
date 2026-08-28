import {
  completeOnboarding,
  getCities,
  getCountries,
  getNotificationPreferences,
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
  cityId: "city-austin",
  cityName: "Austin",
  countryCode: "US",
  countryName: "United States",
  createdAt: "2026-08-28T12:00:00.000Z",
  displayName: "Samuel Ruiz",
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
  state: "Texas",
  timezone: "America/Chicago",
  title: "Faithful Beginner",
  updatedAt: "2026-08-28T12:30:00.000Z",
  userId: "user-1",
  username: "SamuelR",
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

  it("searches cities within the authoritative country code", async () => {
    globalThis.fetch = jest.fn(async () =>
      response({
        data: [
          {
            countryCode: "US",
            id: "city-austin",
            latitude: 30.26715,
            longitude: -97.74306,
            name: "Austin",
            regionName: "Texas",
            timezone: "America/Chicago",
          },
        ],
        meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 },
      }),
    ) as unknown as typeof fetch;

    await expect(getCities({ countryCode: "US", q: "aus" })).resolves.toMatchObject({
      cities: [{ countryCode: "US", id: "city-austin", name: "Austin" }],
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/locations/cities?countryCode=US&q=aus&limit=20&offset=0",
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

  it("transactionally completes onboarding with the full payload", async () => {
    globalThis.fetch = jest.fn(async () =>
      response({ data: { notificationPreferences: preferences, profile: completeProfile } }),
    ) as unknown as typeof fetch;
    const payload = {
      cityId: "city-austin",
      countryCode: "US",
      displayName: "Samuel Ruiz",
      gender: "male" as const,
      notificationPreferences: preferences,
      username: "SamuelR",
    };

    await expect(completeOnboarding(payload)).resolves.toMatchObject({
      notificationPreferences: preferences,
      profile: { profileSetup: { complete: true } },
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/onboarding/complete",
      expect.objectContaining({ body: JSON.stringify(payload), method: "POST" }),
    );
  });

  it("preserves HTTP status, reason, and suggestions for conflicts", async () => {
    globalThis.fetch = jest.fn(async () =>
      response({ data: { reason: "USERNAME_TAKEN", suggestions: ["samuel_123"] } }, 409),
    ) as unknown as typeof fetch;

    const error = await validateUsername("samuel").catch((caught) => caught);
    expect(error).toBeInstanceOf(OnboardingApiError);
    expect(error).toMatchObject({ reason: "USERNAME_TAKEN", status: 409, suggestions: ["samuel_123"] });
  });
});
