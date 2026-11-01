import {
  ChurchApiError,
  createChurchSubscription,
  deleteChurchSubscription,
  getChurchDetails,
  getChurchSubscriptions,
  getUpcomingChurchServices,
  resolvePostalCode,
  searchChurches,
  updateChurchSubscription,
} from "./churches.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "church-access-token"),
}));

const church = {
  addressLine1: "203 E 10th St",
  addressLine2: null,
  city: "Austin",
  countryCode: "US",
  diocese: { id: "diocese-austin", name: "Diocese of Austin" },
  directoryVerificationStatus: "verified",
  distanceMiles: 1.4,
  id: "church-1",
  latitude: 30.273,
  longitude: -97.739,
  name: "St. Mary Cathedral",
  postalCode: "78701",
  regionName: "Texas",
  scheduleStatus: "verified",
  timezone: "America/Chicago",
};

describe("church API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
    jest.restoreAllMocks();
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("resolves a ZIP into normalized cities, coordinates, and dioceses", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          cities: [
            {
              isPrimary: true,
              label: "Garland city",
              name: "Garland",
              overlapPercent: 99.983294,
              regionCode: "TX",
              status: "current_census_place",
            },
            {
              isPrimary: false,
              label: "Sachse city",
              name: "Sachse",
              overlapPercent: 0.016706,
              regionCode: "TX",
              status: "current_census_place",
            },
          ],
          dioceseStatus: "approximate_centroid",
          dioceses: [
            {
              id: "c5000000-0000-4000-8000-000000000002",
              matchStatus: "approximate_centroid",
              name: "Diocese of Dallas",
            },
          ],
          latitude: 32.928902,
          longitude: -96.619782,
          postalCode: "75040",
          primaryCity: "Garland",
          regionCodes: ["TX"],
          timezone: "America/Chicago",
        },
      }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;

    await expect(resolvePostalCode("75040")).resolves.toEqual({
      cities: [
        {
          isPrimary: true,
          label: "Garland city",
          name: "Garland",
          overlapPercent: 99.983294,
          regionCode: "TX",
          status: "current_census_place",
        },
        {
          isPrimary: false,
          label: "Sachse city",
          name: "Sachse",
          overlapPercent: 0.016706,
          regionCode: "TX",
          status: "current_census_place",
        },
      ],
      dioceseStatus: "approximate_centroid",
      dioceses: [
        {
          id: "c5000000-0000-4000-8000-000000000002",
          matchStatus: "approximate_centroid",
          name: "Diocese of Dallas",
        },
      ],
      latitude: 32.928902,
      longitude: -96.619782,
      postalCode: "75040",
      primaryCity: "Garland",
      regionCodes: ["TX"],
      timezone: "America/Chicago",
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/locations/postal-codes/75040",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer church-access-token" }),
      }),
    );
  });

  it("encodes every supported nearby-search filter and normalizes pagination", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: [church], meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 } }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;

    const page = await searchChurches({
      city: "Austin & Central",
      country: "US",
      diocese: "Austin",
      dioceseId: "diocese-austin",
      limit: 20,
      offset: 0,
      postalCode: "78701",
      q: "Saint Mary",
      radiusMiles: 25,
    });

    expect(page.data[0]).toMatchObject({
      dioceseId: "diocese-austin",
      directoryVerificationStatus: "verified",
      name: "St. Mary Cathedral",
      scheduleStatus: "verified",
    });
    expect(page.meta).toEqual({ hasMore: true, limit: 20, nextOffset: 20, offset: 0 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/churches?postalCode=78701&radiusMiles=25&dioceseId=diocese-austin&q=Saint+Mary&country=US&city=Austin+%26+Central&diocese=Austin&limit=20&offset=0",
      expect.any(Object),
    );
  });

  it("supports search anywhere with q and no ZIP", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: [], meta: { hasMore: false, limit: 20, nextOffset: null, offset: 0 } }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;

    await searchChurches({ q: "Cathedral", limit: 20, offset: 0 });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/churches?q=Cathedral&limit=20&offset=0",
      expect.any(Object),
    );
  });

  it("parses church details, service schedules, and live status", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: {
          ...church,
          isActive: true,
          liveStatus: { adorationInProgress: false, confessionInProgress: true, massInProgress: false },
          serviceTimes: [
            { endTime: "09:00", id: "service-1", serviceType: "mass", startTime: "08:00", weekday: "sunday" },
          ],
        },
      }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;

    await expect(getChurchDetails("church-1")).resolves.toMatchObject({
      id: "church-1",
      isActive: true,
      liveStatus: { confessionInProgress: true },
      serviceTimes: [{ serviceType: "mass", weekday: "sunday" }],
    });
  });

  it("normalizes nested subscription addresses and subscription-level schedule statuses", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            church: {
              address: {
                city: "Austin",
                countryCode: "US",
                line1: "203 E 10th St",
                line2: null,
                postalCode: "78701",
                regionName: "Texas",
              },
              directoryVerificationStatus: "verified",
              id: "c6000000-0000-4000-8000-000000000001",
              latitude: 30.270833,
              longitude: -97.741389,
              name: "St. Mary Cathedral",
              timezone: "America/Chicago",
            },
            createdAt: "2026-10-31T22:25:30.001557+00:00",
            id: "cb000000-0000-4000-8000-000000000001",
            notificationTime: "08:00",
            notificationWeekdays: ["sunday", "wednesday"],
            scheduleStatus: "verified",
            scheduleVerifiedAt: "2026-10-31T22:25:30.001557+00:00",
            serviceTypes: ["mass", "confession"],
            updatedAt: "2026-10-31T22:25:30.001557+00:00",
          },
          {
            church: {
              address: {
                city: "Austin",
                countryCode: "US",
                line1: "100 Candidate Way",
                line2: null,
                postalCode: "78701",
                regionName: "Texas",
              },
              directoryVerificationStatus: "candidate",
              id: "c6000000-0000-4000-8000-000000000005",
              latitude: 30.274,
              longitude: -97.746,
              name: "Holy Family Catholic Church",
              timezone: "America/Chicago",
            },
            createdAt: "2026-10-31T22:25:30.001557+00:00",
            id: "cb000000-0000-4000-8000-000000000002",
            notificationTime: "08:00",
            notificationWeekdays: ["saturday"],
            scheduleStatus: "pending",
            scheduleVerifiedAt: null,
            serviceTypes: ["mass"],
            updatedAt: "2026-10-31T22:25:30.001557+00:00",
          },
        ],
      }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;

    await expect(getChurchSubscriptions()).resolves.toEqual([
      expect.objectContaining({
        church: expect.objectContaining({
          addressLine1: "203 E 10th St",
          addressLine2: null,
          city: "Austin",
          countryCode: "US",
          directoryVerificationStatus: "verified",
          postalCode: "78701",
          regionName: "Texas",
          scheduleStatus: "verified",
        }),
        churchId: "c6000000-0000-4000-8000-000000000001",
        scheduleReady: true,
      }),
      expect.objectContaining({
        church: expect.objectContaining({
          addressLine1: "100 Candidate Way",
          directoryVerificationStatus: "candidate",
          scheduleStatus: "pending",
        }),
        churchId: "c6000000-0000-4000-8000-000000000005",
        scheduleReady: false,
      }),
    ]);
  });

  it("lists subscriptions and upcoming timezone-aware service occurrences", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({
          data: [
            {
              church,
              churchId: "church-1",
              notificationWeekdays: ["sunday", "wednesday"],
              scheduleReady: true,
              serviceTypes: ["mass", "confession"],
            },
          ],
        }),
        ok: true,
        status: 200,
      })
      .mockResolvedValueOnce({
        json: async () => ({
          data: [
            {
              church: {
                id: "c6000000-0000-4000-8000-000000000001",
                name: "St. Mary Cathedral",
              },
              endsAt: "2026-11-05T02:00:00+00:00",
              localDate: "2026-11-04",
              localEndTime: "20:00",
              localStartTime: "18:00",
              occurrenceId: "c7000000-0000-4000-8000-000000000004:2026-11-04",
              serviceTimeId: "c7000000-0000-4000-8000-000000000004",
              serviceType: "adoration",
              startsAt: "2026-11-05T00:00:00+00:00",
              timezone: "America/Chicago",
            },
          ],
          meta: { hasMore: false, limit: 50, nextOffset: null, offset: 0 },
        }),
        ok: true,
        status: 200,
      });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(getChurchSubscriptions()).resolves.toEqual([
      expect.objectContaining({ churchId: "church-1", scheduleReady: true, serviceTypes: ["mass", "confession"] }),
    ]);
    await expect(getUpcomingChurchServices({ days: 7, limit: 50, offset: 0 })).resolves.toEqual({
      data: [
        expect.objectContaining({
          churchId: "c6000000-0000-4000-8000-000000000001",
          churchName: "St. Mary Cathedral",
          endsAt: "2026-11-05T02:00:00+00:00",
          id: "c7000000-0000-4000-8000-000000000004:2026-11-04",
          serviceType: "adoration",
          startsAt: "2026-11-05T00:00:00+00:00",
          timezone: "America/Chicago",
        }),
      ],
      meta: { hasMore: false, limit: 50, nextOffset: null, offset: 0 },
    });
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://api.example.test/api/v1/me/church-services/upcoming?days=7&limit=50&offset=0",
      expect.any(Object),
    );
  });

  it("encodes optional upcoming church and service filters", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: [], meta: { hasMore: false, limit: 10, nextOffset: null, offset: 20 } }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;

    await getUpcomingChurchServices({
      churchId: "church/one",
      days: 31,
      limit: 10,
      offset: 20,
      serviceType: "adoration",
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/church-services/upcoming?days=31&limit=10&offset=20&churchId=church%2Fone&serviceType=adoration",
      expect.any(Object),
    );
  });

  it("creates, updates, and deletes subscriptions with replacement payloads", async () => {
    const fetchMock = jest.fn(async (_url: string, request?: RequestInit) => ({
      json: async () =>
        request?.method === "DELETE"
          ? undefined
          : {
              data: {
                church,
                churchId: "church-1",
                notificationWeekdays: ["sunday"],
                scheduleReady: true,
                serviceTypes: ["mass"],
              },
            },
      ok: true,
      status: request?.method === "DELETE" ? 204 : 200,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const preferences = { notificationWeekdays: ["sunday"] as const, serviceTypes: ["mass"] as const };

    await createChurchSubscription({ churchId: "church-1", ...preferences });
    await updateChurchSubscription("church-1", preferences);
    await deleteChurchSubscription("church-1");

    expect(fetchMock.mock.calls.map(([url, request]) => [url, request?.method, request?.body])).toEqual([
      [
        "https://api.example.test/api/v1/me/church-subscriptions",
        "POST",
        JSON.stringify({ churchId: "church-1", ...preferences }),
      ],
      ["https://api.example.test/api/v1/me/church-subscriptions/church-1", "PATCH", JSON.stringify(preferences)],
      ["https://api.example.test/api/v1/me/church-subscriptions/church-1", "DELETE", undefined],
    ]);
  });

  it("surfaces backend status and code through ChurchApiError", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ error: { code: "CHURCH_SUBSCRIPTION_LIMIT", message: "Only three churches are allowed." } }),
      ok: false,
      status: 409,
    })) as unknown as typeof fetch;

    await expect(
      createChurchSubscription({ churchId: "church-4", notificationWeekdays: ["friday"], serviceTypes: ["mass"] }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<ChurchApiError>>({ code: "CHURCH_SUBSCRIPTION_LIMIT", status: 409 }),
    );
  });

  it.each([
    [401, "AUTHENTICATION_REQUIRED"],
    [404, "CHURCH_NOT_FOUND"],
  ])("preserves a %s response and backend code", async (status, code) => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ error: { code, message: "Request failed." } }),
      ok: false,
      status,
    })) as unknown as typeof fetch;

    await expect(getChurchDetails("missing-church")).rejects.toEqual(
      expect.objectContaining<Partial<ChurchApiError>>({ code, status }),
    );
  });

  it("preserves network failures for retry handling", async () => {
    globalThis.fetch = jest.fn(async () => {
      throw new TypeError("Network request failed");
    }) as unknown as typeof fetch;

    await expect(searchChurches({ q: "Cathedral" })).rejects.toThrow("Network request failed");
  });

  it("rejects malformed payloads and missing configuration", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: {} }),
      ok: true,
      status: 200,
    })) as unknown as typeof fetch;
    await expect(getChurchSubscriptions()).rejects.toThrow("unexpected response");

    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(resolvePostalCode("78701")).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
  });
});
