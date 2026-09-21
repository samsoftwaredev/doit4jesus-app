import { fetchDashboardProgress, fetchRosaryStats } from "@/features/progress";
import { getSupabaseAccessToken } from "@/lib/supabase";

import type {
  ConscienceQuestionViewModel,
  ConscienceQuestionCategory,
  ConscienceQuestionListItemViewModel,
  LeaderboardEntryViewModel,
  RosaryReminderViewModel,
  RosaryStreakStatus,
} from "./dashboard.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`The dashboard endpoint returned invalid ${field}.`);
  return value;
}

function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new Error(`The dashboard endpoint returned invalid ${field}.`);
  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The dashboard endpoint returned invalid ${field}.`);
  }
  return value;
}

function readRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`The dashboard endpoint returned invalid ${field}.`);
  return value;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(`The dashboard endpoint returned invalid ${field}.`);
  return value;
}

function readOptionalNullableString(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  return readString(value, field);
}

function readData(value: unknown, field: string): Record<string, unknown> {
  return readRecord(readRecord(value, field).data, `${field} data`);
}

/** Validates an examination category supplied by the conscience endpoint. */
function readConscienceCategory(value: unknown): ConscienceQuestionCategory {
  const category = readString(value, "conscience question category");
  if (category !== "single" && category !== "married" && category !== "religious") {
    throw new Error("The dashboard endpoint returned an invalid conscience question category.");
  }
  return category;
}

async function requestDashboard(path: string): Promise<unknown> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading the dashboard.");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${await getSupabaseAccessToken()}`,
    },
    method: "GET",
  });

  if (!response.ok) throw new Error(`Unable to load dashboard data (${response.status}).`);
  return response.json() as Promise<unknown>;
}

export async function getHolyProgress() {
  const [progress, stats] = await Promise.all([fetchDashboardProgress(), fetchRosaryStats()]);
  return {
    level: progress.currentLevel?.levelNumber ?? null,
    levelName: progress.currentLevel?.name ?? null,
    points: progress.lifetimePoints,
    rosaries: stats.rosariesPrayed,
  };
}

export async function getConscienceQuestion(): Promise<ConscienceQuestionViewModel> {
  const data = readData(
    await requestDashboard("/api/v1/examination-of-conscience?randomQuestion=true"),
    "examination of conscience response",
  );

  return {
    id: readString(data.id, "conscience question ID"),
    question: readString(data.question, "conscience question"),
    reflection: readOptionalNullableString(data.description, "conscience reflection"),
  };
}

/** Loads the complete examination of conscience, retaining only fields needed by the Home list. */
export async function getConscienceQuestions(): Promise<ConscienceQuestionListItemViewModel[]> {
  const response = readRecord(
    await requestDashboard("/api/v1/examination-of-conscience"),
    "examination of conscience response",
  );
  return readArray(response.data, "examination of conscience data").map((rawQuestion) => {
    const question = readRecord(rawQuestion, "conscience question");
    return {
      category: readConscienceCategory(question.category),
      id: readString(question.id, "conscience question ID"),
      question: readString(question.question, "conscience question"),
      title: readString(question.title, "conscience question title"),
    };
  });
}

export async function getRosaryReminder(): Promise<RosaryReminderViewModel> {
  const data = readData(await requestDashboard("/api/v1/me/rosary/reminder"), "rosary reminder response");
  const streak = readRecord(data.streak, "rosary streak");
  const status = readString(streak.status, "rosary streak status");
  if (status !== "active" && status !== "at-risk" && status !== "none" && status !== "reset") {
    throw new Error("The dashboard endpoint returned an invalid rosary streak status.");
  }

  return {
    completed: readBoolean(data.todayRosaryCompleted, "today Rosary completion"),
    deadlineAt: readOptionalNullableString(data.deadlineAt, "Rosary deadline"),
    serverNow: readString(data.serverNow, "server time"),
    streak: {
      current: readNumber(streak.current, "current Rosary streak"),
      longest: readNumber(streak.longest, "longest Rosary streak"),
      status: status as RosaryStreakStatus,
    },
  };
}

/** Loads and validates a ranked global leaderboard for the requested period and result limit. */
async function getGlobalLeaderboard(
  periodType: "weekly" | "yearly",
  limit: 3 | 10,
): Promise<LeaderboardEntryViewModel[]> {
  const data = readData(
    await requestDashboard(
      `/api/v1/leaderboards?periodType=${periodType}&scopeType=global&scopeReference=global&limit=${limit}`,
    ),
    "leaderboard response",
  );

  return readArray(data.entries, "leaderboard entries").map((rawLeaderboardEntry) => {
    const leaderboardEntry = readRecord(rawLeaderboardEntry, "leaderboard entry");
    const profile = readRecord(leaderboardEntry.profile, "leaderboard profile");

    return {
      avatarUrl: readOptionalNullableString(profile.avatar_url, "leaderboard avatar"),
      countryCode: readOptionalNullableString(profile.countryCode, "leaderboard country code"),
      displayName: readString(profile.display_name, "leaderboard display name"),
      rank: readNumber(leaderboardEntry.rank, "leaderboard rank"),
      rosaries: readNumber(leaderboardEntry.rosaries_count, "leaderboard Rosary count"),
      saintAvatarId: readOptionalNullableString(profile.saintAvatarId, "leaderboard saint avatar ID"),
    };
  });
}

/** Loads the backend-ranked weekly top three global Rosary leaders. */
export function getWeeklyGlobalLeaderboard(): Promise<LeaderboardEntryViewModel[]> {
  return getGlobalLeaderboard("weekly", 3);
}

/** Loads the backend-ranked yearly top ten global Rosary leaders. */
export function getYearlyGlobalLeaderboard(): Promise<LeaderboardEntryViewModel[]> {
  return getGlobalLeaderboard("yearly", 10);
}
