import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DailyReadingProgress, MarkReadingCompleteResult } from "./liturgy.types";

const STORAGE_PREFIX = "@doit4jesus/daily-liturgy-progress/v1";

export interface LiturgyStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

function storageKey(date: string, country: string) {
  return `${STORAGE_PREFIX}/${country.toUpperCase()}/${date}`;
}

function defaultProgress(date: string, country: string): DailyReadingProgress {
  return { completedReadingIds: [], country: country.toUpperCase(), date };
}

function parseProgress(value: string | null, date: string, country: string): DailyReadingProgress {
  if (!value) return defaultProgress(date, country);

  try {
    const parsed = JSON.parse(value) as Partial<DailyReadingProgress>;
    if (parsed.date !== date || parsed.country !== country.toUpperCase()) {
      return defaultProgress(date, country);
    }

    return {
      completedReadingIds: Array.isArray(parsed.completedReadingIds)
        ? [...new Set(parsed.completedReadingIds.filter((id): id is string => typeof id === "string"))]
        : [],
      country: country.toUpperCase(),
      date,
    };
  } catch {
    return defaultProgress(date, country);
  }
}

export async function loadDailyReadingProgress(
  date: string,
  country: string,
  storage: LiturgyStorageAdapter = AsyncStorage,
) {
  return parseProgress(await storage.getItem(storageKey(date, country)), date, country);
}

export async function saveDailyReadingProgress(
  progress: DailyReadingProgress,
  storage: LiturgyStorageAdapter = AsyncStorage,
) {
  await storage.setItem(storageKey(progress.date, progress.country), JSON.stringify(progress));
}

/** Marks one locally read Scripture passage after the user reaches the end of its text. */
export async function markDailyReadingComplete(
  input: { date: string; country: string; readingId: string; readingIds: string[] },
  storage: LiturgyStorageAdapter = AsyncStorage,
): Promise<MarkReadingCompleteResult> {
  const current = await loadDailyReadingProgress(input.date, input.country, storage);
  const allowedIds = new Set(input.readingIds);
  const completedReadingIds = [
    ...new Set([...current.completedReadingIds.filter((id) => allowedIds.has(id)), input.readingId]),
  ];
  const allReadingsCompleted =
    input.readingIds.length > 0 && input.readingIds.every((readingId) => completedReadingIds.includes(readingId));
  const progress: DailyReadingProgress = {
    completedReadingIds,
    country: input.country.toUpperCase(),
    date: input.date,
  };

  await saveDailyReadingProgress(progress, storage);
  return { allReadingsCompleted, didCompleteAllReadings: allReadingsCompleted, progress };
}

export { STORAGE_PREFIX as DAILY_LITURGY_PROGRESS_STORAGE_PREFIX };
