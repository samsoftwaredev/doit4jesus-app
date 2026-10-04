export interface UserRosaryStats {
  rosariesPrayed: number;
}

/** Minimal progress model used by the Home dashboard. */
export interface DashboardProgress {
  currentLevel: {
    code: string | null;
    levelNumber: number;
    minimumTotalXp: number | null;
    name: string | null;
  } | null;
  levelProgressPercentage: number | null;
  lifetimePoints: number;
  nextLevel: {
    code: string | null;
    levelNumber: number;
    minimumTotalXp: number | null;
    name: string | null;
  } | null;
  totalXp: number | null;
  weeklyPoints: number | null;
  xpIntoCurrentLevel: number | null;
  xpRequiredForNextLevel: number | null;
  yearlyPoints: number | null;
}

/** Display fields from the authenticated level catalogue. */
export interface LevelCatalogEntry {
  code: string;
  levelNumber: number;
  minimumTotalXp: number;
  name: string;
}

/** A completed Rosary from the authenticated activity history. */
export interface RecentRosaryActivity {
  completedAt: string | null;
  id: string;
  occurredAt: string;
  quantity: number;
}

/** One completed activity together with its signed, aggregated ledger points. */
export interface ActivityPointsActivity {
  activityCode: string;
  completedAt: string | null;
  id: string;
  occurredAt: string;
  points: number;
}

/** A cursor page of activities that includes each activity's signed net points. */
export interface ActivityPointsPage {
  activities: ActivityPointsActivity[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface ProgressLevel {
  code: string;
  levelNumber: number;
  minimumTotalXp: number;
  name: string;
}

export interface UserProgress {
  currentLevel: ProgressLevel;
  lastActivityAt: string | null;
  levelProgressPercentage: number;
  lifetimePoints: number;
  nextLevel: ProgressLevel | null;
  totalXp: number;
  updatedAt: string;
  version: number;
  weeklyPoints: number;
  xpIntoCurrentLevel: number;
  xpRequiredForNextLevel: number;
  yearlyPoints: number;
}

export interface EarnedBadge {
  code: string;
  description: string;
  earnedAt: string;
  iconUrl: string | null;
  id: string;
  name: string;
}

/** A single award event for a badge definition, including repeatable awards. */
export interface BadgeEarnedInstance {
  earnedAt: string;
  id: string;
}

/** Aggregate progress reported directly by the badge endpoint. */
export interface BadgeProgress {
  currentValue: number;
  percentage: number;
  requiredValue: number;
}

/** Progress for one ordered requirement of a compound badge. */
export interface BadgeRequirement {
  complete: boolean;
  currentValue: number;
  description: string;
  displayOrder: number;
  id: string;
  requiredValue: number;
}

/** Complete badge definition and the authenticated user's current achievement state. */
export interface BadgeCatalogEntry {
  category: string;
  code: string;
  description: string;
  earned: BadgeEarnedInstance[];
  iconUrl: string | null;
  id: string;
  isRepeatable: boolean;
  name: string;
  pointsReward: number;
  progress: BadgeProgress | null;
  rarity: string;
  requirementValue: number;
  requirements: BadgeRequirement[];
}
