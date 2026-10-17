import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { RosaryStorageAdapter } from "@/features/prayer/rosary/hooks/useRosarySession";
import { logDevelopmentError } from "@/lib/development-logger";

export const DAILY_ROSARY_SKIP_LIMIT = 5;
const STORAGE_KEY_PREFIX = "@doit4jesus/rosary-daily-skips/v1";

interface DailyRosarySkipRecord {
  count: number;
  date: string;
}

interface UseDailyRosarySkipLimitOptions {
  now?: () => Date;
  storage?: RosaryStorageAdapter;
}

export interface DailyRosarySkipAttempt {
  allowed: boolean;
  limitReached: boolean;
  skipCount: number;
}

/** Formats a Date as the device's local calendar day without applying a UTC conversion. */
function getLocalDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a persisted counter and resets records from earlier local calendar days. */
function parseStoredRecord(value: string | null, today: string): DailyRosarySkipRecord {
  if (!value) return { count: 0, date: today };

  const parsed = JSON.parse(value) as Partial<DailyRosarySkipRecord>;
  if (typeof parsed.date !== "string" || !Number.isInteger(parsed.count) || Number(parsed.count) < 0) {
    throw new Error("The saved daily Rosary skip count is invalid.");
  }
  if (parsed.date !== today) return { count: 0, date: today };

  return { count: Math.min(Number(parsed.count), DAILY_ROSARY_SKIP_LIMIT), date: today };
}

/** Returns the device-local storage key for one signed-in user's daily Rosary skips. */
export function getDailyRosarySkipStorageKey(userId: string | null) {
  return `${STORAGE_KEY_PREFIX}/${encodeURIComponent(userId ?? "anonymous")}`;
}

/**
 * Restores and enforces the signed-in user's device-local daily Next-button skip allowance.
 * A date change resets the allowance on the next attempt, while storage failures retain in-memory enforcement.
 */
export function useDailyRosarySkipLimit(
  userId: string | null,
  { now = () => new Date(), storage = AsyncStorage }: UseDailyRosarySkipLimitOptions = {},
) {
  const storageKey = getDailyRosarySkipStorageKey(userId);
  const nowRef = useRef(now);
  const recordRef = useRef<DailyRosarySkipRecord>({ count: 0, date: getLocalDateKey(now()) });
  const [record, setRecord] = useState(recordRef.current);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);
  nowRef.current = now;

  useEffect(() => {
    let active = true;
    const today = getLocalDateKey(nowRef.current());
    const emptyRecord = { count: 0, date: today };
    recordRef.current = emptyRecord;
    setRecord(emptyRecord);
    setIsHydrated(false);
    setStorageError(false);

    /** Restores this user's count for today and discards stale calendar-day data. */
    async function restoreDailySkips() {
      try {
        const restored = parseStoredRecord(await storage.getItem(storageKey), today);
        if (!active) return;
        recordRef.current = restored;
        setRecord(restored);
      } catch (error) {
        logDevelopmentError("loading the daily Rosary skip count", error);
        if (active) setStorageError(true);
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    void restoreDailySkips();
    return () => {
      active = false;
    };
  }, [storage, storageKey]);

  /** Persists a new daily record without blocking the prayer transition. */
  const persistRecord = useCallback(
    async (nextRecord: DailyRosarySkipRecord) => {
      try {
        await storage.setItem(storageKey, JSON.stringify(nextRecord));
      } catch (error) {
        logDevelopmentError("saving the daily Rosary skip count", error);
        setStorageError(true);
      }
    },
    [storage, storageKey],
  );

  /** Runs an accepted prayer advance and consumes its skip atomically, leaving rejected transitions uncounted. */
  const tryUseSkip = useCallback(
    (advance: () => boolean): DailyRosarySkipAttempt => {
      const today = getLocalDateKey(nowRef.current());
      const current = recordRef.current.date === today ? recordRef.current : { count: 0, date: today };

      if (current.count >= DAILY_ROSARY_SKIP_LIMIT) {
        if (recordRef.current !== current) {
          recordRef.current = current;
          setRecord(current);
        }
        return { allowed: false, limitReached: true, skipCount: DAILY_ROSARY_SKIP_LIMIT };
      }

      if (!advance()) {
        return { allowed: false, limitReached: false, skipCount: current.count };
      }

      const nextRecord = { count: current.count + 1, date: today };
      recordRef.current = nextRecord;
      setRecord(nextRecord);
      void persistRecord(nextRecord);

      return {
        allowed: true,
        limitReached: nextRecord.count >= DAILY_ROSARY_SKIP_LIMIT,
        skipCount: nextRecord.count,
      };
    },
    [persistRecord],
  );

  return useMemo(
    () => ({
      isHydrated,
      isLimitReached: record.count >= DAILY_ROSARY_SKIP_LIMIT,
      skipCount: record.count,
      storageError,
      tryUseSkip,
    }),
    [isHydrated, record.count, storageError, tryUseSkip],
  );
}
