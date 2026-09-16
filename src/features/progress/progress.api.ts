import { getSupabaseAccessToken } from "@/lib/supabase";

import type {
  DashboardProgress,
  EarnedBadge,
  LevelCatalogEntry,
  ProgressLevel,
  RecentRosaryActivity,
  UserProgress,
  UserRosaryStats,
} from "./progress.types";

type BadgeDefinition = {
  code: string;
  description: string;
  iconUrl: string | null;
  id: string;
  name: string;
};

type BadgeEarnedInstance = {
  earnedAt: string;
  id: string;
};

type UserBadgeResponse = {
  definition: BadgeDefinition;
  earned: BadgeEarnedInstance[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`The progress endpoint returned an invalid ${field}.`);
  }

  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The progress endpoint returned an invalid ${field}.`);
  }

  return value;
}

function readOptionalNumber(value: unknown, field: string): number | null {
  return value === undefined || value === null ? null : readNumber(value, field);
}

function readRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`The progress endpoint returned an invalid ${field}.`);
  }

  return value;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`The progress endpoint returned an invalid ${field}.`);
  }

  return value;
}

function readNullableString(value: unknown, field: string): string | null {
  return value === null ? null : readString(value, field);
}

function readOptionalNullableString(value: unknown, field: string): string | null {
  return value === undefined || value === null ? null : readString(value, field);
}

function readData(value: unknown): Record<string, unknown> {
  return readRecord(readRecord(value, "response").data, "response data");
}

function parseProgressLevel(value: unknown, field: string): ProgressLevel {
  const level = readRecord(value, field);

  return {
    code: readString(level.code, `${field} code`),
    levelNumber: readNumber(level.level_number, `${field} number`),
    minimumTotalXp: readNumber(level.minimum_total_xp, `${field} minimum total XP`),
    name: readString(level.name, `${field} name`),
  };
}

function parseDashboardProgressLevel(value: unknown): DashboardProgress["currentLevel"] {
  if (value === null || value === undefined) return null;

  const level = readRecord(value, "current level");
  return {
    code: readOptionalNullableString(level.code, "current level code"),
    levelNumber: readNumber(level.level_number, "current level number"),
    minimumTotalXp: readOptionalNumber(level.minimum_total_xp, "current level minimum XP"),
    name: readOptionalNullableString(level.name, "current level name"),
  };
}

function parseLevelCatalogEntry(value: unknown): LevelCatalogEntry {
  const level = readRecord(value, "level");
  return {
    code: readString(level.code, "level code"),
    levelNumber: readNumber(level.level_number, "level number"),
    minimumTotalXp: readNumber(level.minimum_total_xp, "level minimum XP"),
    name: readString(level.name, "level name"),
  };
}

function parseRecentRosaryActivity(value: unknown): RecentRosaryActivity {
  const activity = readRecord(value, "Rosary activity");
  if (readString(activity.activity_code, "activity code") !== "ROSARY") {
    throw new Error("The progress endpoint returned a non-Rosary activity.");
  }

  return {
    completedAt: readOptionalNullableString(activity.completed_at, "Rosary completion date"),
    id: readString(activity.id, "Rosary activity ID"),
    occurredAt: readString(activity.occurred_at, "Rosary activity date"),
    quantity: readNumber(activity.quantity, "Rosary activity quantity"),
  };
}

function parseBadgeDefinition(value: unknown): BadgeDefinition {
  const definition = readRecord(value, "badge definition");

  return {
    code: readString(definition.code, "badge code"),
    description: readString(definition.description, "badge description"),
    iconUrl: readOptionalNullableString(definition.icon_url, "badge icon URL"),
    id: readString(definition.id, "badge ID"),
    name: readString(definition.name, "badge name"),
  };
}

function parseBadgeEarnedInstance(value: unknown): BadgeEarnedInstance {
  const earned = readRecord(value, "earned badge");

  return {
    earnedAt: readString(earned.earned_at, "badge earned date"),
    id: readString(earned.id, "earned badge ID"),
  };
}

function parseBadgeResponse(value: unknown): UserBadgeResponse {
  const badge = readRecord(value, "badge");

  return {
    definition: parseBadgeDefinition(badge.definition),
    earned: readArray(badge.earned, "earned badges").map(parseBadgeEarnedInstance),
  };
}

async function requestProgress(path: string): Promise<unknown> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Set EXPO_PUBLIC_API_URL before loading your progress.");
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${await getSupabaseAccessToken()}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Unable to load your progress (${response.status}).`);
  }

  return response.json() as Promise<unknown>;
}

