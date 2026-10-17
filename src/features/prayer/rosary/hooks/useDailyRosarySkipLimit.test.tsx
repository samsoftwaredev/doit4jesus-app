import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  DAILY_ROSARY_SKIP_LIMIT,
  getDailyRosarySkipStorageKey,
  useDailyRosarySkipLimit,
} from "@/features/prayer/rosary/hooks/useDailyRosarySkipLimit";
import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";

function createMemoryStorage(initialValues: Record<string, string> = {}): jest.Mocked<RosaryStorageAdapter> {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem: jest.fn<Promise<string | null>, [string]>((key) => Promise.resolve(values.get(key) ?? null)),
    setItem: jest.fn<Promise<void>, [string, string]>((key, value) => {
      values.set(key, value);
      return Promise.resolve();
    }),
  };
}

describe("useDailyRosarySkipLimit", () => {
  it("does not consume a skip when the prayer transition rejects the advance", async () => {
    const storage = createMemoryStorage();
    const { result } = await renderHook(() =>
      useDailyRosarySkipLimit("user-one", { now: () => new Date(2026, 9, 17), storage }),
    );
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    let rejectedAttempt;
    await act(async () => {
      rejectedAttempt = result.current.tryUseSkip(() => false);
    });

    expect(rejectedAttempt).toEqual({ allowed: false, limitReached: false, skipCount: 0 });
    expect(result.current.skipCount).toBe(0);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("allows five Next-button skips, reports the fifth limit, and blocks the sixth", async () => {
    const now = new Date(2026, 9, 17, 10, 30);
    const storage = createMemoryStorage();
    const { result } = await renderHook(() => useDailyRosarySkipLimit("user-one", { now: () => now, storage }));

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    let fifthAttempt;
    for (let count = 0; count < DAILY_ROSARY_SKIP_LIMIT; count += 1) {
      await act(async () => {
        fifthAttempt = result.current.tryUseSkip(() => true);
      });
    }

    expect(fifthAttempt).toEqual({ allowed: true, limitReached: true, skipCount: 5 });
    expect(result.current.skipCount).toBe(5);
    expect(result.current.isLimitReached).toBe(true);

    let blockedAttempt;
    await act(async () => {
      blockedAttempt = result.current.tryUseSkip(() => true);
    });
    expect(blockedAttempt).toEqual({ allowed: false, limitReached: true, skipCount: 5 });
    expect(result.current.skipCount).toBe(5);

    await waitFor(() =>
      expect(storage.setItem).toHaveBeenLastCalledWith(
        getDailyRosarySkipStorageKey("user-one"),
        JSON.stringify({ count: 5, date: "2026-10-17" }),
      ),
    );
  });

  it("restores the signed-in user's count and resets it on the next local calendar day", async () => {
    let now = new Date(2026, 9, 17, 23, 55);
    const storageKey = getDailyRosarySkipStorageKey("user-two");
    const storage = createMemoryStorage({
      [storageKey]: JSON.stringify({ count: 4, date: "2026-10-17" }),
    });
    const { result } = await renderHook(() => useDailyRosarySkipLimit("user-two", { now: () => now, storage }));

    await waitFor(() => expect(result.current.skipCount).toBe(4));

    await act(async () => {
      result.current.tryUseSkip(() => true);
    });
    expect(result.current.isLimitReached).toBe(true);

    now = new Date(2026, 9, 18, 0, 1);
    let nextDayAttempt;
    await act(async () => {
      nextDayAttempt = result.current.tryUseSkip(() => true);
    });

    expect(nextDayAttempt).toEqual({ allowed: true, limitReached: false, skipCount: 1 });
    expect(result.current.skipCount).toBe(1);
    await waitFor(() =>
      expect(storage.setItem).toHaveBeenLastCalledWith(storageKey, JSON.stringify({ count: 1, date: "2026-10-18" })),
    );
  });

  it("keeps device-local counts isolated by signed-in user", async () => {
    const firstUserKey = getDailyRosarySkipStorageKey("user-one");
    const secondUserKey = getDailyRosarySkipStorageKey("user-two");
    const storage = createMemoryStorage({
      [firstUserKey]: JSON.stringify({ count: 5, date: "2026-10-17" }),
    });

    const { result } = await renderHook(() =>
      useDailyRosarySkipLimit("user-two", { now: () => new Date(2026, 9, 17), storage }),
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.skipCount).toBe(0);
    expect(storage.getItem).toHaveBeenCalledWith(secondUserKey);
    expect(storage.getItem).not.toHaveBeenCalledWith(firstUserKey);
  });

  it("falls back to a fresh in-memory count when the saved record is malformed", async () => {
    const storageKey = getDailyRosarySkipStorageKey("user-four");
    const storage = createMemoryStorage({ [storageKey]: "not-json" });
    const { result } = await renderHook(() =>
      useDailyRosarySkipLimit("user-four", { now: () => new Date(2026, 9, 17), storage }),
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.skipCount).toBe(0);
    expect(result.current.storageError).toBe(true);

    let firstAttempt;
    await act(async () => {
      firstAttempt = result.current.tryUseSkip(() => true);
    });
    expect(firstAttempt).toEqual({ allowed: true, limitReached: false, skipCount: 1 });
  });

  it("keeps enforcing the limit in memory when device storage is unavailable", async () => {
    const storage: jest.Mocked<RosaryStorageAdapter> = {
      getItem: jest.fn<Promise<string | null>, [string]>(() => Promise.reject(new Error("unavailable"))),
      setItem: jest.fn<Promise<void>, [string, string]>(() => Promise.reject(new Error("unavailable"))),
    };
    const { result } = await renderHook(() =>
      useDailyRosarySkipLimit("user-three", { now: () => new Date(2026, 9, 17), storage }),
    );

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.storageError).toBe(true);

    for (let count = 0; count < DAILY_ROSARY_SKIP_LIMIT; count += 1) {
      await act(async () => {
        result.current.tryUseSkip(() => true);
      });
    }

    let blockedAttempt;
    await act(async () => {
      blockedAttempt = result.current.tryUseSkip(() => true);
    });
    expect(blockedAttempt).toEqual({ allowed: false, limitReached: true, skipCount: 5 });
    expect(result.current.skipCount).toBe(5);
  });
});
