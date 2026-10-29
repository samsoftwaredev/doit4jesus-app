import {
  acceptLegalDocuments,
  deleteCurrentUserProfile,
  fetchCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/features/profile/profile.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-access-token"),
}));

const profilePayload = {
  data: {
    avatarUrl: null,
    countryCode: "US",
    countryName: "United States",
    createdAt: "2026-08-22T15:28:02.335433+00:00",
    displayName: "Virgin Mary",
    gender: "male",
    leaderboardVisibility: "public",
    legalAcceptance: {
      accepted: true,
      acceptedAt: "2026-10-27T06:00:00.000Z",
      communityGuidelinesVersion: "2026-10-28",
      grandfathered: false,
      privacyVersion: "2026-10-28",
      required: false,
      termsVersion: "2026-10-28",
    },
    preferredLanguage: "en",
    profileSetup: {
      complete: true,
      completedAt: "2026-08-24T12:00:00.000Z",
      missingFields: [],
      nextStep: null,
    },
    prayerMapVisibility: "aggregated",
    saintAvatarId: "a1000000-0000-4000-8000-000000000002",
    timezone: "America/Chicago",
    title: "Faithful Beginner",
    updatedAt: "2026-08-24T12:00:00.000Z",
    userId: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
    username: "testuser",
  },
};

describe("current profile API", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("GETs and parses the current user profile", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { ...profilePayload.data, gender: "female" } }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchCurrentUserProfile()).resolves.toMatchObject({
      displayName: "Virgin Mary",
      gender: "female",
      userId: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/me", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer test-access-token",
      },
      method: "GET",
    });
  });

  it("POSTs the required confirmations without client-controlled versions", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: profilePayload.data.legalAcceptance }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await expect(acceptLegalDocuments("es")).resolves.toMatchObject({ accepted: true, required: false });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/me/legal-acceptance", {
      body: JSON.stringify({ locale: "es", adultConfirmed: true, usResidentConfirmed: true }),
      headers: {
        Accept: "application/json",
        Authorization: "Bearer test-access-token",
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  });

  it("PATCHes only supplied profile fields", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => profilePayload,
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await updateCurrentUserProfile({
      displayName: "Virgin Mary",
      gender: "male",
      saintAvatarId: "a1000000-0000-4000-8000-000000000002",
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/me", {
      body: JSON.stringify({
        displayName: "Virgin Mary",
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
    expect(result.countryName).toBe("United States");
    expect(result.saintAvatarId).toBe("a1000000-0000-4000-8000-000000000002");
  });

  it("PATCHes the supplied preferred language", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { ...profilePayload.data, preferredLanguage: "es" } }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(updateCurrentUserProfile({ preferredLanguage: "es" })).resolves.toMatchObject({
      preferredLanguage: "es",
    });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/me", {
      body: JSON.stringify({ preferredLanguage: "es" }),
      headers: {
        Accept: "application/json",
        Authorization: "Bearer test-access-token",
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
  });

  it("DELETEs the authenticated user's profile", async () => {
    const fetchMock = jest.fn(async () => ({ ok: true }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(deleteCurrentUserProfile()).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/me", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer test-access-token",
      },
      method: "DELETE",
    });
  });

  it("rejects failed and malformed profile responses", async () => {
    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 503,
    })) as unknown as typeof fetch;

    await expect(fetchCurrentUserProfile()).rejects.toThrow("Unable to load the profile (503).");

    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: { ...profilePayload.data, gender: "unknown" } }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchCurrentUserProfile()).rejects.toThrow("invalid gender");

    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({}),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchCurrentUserProfile()).rejects.toThrow("unexpected response");
  });

  it("rejects missing configuration, invalid fields, and failed updates", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(fetchCurrentUserProfile()).rejects.toThrow("Set EXPO_PUBLIC_API_URL");

    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: { ...profilePayload.data, displayName: 42 } }),
      ok: true,
    })) as unknown as typeof fetch;
    await expect(fetchCurrentUserProfile()).rejects.toThrow("invalid display name");

    globalThis.fetch = jest.fn(async () => ({
      ok: false,
      status: 422,
    })) as unknown as typeof fetch;
    await expect(updateCurrentUserProfile({ displayName: "Virgin Mary" })).rejects.toThrow(
      "Unable to update the profile (422).",
    );
  });

  it("parses nullable onboarding fields and the server resume step", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          ...profilePayload.data,
          displayName: null,
          gender: null,
          profileSetup: {
            complete: false,
            completedAt: null,
            missingFields: ["displayName", "country"],
            nextStep: "name",
          },
          title: null,
          username: null,
        },
      }),
      ok: true,
    })) as unknown as typeof fetch;

    await expect(fetchCurrentUserProfile()).resolves.toMatchObject({
      displayName: null,
      profileSetup: { complete: false, nextStep: "name" },
      title: null,
      username: null,
    });
  });
});
