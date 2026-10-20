import { fetchDashboardProgress, fetchRosaryStats } from "@/features/progress";
import { getSupabaseAccessToken } from "@/lib/supabase";

import type {
  ConscienceQuestionViewModel,
  ConscienceQuestionCategory,
  ConscienceQuestionListItemViewModel,
  GlobalLeaderboardPeriod,
  GlobalLeaderboardPeriodType,
  GlobalRosaryLeaderboard,
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

/** Reads a required API field whose value may explicitly be null. */
function readNullableString(value: unknown, field: string): string | null {
  return value === null ? null : readString(value, field);
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

/** Parses an aggregate-screen Rosary reminder payload. */
export function parseRosaryReminderData(data: unknown): RosaryReminderViewModel {
  const value = readRecord(data, "rosary reminder");
  const streak = readRecord(value.streak, "rosary streak");
  const status = readString(streak.status, "rosary streak status");
  if (status !== "active" && status !== "at-risk" && status !== "none" && status !== "reset")
    throw new Error("The dashboard endpoint returned an invalid rosary streak status.");
  return {
    completed: readBoolean(value.todayRosaryCompleted, "today Rosary completion"),
    deadlineAt: readOptionalNullableString(value.deadlineAt, "Rosary deadline"),
    serverNow: readString(value.serverNow, "server time"),
    streak: {
      current: readNumber(streak.current, "current Rosary streak"),
      longest: readNumber(streak.longest, "longest Rosary streak"),
      status,
    },
  };
}

/** Parses an aggregate-screen examination question payload. */
export function parseConscienceQuestionData(data: unknown): ConscienceQuestionViewModel {
  const value = readRecord(data, "examination question");
  return {
    id: readString(value.id, "conscience question ID"),
    question: readString(value.question, "conscience question"),
    reflection: readOptionalNullableString(value.description, "conscience reflection"),
  };
}

/** Normalizes one server-ranked global Rosary entry and its profile projection. */
function parseGlobalLeaderboardEntry(value: unknown): LeaderboardEntryViewModel {
  const entry = readRecord(value, "leaderboard entry");
  const profile = readRecord(entry.profile, "leaderboard profile");

  return {
    avatarUrl: readNullableString(profile.avatar_url, "leaderboard avatar"),
    countryCode: readNullableString(profile.countryCode, "leaderboard country code"),
    displayName: readString(profile.display_name, "leaderboard display name"),
    isCurrentUser: readBoolean(entry.isCurrentUser, "leaderboard current-user flag"),
    rank: readNumber(entry.rank, "leaderboard rank"),
    rosaries: readNumber(entry.rosaries_count, "leaderboard Rosary count"),
    saintAvatarId: readNullableString(profile.saintAvatarId, "leaderboard saint avatar ID"),
    userId: readString(entry.user_id, "leaderboard user ID"),
  };
}

/** Normalizes and validates the weekly or lifetime period returned with a global leaderboard. */
function parseGlobalLeaderboardPeriod(value: unknown): GlobalLeaderboardPeriod {
  const period = readRecord(value, "leaderboard period");
  const periodType = readString(period.period_type, "leaderboard period type");
  if (periodType !== "weekly" && periodType !== "lifetime") {
    throw new Error("The dashboard endpoint returned an invalid leaderboard period type.");
  }

  return {
    code: readString(period.code, "leaderboard period code"),
    createdAt: readString(period.created_at, "leaderboard period creation date"),
    endsAt: readString(period.ends_at, "leaderboard period end"),
    finalizedAt: readNullableString(period.finalized_at, "leaderboard period finalization date"),
    id: readString(period.id, "leaderboard period ID"),
    name: readString(period.name, "leaderboard period name"),
    periodType: periodType as GlobalLeaderboardPeriodType,
    startsAt: readString(period.starts_at, "leaderboard period start"),
    status: readString(period.status, "leaderboard period status"),
  };
}

/** Parses the complete global Rosary leaderboard envelope used by the Community card. */
function parseGlobalLeaderboardResponse(value: unknown): GlobalRosaryLeaderboard {
  const response = readRecord(value, "leaderboard response");
  const data = readRecord(response.data, "leaderboard response data");
  const meta = readRecord(response.meta, "leaderboard metadata");
  const currentUserEntry = data.currentUserEntry;

  return {
    currentUserEntry: currentUserEntry === null ? null : parseGlobalLeaderboardEntry(currentUserEntry),
    entries: readArray(data.entries, "leaderboard entries").map(parseGlobalLeaderboardEntry),
    meta: {
      limit: readNumber(meta.limit, "leaderboard page limit"),
      offset: readNumber(meta.offset, "leaderboard page offset"),
      total: readNumber(meta.total, "leaderboard total"),
    },
    period: parseGlobalLeaderboardPeriod(data.period),
  };
}

/** Loads and validates a ranked global Rosary leaderboard for the requested period and compact result limit. */
async function getGlobalLeaderboard(
  periodType: GlobalLeaderboardPeriodType,
  limit: 3 | 10,
): Promise<GlobalRosaryLeaderboard> {
  return parseGlobalLeaderboardResponse(
    await requestDashboard(
      `/api/v1/leaderboards?periodType=${periodType}&scopeType=global&scopeReference=global&limit=${limit}&offset=0`,
    ),
  );
}

/** Loads the backend-ranked weekly top three global Rosary leaders and the authenticated user's rank. */
export function getWeeklyGlobalLeaderboard(): Promise<GlobalRosaryLeaderboard> {
  return getGlobalLeaderboard("weekly", 3);
}

/** Loads the backend-ranked lifetime top ten global Rosary leaders and the authenticated user's rank. */
export function getLifetimeGlobalLeaderboard(): Promise<GlobalRosaryLeaderboard> {
  return getGlobalLeaderboard("lifetime", 10);
}
