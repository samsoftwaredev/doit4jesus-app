import { getSupabaseAccessToken } from "@/lib/supabase";

import type {
  ActivityPointsActivity,
  ActivityPointsPage,
  BadgeCatalogEntry,
  BadgeEarnedInstance,
  BadgeProgress,
  BadgeRequirement,
  DashboardProgress,
  EarnedBadge,
  LevelCatalogEntry,
  ProgressLevel,
  RecentRosaryActivity,
  UserProgress,
  UserRosaryStats,
} from "./progress.types";

type BadgeDefinition = {
  category: string;
  code: string;
  description: string;
  iconUrl: string | null;
  id: string;
  isRepeatable: boolean;
  name: string;
  pointsReward: number;
  rarity: string;
  requirementValue: number;
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

/** Reads a required boolean from an API record and reports its logical field on failure. */
function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
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

/** Parses one activity record returned with its signed net ledger points. */
function parseActivityPointsActivity(value: unknown): ActivityPointsActivity {
  const activity = readRecord(value, "activity");

  return {
    activityCode: readString(activity.activity_code, "activity code"),
    completedAt: readOptionalNullableString(activity.completed_at, "activity completion date"),
    id: readString(activity.id, "activity ID"),
    occurredAt: readString(activity.occurred_at, "activity date"),
    points: readNumber(activity.points, "activity points"),
  };
}

/** Parses the documented activity-history response and verifies its cursor metadata. */
function parseActivityPointsPage(value: unknown): ActivityPointsPage {
  const response = readRecord(value, "activity history response");
  const meta = readRecord(response.meta, "activity history metadata");
  const hasMore = readBoolean(meta.hasMore, "activity history has more flag");
  const nextCursor = readNullableString(meta.nextCursor, "activity history next cursor");

  if (hasMore && !nextCursor) {
    throw new Error("The activity endpoint returned a next page without a cursor.");
  }

  return {
    activities: readArray(response.data, "activities").map(parseActivityPointsActivity),
    hasMore,
    nextCursor,
  };
}

/** Parses the badge metadata displayed by the catalog and Home preview. */
function parseBadgeDefinition(value: unknown): BadgeDefinition {
  const definition = readRecord(value, "badge definition");

  return {
    category: readString(definition.category, "badge category"),
    code: readString(definition.code, "badge code"),
    description: readString(definition.description, "badge description"),
    iconUrl: readOptionalNullableString(definition.icon_url, "badge icon URL"),
    id: readString(definition.id, "badge ID"),
    isRepeatable: readBoolean(definition.is_repeatable, "badge repeatable flag"),
    name: readString(definition.name, "badge name"),
    pointsReward: readNumber(definition.points_reward, "badge points reward"),
    rarity: readString(definition.rarity, "badge rarity"),
    requirementValue: readNumber(definition.requirement_value, "badge requirement value"),
  };
}

/** Parses one earned instance while deliberately ignoring backend-only award metadata. */
function parseBadgeEarnedInstance(value: unknown): BadgeEarnedInstance {
  const earned = readRecord(value, "earned badge");

  return {
    earnedAt: readString(earned.earned_at, "badge earned date"),
    id: readString(earned.id, "earned badge ID"),
  };
}

/** Parses nullable aggregate progress for badges tracked by a single counter. */
function parseBadgeProgress(value: unknown): BadgeProgress | null {
  if (value === null || value === undefined) return null;
  const progress = readRecord(value, "badge progress");

  return {
    currentValue: readNumber(progress.current_value, "badge progress current value"),
    percentage: readNumber(progress.progress_percentage, "badge progress percentage"),
    requiredValue: readNumber(progress.required_value, "badge progress required value"),
  };
}

/** Parses one user-facing requirement and its current completion values. */
function parseBadgeRequirement(value: unknown): BadgeRequirement {
  const requirement = readRecord(value, "badge requirement");
  const definition = readRecord(requirement.definition, "badge requirement definition");

  return {
    complete: readBoolean(requirement.complete, "badge requirement complete flag"),
    currentValue: readNumber(requirement.currentValue, "badge requirement current value"),
    description: readString(definition.description, "badge requirement description"),
    displayOrder: readNumber(definition.display_order, "badge requirement display order"),
    id: readString(definition.id, "badge requirement ID"),
    requiredValue: readNumber(requirement.requiredValue, "badge requirement required value"),
  };
}

/** Parses one badge definition together with earned, aggregate, and compound progress. */
function parseBadgeResponse(value: unknown): BadgeCatalogEntry {
  const badge = readRecord(value, "badge");

  return {
    ...parseBadgeDefinition(badge.definition),
    earned: readArray(badge.earned, "earned badges").map(parseBadgeEarnedInstance),
    progress: parseBadgeProgress(badge.progress),
    requirements: readArray(badge.requirements, "badge requirements")
      .map(parseBadgeRequirement)
      .sort((first, second) => first.displayOrder - second.displayOrder),
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

/** Parses aggregate-screen Rosary statistics using the same contract as the standalone endpoint. */
export function parseRosaryStatsData(data: unknown): UserRosaryStats {
  return { rosariesPrayed: readNumber(readRecord(data, "Rosary statistics").rosariesPrayed, "Rosaries prayed") };
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

/** Parses aggregate-screen progress using the compact dashboard representation. */
export function parseDashboardProgressData(data: unknown): DashboardProgress {
  const value = readRecord(data, "progress");
  return {
    currentLevel: parseDashboardProgressLevel(value.currentLevel),
    levelProgressPercentage: readOptionalNumber(value.levelProgressPercentage, "level progress percentage"),
    lifetimePoints: readNumber(value.lifetimePoints, "lifetime points"),
    nextLevel: parseDashboardProgressLevel(value.nextLevel),
    totalXp: readOptionalNumber(value.totalXp, "total XP"),
    weeklyPoints: readOptionalNumber(value.weeklyPoints, "weekly points"),
    xpIntoCurrentLevel: readOptionalNumber(value.xpIntoCurrentLevel, "XP into current level"),
    xpRequiredForNextLevel: readOptionalNumber(value.xpRequiredForNextLevel, "XP required for next level"),
    yearlyPoints: readOptionalNumber(value.yearlyPoints, "yearly points"),
  };
}

export async function fetchLevels(): Promise<LevelCatalogEntry[]> {
  const data = readData(await requestProgress("/api/v1/levels"));
  return readArray(data, "levels").map(parseLevelCatalogEntry);
}

/** Parses aggregate-screen level catalog data. */
export function parseLevelsData(data: unknown): LevelCatalogEntry[] {
  return readArray(data, "levels").map(parseLevelCatalogEntry);
}

export async function fetchRecentRosaryActivities(): Promise<RecentRosaryActivity[]> {
  const data = readData(await requestProgress("/api/v1/activities?limit=20&activityCode=ROSARY"));
  return readArray(data, "Rosary activities").map(parseRecentRosaryActivity);
}

/** Loads one cursor page of the authenticated user's full activity history with signed net points. */
export async function fetchActivityPointsPage(before?: string): Promise<ActivityPointsPage> {
  const query = new URLSearchParams({ include: "points", limit: "20" });
  if (before) query.set("before", before);

  return parseActivityPointsPage(await requestProgress(`/api/v1/activities?${query.toString()}`));
}

/** Parses aggregate-screen Rosary activity data. */
export function parseRecentRosaryActivitiesData(data: unknown): RecentRosaryActivity[] {
  return readArray(data, "Rosary activities").map(parseRecentRosaryActivity);
}

/** Flattens repeatable award events into the recent-earned presentation model. */
function toEarnedBadges(badges: BadgeCatalogEntry[]): EarnedBadge[] {
  return badges
    .flatMap((badge) =>
      badge.earned.map((instance) => ({
        code: badge.code,
        description: badge.description,
        earnedAt: instance.earnedAt,
        iconUrl: badge.iconUrl,
        id: instance.id,
        name: badge.name,
      })),
    )
    .sort((first, second) => Date.parse(second.earnedAt) - Date.parse(first.earnedAt));
}

/** Loads every badge definition and the authenticated user's progress for each one. */
export async function fetchBadgeCatalog(): Promise<BadgeCatalogEntry[]> {
  const data = readData(await requestProgress("/api/v1/badges"));
  return readArray(data, "badges").map(parseBadgeResponse);
}

/** Parses aggregate-screen badge catalog data. */
export function parseBadgeCatalogData(data: unknown): BadgeCatalogEntry[] {
  return readArray(data, "badges").map(parseBadgeResponse);
}

/** Loads recent earned events for consumers that only need achievement history. */
export async function fetchEarnedBadges(): Promise<EarnedBadge[]> {
  return toEarnedBadges(await fetchBadgeCatalog());
}
