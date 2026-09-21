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

/** Creates one stable completion key for a user's country-specific liturgy day across devices. */
function createIdempotencyKey(date: string, country: string) {
  return `daily-liturgy-scripture-${country.toUpperCase()}-${date}`;
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
      completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : undefined,
      completedReadingIds: Array.isArray(parsed.completedReadingIds)
        ? [...new Set(parsed.completedReadingIds.filter((id): id is string => typeof id === "string"))]
        : [],
      country: country.toUpperCase(),
      date,
      reward:
        parsed.reward &&
        typeof parsed.reward.idempotencyKey === "string" &&
        typeof parsed.reward.occurredAt === "string" &&
        typeof parsed.reward.completedAt === "string" &&
        (parsed.reward.status === "pending" || parsed.reward.status === "recorded")
          ? parsed.reward
          : undefined,
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

/** Marks one reading complete and creates the daily activity only when every active reading is complete. */
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
  const didCompleteAllReadings = allReadingsCompleted && !current.completedAt;
  const completedAt = allReadingsCompleted ? (current.completedAt ?? new Date().toISOString()) : undefined;
  const reward =
    allReadingsCompleted && completedAt
      ? (current.reward ?? {
          completedAt,
          idempotencyKey: createIdempotencyKey(input.date, input.country),
          occurredAt: completedAt,
          status: "pending" as const,
        })
      : current.reward;
  const progress: DailyReadingProgress = {
    completedAt,
    completedReadingIds,
    country: input.country.toUpperCase(),
    date: input.date,
    reward,
  };

  await saveDailyReadingProgress(progress, storage);
  return { allReadingsCompleted, didCompleteAllReadings, progress };
}

/**
 * Mirrors a matching server-side Scripture activity into local reading progress.
 * Pending local rewards are discarded because the server has already recorded the completion.
 */
export async function markReadingsCompletedFromRecordedActivity(
  input: { date: string; country: string; readingIds: string[]; completedAt: string },
  storage: LiturgyStorageAdapter = AsyncStorage,
) {
  const current = await loadDailyReadingProgress(input.date, input.country, storage);
  const progress: DailyReadingProgress = {
    completedAt: input.completedAt,
    completedReadingIds: [...new Set(input.readingIds)],
    country: input.country.toUpperCase(),
    date: input.date,
    reward: current.reward?.status === "recorded" ? current.reward : undefined,
  };

  await saveDailyReadingProgress(progress, storage);
  return progress;
}

export async function recordRewardOnProgress(
  progress: DailyReadingProgress,
  reward: Required<Pick<NonNullable<DailyReadingProgress["reward"]>, "points" | "totalXp" | "currentLevel">>,
  storage: LiturgyStorageAdapter = AsyncStorage,
) {
  if (!progress.reward) return progress;

  const updated: DailyReadingProgress = {
    ...progress,
    reward: { ...progress.reward, ...reward, status: "recorded" },
  };
  await saveDailyReadingProgress(updated, storage);
  return updated;
}

export async function markCompletionToastShown(
  progress: DailyReadingProgress,
  storage: LiturgyStorageAdapter = AsyncStorage,
) {
  if (!progress.reward) return progress;
  const updated: DailyReadingProgress = {
    ...progress,
    reward: { ...progress.reward, toastShownAt: new Date().toISOString() },
  };
  await saveDailyReadingProgress(updated, storage);
  return updated;
}

export { STORAGE_PREFIX as DAILY_LITURGY_PROGRESS_STORAGE_PREFIX };
