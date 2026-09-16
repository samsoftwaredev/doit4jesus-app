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
