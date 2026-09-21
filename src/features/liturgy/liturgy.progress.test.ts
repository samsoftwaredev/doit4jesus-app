import {
  loadDailyReadingProgress,
  markDailyReadingComplete,
  markReadingsCompletedFromRecordedActivity,
  recordRewardOnProgress,
} from "./liturgy.progress";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => values.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
  };
}

describe("Daily reading progress", () => {
  it("records completion only after every active reading and preserves the reward key", async () => {
    const storage = createStorage();
    const input = { country: "US", date: "2026-08-21", readingIds: ["first", "psalm", "gospel"] };

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
    const loaded = await loadDailyReadingProgress("2026-08-21", "US", storage);
    expect(recorded.reward).toMatchObject({ points: 15, status: "recorded", totalXp: 365 });
    expect(loaded.completedReadingIds).toEqual(["first", "psalm", "gospel"]);
  });

  it("marks every reading complete from a previously recorded server activity without leaving a reward to retry", async () => {
    const storage = createStorage();
    const input = { country: "US", date: "2026-08-21", readingIds: ["first", "psalm", "gospel"] };
    const final = await markDailyReadingComplete({ ...input, readingId: "first" }, storage);

    const progress = await markReadingsCompletedFromRecordedActivity(
      { ...input, completedAt: "2026-08-21T21:22:25.672Z" },
      storage,
    );

    expect(final.progress.completedReadingIds).toEqual(["first"]);
    expect(progress).toEqual({
      completedAt: "2026-08-21T21:22:25.672Z",
      completedReadingIds: ["first", "psalm", "gospel"],
      country: "US",
      date: "2026-08-21",
    });
  });
});
