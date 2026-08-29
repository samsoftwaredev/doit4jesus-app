export interface UserRosaryStats {
  rosariesPrayed: number;
}

/** Minimal progress model used by the Home dashboard. */
export interface DashboardProgress {
  currentLevel: {
    levelNumber: number;
    name: string | null;
  } | null;
  lifetimePoints: number;
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
