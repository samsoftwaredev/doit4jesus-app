import { loadDailyReadingProgress, markDailyReadingComplete } from "./liturgy.progress";

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
  it("persists each completed reading and reports when every active reading has been read", async () => {
    const storage = createStorage();
    const input = { country: "US", date: "2026-08-21", readingIds: ["first", "psalm", "gospel"] };

    const first = await markDailyReadingComplete({ ...input, readingId: "first" }, storage);
    const second = await markDailyReadingComplete({ ...input, readingId: "psalm" }, storage);
    const final = await markDailyReadingComplete({ ...input, readingId: "gospel" }, storage);
    const repeat = await markDailyReadingComplete({ ...input, readingId: "gospel" }, storage);

    expect(first.allReadingsCompleted).toBe(false);
    expect(second.allReadingsCompleted).toBe(false);
    expect(final.didCompleteAllReadings).toBe(true);
    expect(repeat.didCompleteAllReadings).toBe(true);
    const loaded = await loadDailyReadingProgress("2026-08-21", "US", storage);
    expect(loaded.completedReadingIds).toEqual(["first", "psalm", "gospel"]);
  });
});
