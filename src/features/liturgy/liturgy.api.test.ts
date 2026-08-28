import { parseDailyLiturgy, recordDailyScriptureCompletion } from "./liturgy.api";

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
      }),
    ).resolves.toEqual({ currentLevel: 2, points: 15, replayed: false, totalXp: 365 });

    const [, request] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(request.headers).toMatchObject({
      Authorization: "Bearer test-access-token",
      "Idempotency-Key": "daily-liturgy-key",
    });
    expect(JSON.parse(String(request.body))).toMatchObject({
      activityCode: "PRAYER",
      completedAt: "2026-08-21T21:22:25.672Z",
      countryCode: "US",
      occurredAt: "2026-08-21T21:22:25.672Z",
    });
  });
});
