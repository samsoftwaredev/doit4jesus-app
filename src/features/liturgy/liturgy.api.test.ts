import {
  fetchLiturgyReadings,
  fetchTodayLiturgy,
  fetchCompletedDailyScriptureActivity,
  parseDailyLiturgy,
  recordDailyScriptureCompletion,
} from "./liturgy.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-access-token"),
}));

const testDate = "2026-08-21";
const testCountry = "US";

const liturgyPayload = {
  data: {
    celebration: {
      color: ["WHITE"],
      grade: "MEMORIAL",
      id: "saint-pius-x",
      name: "Memorial of Saint Pius X, Pope",
      season: "ORDINARY_TIME",
    },
    cycles: { psalterWeek: 4, sunday: "A", weekday: "II" },
    date: testDate,
    metadata: { country: testCountry },
    readings: [
      { citation: "Ez 37:1-14", text: "Dry bones, hear the word of the LORD.", type: "FIRST_READING" },
      { citation: "Ps 107", text: "Let them thank the LORD for his mercy.", type: "RESPONSORIAL_PSALM" },
      { citation: "Mt 22:34-40", text: "You shall love the Lord, your God, with all your heart.", type: "GOSPEL" },
    ],
    readingSets: [{ id: "different-set", readings: [{ citation: "Not used", text: "", type: "GOSPEL" }] }],
  },
};

