import { Json } from './database';

export type XPActionType =
  | 'rosary_completed'
  | 'daily_activity'
  | 'streak'
  | 'helping_user'
  | 'prayer_request_submitted'
  | 'prayer_request_engagement'
  | 'friend_invite'
  | 'level_up';

export interface XPRule {
  actionType: string;
  xpValue: number;
  optionalConditions: Json;
  isActive: boolean;
}

export interface XPLevelConfig {
  level: number;
  title: string;
  minXp: number;
  badgeKey?: string | null;
}

export interface UserXP {
  id: string;
  userId: string;
  totalXp: number;
  currentLevel: number;
  currentTitle: string;
  updatedAt: string;
}

export interface XPEvent {
  id: number;
  userId: string;
  type: string;
  xpAmount: number;
  metadata: Json;
  idempotencyKey?: string | null;
  createdAt: string;
}

export interface WeeklyXPBreakdownItem {
  type: string;
  totalXp: number;
  events: number;
}

export interface WeeklyXPSummary {
  totalXp: number;
  eventCount: number;
  breakdown: WeeklyXPBreakdownItem[];
}

export interface SpiritualProgressSnapshot {
  profile: UserXP;
  levels: XPLevelConfig[];
  recentEvents: XPEvent[];
  nextLevel: XPLevelConfig | null;
  xpToNextLevel: number;
  progressPercentToNext: number;
  currentLevelBadgeKey?: string | null;
  weeklySummary: WeeklyXPSummary;
  recentlyLeveledUp: boolean;
}

export interface AwardXPResult {
  duplicate: boolean;
  awardedXp: number;
  totalXp: number;
  previousLevel: number;
  currentLevel: number;
  currentTitle: string;
  leveledUp: boolean;
  nextLevel?: number | null;
  nextTitle?: string | null;
  nextMinXp?: number | null;
}
