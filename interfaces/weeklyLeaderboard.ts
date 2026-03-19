export type LeaderboardMetric = 'xp_only' | 'mixed';
export type WeekStartDay = 'sunday' | 'monday';
export type TieBreaker = 'rosaries_then_streak' | 'streak_then_rosaries';

export interface LeaderboardConfig {
  weekStartDay: WeekStartDay;
  rankingMetric: LeaderboardMetric;
  tieBreaker: TieBreaker;
}

export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  pictureUrl: string | null;
  totalXp: number;
  rosariesCount: number;
  streakDays: number;
  invitesCount: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface WeeklyLeaderboardData {
  entries: LeaderboardEntry[];
  weekStart: string;
  weekEnd: string;
  totalParticipants: number;
}

export interface UserLeaderboardPosition {
  currentRank: number;
  totalXp: number;
  xpToNextRank: number;
  nextRankUser: string | null;
  neighbors: LeaderboardEntry[];
}

export interface LeaderboardHistoryEntry {
  weekStart: string;
  rank: number;
  totalXp: number;
  snapshotData: {
    rosariesCount?: number;
    streakDays?: number;
    invitesCount?: number;
  };
}

export type LeaderboardTab = 'this_week' | 'last_week' | 'all_time';