export async function fetchRosaryStats(): Promise<UserRosaryStats> {
  const data = readData(await requestProgress("/api/v1/me/rosary/stats"));

  return { rosariesPrayed: readNumber(data.rosariesPrayed, "Rosaries prayed") };
}

export async function fetchUserProgress(): Promise<UserProgress> {
  const data = readData(await requestProgress("/api/v1/progress"));

  return {
    currentLevel: parseProgressLevel(data.currentLevel, "current level"),
    lastActivityAt: readNullableString(data.lastActivityAt, "last activity date"),
    levelProgressPercentage: readNumber(data.levelProgressPercentage, "level progress percentage"),
    lifetimePoints: readNumber(data.lifetimePoints, "lifetime points"),
    nextLevel: data.nextLevel === null ? null : parseProgressLevel(data.nextLevel, "next level"),
    totalXp: readNumber(data.totalXp, "total XP"),
    updatedAt: readString(data.updatedAt, "progress updated date"),
    version: readNumber(data.version, "progress version"),
    weeklyPoints: readNumber(data.weeklyPoints, "weekly points"),
    xpIntoCurrentLevel: readNumber(data.xpIntoCurrentLevel, "XP into current level"),
    xpRequiredForNextLevel: readNumber(data.xpRequiredForNextLevel, "XP required for next level"),
    yearlyPoints: readNumber(data.yearlyPoints, "yearly points"),
  };
}

export async function fetchDashboardProgress(): Promise<DashboardProgress> {
  const data = readData(await requestProgress("/api/v1/progress"));

  return {
    currentLevel: parseDashboardProgressLevel(data.currentLevel),
    levelProgressPercentage: readOptionalNumber(data.levelProgressPercentage, "level progress percentage"),
    lifetimePoints: readNumber(data.lifetimePoints, "lifetime points"),
    nextLevel: parseDashboardProgressLevel(data.nextLevel),
    totalXp: readOptionalNumber(data.totalXp, "total XP"),
    weeklyPoints: readOptionalNumber(data.weeklyPoints, "weekly points"),
    xpIntoCurrentLevel: readOptionalNumber(data.xpIntoCurrentLevel, "XP into current level"),
    xpRequiredForNextLevel: readOptionalNumber(data.xpRequiredForNextLevel, "XP required for next level"),
    yearlyPoints: readOptionalNumber(data.yearlyPoints, "yearly points"),
  };
}

export async function fetchLevels(): Promise<LevelCatalogEntry[]> {
  const data = readData(await requestProgress("/api/v1/levels"));
  return readArray(data, "levels").map(parseLevelCatalogEntry);
}

export async function fetchRecentRosaryActivities(): Promise<RecentRosaryActivity[]> {
  const data = readData(await requestProgress("/api/v1/activities?limit=20&activityCode=ROSARY"));
  return readArray(data, "Rosary activities").map(parseRecentRosaryActivity);
}

function toEarnedBadges(badges: UserBadgeResponse[]): EarnedBadge[] {
  return badges
    .flatMap(({ definition, earned }) =>
      earned.map((instance) => ({
        code: definition.code,
        description: definition.description,
        earnedAt: instance.earnedAt,
        iconUrl: definition.iconUrl,
        id: instance.id,
        name: definition.name,
      })),
    )
    .sort((first, second) => Date.parse(second.earnedAt) - Date.parse(first.earnedAt));
}

export async function fetchEarnedBadges(): Promise<EarnedBadge[]> {
  const data = readData(await requestProgress("/api/v1/badges"));

  return toEarnedBadges(readArray(data, "badges").map(parseBadgeResponse));
}