describe("Daily Liturgy API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("normalizes active top-level readings and derives the Gospel excerpt", () => {
    const liturgy = parseDailyLiturgy(liturgyPayload);

    expect(liturgy.celebration.liturgicalColor).toBe("WHITE");
    expect(liturgy.readings).toHaveLength(3);
    expect(liturgy.readings.map((reading) => reading.citation)).toEqual(["Ez 37:1-14", "Ps 107", "Mt 22:34-40"]);
    expect(liturgy.highlightedVerse).toEqual({
      citation: "Mt 22:34-40",
      text: "You shall love the Lord, your God, with all your heart.",
    });
  });

  it("uses a localized citation when the response supplies one", () => {
    const liturgy = parseDailyLiturgy({
      ...liturgyPayload,
      data: {
        ...liturgyPayload.data,
        readings: [
          {
            citation: "Jn 3:16",
            localizedCitation: "Juan 3, 16",
            text: "Porque tanto amó Dios al mundo.",
            type: "GOSPEL",
          },
        ],
      },
    });

    expect(liturgy.readings[0]?.citation).toBe("Juan 3, 16");
    expect(liturgy.highlightedVerse?.citation).toBe("Juan 3, 16");
  });

  it("sends timestamps and an idempotency key when recording the reward", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { replayed: false, xp: { currentLevel: 2, points: 15, totalXp: 365 } } }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      recordDailyScriptureCompletion({
        completedAt: "2026-08-21T21:22:25.672Z",
        country: "US",
        idempotencyKey: "daily-liturgy-key",
        occurredAt: "2026-08-21T21:22:25.672Z",
        passage: "Ez 37:1-14 | Mt 22:34-40",
        quantity: 2,
        date: "2026-08-21",
      }),
    ).resolves.toEqual({ currentLevel: 2, points: 15, replayed: false, totalXp: 365 });

    const [, request] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(request.headers).toMatchObject({
      Authorization: "Bearer test-access-token",
      "Idempotency-Key": "daily-liturgy-key",
    });
    expect(JSON.parse(String(request.body))).toMatchObject({
      activityCode: "SCRIPTURE",
      completedAt: "2026-08-21T21:22:25.672Z",
      countryCode: "US",
      metadata: {
        liturgyDate: "2026-08-21",
        passage: "Ez 37:1-14 | Mt 22:34-40",
        source: "daily_liturgy_completion",
      },
      occurredAt: "2026-08-21T21:22:25.672Z",
      quantity: 2,
    });
  });

  it("finds an already completed daily Scripture activity by its date or passage", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({
        data: [
          {
            activity_code: "SCRIPTURE",
            completed_at: "2026-08-21T21:22:25.672Z",
            metadata: { passage: "Ez 37:1-14 | Mt 22:34-40" },
          },
        ],
        meta: { hasMore: false, limit: 20, nextCursor: null },
      }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      fetchCompletedDailyScriptureActivity({ date: "2026-08-21", passage: "Ez 37:1-14 | Mt 22:34-40" }),
    ).resolves.toEqual({ completedAt: "2026-08-21T21:22:25.672Z" });

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/v1/activities?activityCode=SCRIPTURE", {
      headers: { Accept: "application/json", Authorization: "Bearer test-access-token" },
      method: "GET",
    });
  });

  it("normalizes every supported color and reading type while safely omitting invalid readings", () => {
    for (const color of ["GREEN", "RED", "WHITE", "VIOLET", "ROSE", "BLACK"] as const) {
      const liturgy = parseDailyLiturgy({
        ...liturgyPayload,
        data: { ...liturgyPayload.data, celebration: { ...liturgyPayload.data.celebration, color: [color] } },
      });
      expect(liturgy.celebration.liturgicalColor).toBe(color);
    }

    const liturgy = parseDailyLiturgy({
      ...liturgyPayload,
      data: {
        ...liturgyPayload.data,
        celebration: { ...liturgyPayload.data.celebration, color: [] },
        cycles: { psalterWeek: 9, sunday: "D", weekday: "III" },
        readings: [
          { citation: "Genesis 1", text: "First", type: "FIRST_READING" },
          { citation: "Psalm 1", text: "Psalm", type: "RESPONSORIAL_PSALM" },
          { citation: "Romans 1", text: "Second", type: "SECOND_READING" },
          { citation: "Alleluia", text: "Acclaim", type: "GOSPEL_ACCLAMATION" },
          { citation: "John 1", text: "Gospel", type: "GOSPEL" },
          { citation: "Invalid", text: "Ignored", type: "UNSUPPORTED" },
          null,
        ],
      },
    });

    expect(liturgy.celebration.liturgicalColor).toBe("WHITE");
    expect(liturgy.metadata).toEqual({
      country: "US",
      psalterWeek: undefined,
      sundayCycle: undefined,
      weekdayCycle: undefined,
    });
    expect(liturgy.readings.map((reading) => reading.type)).toEqual([
      "FIRST_READING",
      "RESPONSORIAL_PSALM",
      "SECOND_READING",
      "GOSPEL_ACCLAMATION",
      "GOSPEL",
    ]);
  });

  it("handles unavailable excerpts and validates incomplete payloads", () => {
    const withoutGospel = parseDailyLiturgy({
      ...liturgyPayload,
      data: { ...liturgyPayload.data, readings: [{ citation: "Psalm 1", text: "Sing", type: "RESPONSORIAL_PSALM" }] },
    });
    expect(withoutGospel.highlightedVerse).toBeUndefined();

    const longGospel = "A".repeat(260);
    const withLongGospel = parseDailyLiturgy({
      ...liturgyPayload,
      data: { ...liturgyPayload.data, readings: [{ citation: "John 1", text: longGospel, type: "GOSPEL" }] },
    });
    expect(withLongGospel.highlightedVerse?.text).toHaveLength(238);

    expect(() => parseDailyLiturgy(null)).toThrow("unexpected response");
    expect(() => parseDailyLiturgy({ data: { ...liturgyPayload.data, metadata: null } })).toThrow(
      "incomplete daily liturgy data",
    );
    expect(() =>
      parseDailyLiturgy({
        ...liturgyPayload,
        data: { ...liturgyPayload.data, celebration: { ...liturgyPayload.data.celebration, grade: "" } },
      }),
    ).toThrow("invalid celebration grade");
  });

  it("requests today and dated readings with their supported localized query parameters", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ ...liturgyPayload, data: { ...liturgyPayload.data, readings: [] } }),
      ok: true,
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await fetchTodayLiturgy("es-419");
    await fetchLiturgyReadings("2026-08-21/with space", "es-419");
    expect((fetchMock.mock.calls as unknown as [string][]).map(([url]) => url)).toEqual([
      "http://localhost:3000/api/v1/liturgy/today?country=US&diocese=dallas&locale=es-MX",
      "http://localhost:3000/api/v1/liturgy/readings/2026-08-21%2Fwith%20space?country=US&locale=es-MX",
    ]);
  });

  it("provides safe default reward values", async () => {
    globalThis.fetch = jest.fn(async () => ({
      json: async () => ({ data: { replayed: true, xp: { currentLevel: "two", points: null, totalXp: undefined } } }),
      ok: true,
    })) as unknown as typeof fetch;
    await expect(
      recordDailyScriptureCompletion({
        completedAt: "2026-08-21T21:22:25.672Z",
        country: "US",
        idempotencyKey: "safe-defaults",
        occurredAt: "2026-08-21T21:22:25.672Z",
        passage: "Ez 37:1-14",
        quantity: 1,
        date: "2026-08-21",
      }),
    ).resolves.toEqual({ currentLevel: 0, points: 0, replayed: true, totalXp: 0 });
  });

  it("rejects unavailable, unsuccessful, and malformed network responses", async () => {
    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 })) as unknown as typeof fetch;
    await expect(fetchTodayLiturgy("en-US")).rejects.toThrow("Unable to load daily liturgy (503)");

    globalThis.fetch = jest.fn(async () => ({ json: async () => ({ data: {} }), ok: true })) as unknown as typeof fetch;
    await expect(
      recordDailyScriptureCompletion({
        completedAt: "2026-08-21T21:22:25.672Z",
        country: "US",
        idempotencyKey: "bad-reward",
        occurredAt: "2026-08-21T21:22:25.672Z",
        passage: "Ez 37:1-14",
        quantity: 1,
        date: "2026-08-21",
      }),
    ).rejects.toThrow("unexpected reward response");

    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(fetchTodayLiturgy("en-US")).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
  });

  it("handles defensive parser fallbacks and a failed Scripture completion request", async () => {
    const split = jest.spyOn(String.prototype, "split").mockReturnValueOnce([] as string[]);
    try {
      expect(
        parseDailyLiturgy({
          ...liturgyPayload,
          data: { ...liturgyPayload.data, readings: [{ citation: "John 1", text: "Gospel", type: "GOSPEL" }] },
        }).highlightedVerse,
      ).toBeUndefined();
    } finally {
      split.mockRestore();
    }

    expect(() =>
      parseDailyLiturgy({
        data: { ...liturgyPayload.data, celebration: null, cycles: null, readings: null },
      }),
    ).toThrow("incomplete daily liturgy data");
    expect(
      parseDailyLiturgy({
        ...liturgyPayload,
        data: { ...liturgyPayload.data, celebration: { ...liturgyPayload.data.celebration, color: "RED" } },
      }).celebration.liturgicalColor,
    ).toBe("WHITE");

    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 })) as unknown as typeof fetch;
    await expect(
      recordDailyScriptureCompletion({
        completedAt: "2026-08-21T21:22:25.672Z",
        country: "US",
        idempotencyKey: "failed-completion",
        occurredAt: "2026-08-21T21:22:25.672Z",
        passage: "Ez 37:1-14",
        quantity: 1,
        date: "2026-08-21",
      }),
    ).rejects.toThrow("Unable to record daily Scripture completion (503)");
  });
});
