import { fireEvent, render, screen } from "@testing-library/react-native";

import {
  parseDailyLiturgy,
  recordDailyScriptureCompletion,
} from "@/features/liturgy/liturgy.api";
import {
  loadDailyReadingProgress,
  markDailyReadingComplete,
  recordRewardOnProgress,
} from "@/features/liturgy/liturgy.progress";
import { CompletionToast } from "@/features/liturgy/components";
import { ScriptureReadingsCard } from "@/features/liturgy/components";

const testDate = "2026-08-21";
const testCountry = "US";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => values.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
  };
}

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

describe("daily liturgy data", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000";
    process.env.EXPO_PUBLIC_DEMONS_CATALOG_TOKEN = "test-token";
  });

  it("normalizes the active top-level readings and derives the Gospel excerpt", () => {
    const liturgy = parseDailyLiturgy(liturgyPayload);

    expect(liturgy.celebration.liturgicalColor).toBe("WHITE");
    expect(liturgy.readings).toHaveLength(3);
    expect(liturgy.readings.map((reading) => reading.citation)).toEqual([
      "Ez 37:1-14",
      "Ps 107",
      "Mt 22:34-40",
    ]);
    expect(liturgy.highlightedVerse).toEqual({
      citation: "Mt 22:34-40",
      text: "You shall love the Lord, your God, with all your heart.",
    });
  });

  it("sends actual completion timestamps and a retry-safe idempotency key for the reward", async () => {
    const fetchMock = jest.fn(async () => ({
      json: async () => ({ data: { replayed: false, xp: { currentLevel: 2, points: 15, totalXp: 365 } } }),
      ok: true,
    }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      recordDailyScriptureCompletion({
        completedAt: "2026-08-21T21:22:25.672Z",
        country: "US",
        idempotencyKey: "daily-liturgy-key",
        occurredAt: "2026-08-21T21:22:25.672Z",
      }),
    ).resolves.toEqual({ currentLevel: 2, points: 15, replayed: false, totalXp: 365 });

    const [, request] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(request.headers).toMatchObject({ "Idempotency-Key": "daily-liturgy-key" });
    expect(JSON.parse(String(request.body))).toMatchObject({
      activityCode: "PRAYER",
      completedAt: "2026-08-21T21:22:25.672Z",
      countryCode: "US",
      occurredAt: "2026-08-21T21:22:25.672Z",
    });
  });
});

describe("daily reading progress", () => {
  it("records completion only after every active reading and preserves the reward key", async () => {
    const storage = createStorage();
    const input = { country: testCountry, date: testDate, readingIds: ["first", "psalm", "gospel"] };

    const first = await markDailyReadingComplete({ ...input, readingId: "first" }, storage);
    const second = await markDailyReadingComplete({ ...input, readingId: "psalm" }, storage);
    const final = await markDailyReadingComplete({ ...input, readingId: "gospel" }, storage);
    const repeat = await markDailyReadingComplete({ ...input, readingId: "gospel" }, storage);

    expect(first.allReadingsCompleted).toBe(false);
    expect(second.allReadingsCompleted).toBe(false);
    expect(final.didCompleteAllReadings).toBe(true);
    expect(final.progress.reward).toMatchObject({ status: "pending" });
    expect(repeat.didCompleteAllReadings).toBe(false);
    expect(repeat.progress.reward?.idempotencyKey).toBe(final.progress.reward?.idempotencyKey);

    const recorded = await recordRewardOnProgress(
      final.progress,
      { currentLevel: 2, points: 15, totalXp: 365 },
      storage,
    );
    const loaded = await loadDailyReadingProgress(testDate, testCountry, storage);
    expect(recorded.reward).toMatchObject({ points: 15, status: "recorded", totalXp: 365 });
    expect(loaded.completedReadingIds).toEqual(["first", "psalm", "gospel"]);
  });
});

describe("completion toast", () => {
  it("does not occupy space while hidden and explains the earned points once visible", async () => {
    const hidden = await render(<CompletionToast count={3} visible={false} onDismiss={jest.fn()} />);
    expect(hidden.queryByText("All 3 scriptures completed")).toBeNull();

    await hidden.rerender(<CompletionToast count={3} points={15} totalXp={365} visible onDismiss={jest.fn()} />);
    expect(screen.getByText("All 3 scriptures completed")).toBeTruthy();
    expect(screen.getByText("Points +15")).toBeTruthy();
  });
});

describe("inline Scripture readings", () => {
  it("reveals reading text with the chevron instead of navigating away", async () => {
    const onReadingComplete = jest.fn(async () => undefined);
    await render(
      <ScriptureReadingsCard
        completedReadingIds={[]}
        onReadingComplete={onReadingComplete}
        readings={[
          {
            citation: "Ez 37:1-14",
            id: "first-reading",
            text: "Dry bones, hear the word of the LORD.",
            type: "FIRST_READING",
          },
        ]}
      />,
    );

    expect(screen.queryByText("Dry bones, hear the word of the LORD.")).toBeNull();

    await fireEvent.press(screen.getByLabelText("Expand FIRST READING, Ez 37:1-14"));

    expect(screen.getByText("Dry bones, hear the word of the LORD.")).toBeTruthy();
    expect(screen.getByLabelText("Collapse FIRST READING, Ez 37:1-14")).toBeTruthy();
  });
});
