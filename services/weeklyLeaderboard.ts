import type {
  LeaderboardEntry,
  LeaderboardHistoryEntry,
  LeaderboardTab,
  UserLeaderboardPosition,
  WeeklyLeaderboardData,
} from '@/interfaces/weeklyLeaderboard';

import { supabase } from '../classes';
import {
  getCurrentWeekRange,
  getLastWeekRange,
} from '../constants/leaderboardConfig';

// ── Row mappers ──────────────────────────────────────────────────────────────

const toLeaderboardEntry = (row: any): LeaderboardEntry => ({
  userId: row.user_id,
  firstName: row.first_name ?? '',
  lastName: row.last_name ?? '',
  pictureUrl: row.picture_url ?? null,
  totalXp: Number(row.total_xp ?? 0),
  rosariesCount: Number(row.rosaries_count ?? 0),
  streakDays: Number(row.streak_days ?? 0),
  invitesCount: Number(row.invites_count ?? 0),
  rank: Number(row.rank ?? 0),
  isCurrentUser: Boolean(row.is_current_user),
});

const toHistoryEntry = (row: any): LeaderboardHistoryEntry => ({
  weekStart: row.week_start,
  rank: Number(row.rank ?? 0),
  totalXp: Number(row.total_xp ?? 0),
  snapshotData: {
    rosariesCount: row.snapshot_data?.rosaries_count,
    streakDays: row.snapshot_data?.streak_days,
    invitesCount: row.snapshot_data?.invites_count,
  },
});

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches the leaderboard for the given tab (this_week, last_week).
 * Uses the Supabase RPC `get_weekly_leaderboard`.
 */
export const getWeeklyLeaderboard = async (
  tab: LeaderboardTab = 'this_week',
  limit = 50,
): Promise<WeeklyLeaderboardData | null> => {
  try {
    const range =
      tab === 'last_week' ? getLastWeekRange() : getCurrentWeekRange();

    const { data, error } = await (supabase.rpc as any)(
      'get_weekly_leaderboard',
      {
        p_week_start: range.weekStart,
        p_week_end: range.weekEnd,
        p_limit: limit,
      },
    );

    if (error) {
      console.error('getWeeklyLeaderboard RPC failed:', error);
      return null;
    }

    const entries: LeaderboardEntry[] = ((data as any[]) ?? []).map(
      toLeaderboardEntry,
    );

    return {
      entries,
      weekStart: range.weekStart,
      weekEnd: range.weekEnd,
      totalParticipants: entries.length,
    };
  } catch (err) {
    console.error('getWeeklyLeaderboard unexpected error:', err);
    return null;
  }
};

/**
 * Fetches the current user's rank + surrounding neighbors.
 */
export const getMyLeaderboardPosition = async (
  userId: string,
  tab: LeaderboardTab = 'this_week',
  neighbors = 3,
): Promise<UserLeaderboardPosition | null> => {
  try {
    const range =
      tab === 'last_week' ? getLastWeekRange() : getCurrentWeekRange();

    const { data, error } = await (supabase.rpc as any)(
      'get_weekly_leaderboard_me',
      {
        p_user_id: userId,
        p_week_start: range.weekStart,
        p_week_end: range.weekEnd,
        p_neighbors: neighbors,
      },
    );

    if (error) {
      console.error('getMyLeaderboardPosition RPC failed:', error);
      return null;
    }

    const entries: LeaderboardEntry[] = ((data as any[]) ?? []).map(
      toLeaderboardEntry,
    );
    const me = entries.find((e) => e.isCurrentUser);

    if (!me) {
      return {
        currentRank: 0,
        totalXp: 0,
        xpToNextRank: 0,
        nextRankUser: null,
        neighbors: entries,
      };
    }

    const nextAbove = entries.find((e) => e.rank === me.rank - 1);

    return {
      currentRank: me.rank,
      totalXp: me.totalXp,
      xpToNextRank: nextAbove ? nextAbove.totalXp - me.totalXp : 0,
      nextRankUser: nextAbove
        ? `${nextAbove.firstName} ${nextAbove.lastName}`.trim()
        : null,
      neighbors: entries,
    };
  } catch (err) {
    console.error('getMyLeaderboardPosition unexpected error:', err);
    return null;
  }
};

/**
 * Fetches the user's leaderboard history (past weeks).
 */
export const getLeaderboardHistory = async (
  userId: string,
  limit = 12,
): Promise<LeaderboardHistoryEntry[]> => {
  try {
    const { data, error } = await (supabase.from as any)('leaderboard_history')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('getLeaderboardHistory failed:', error);
      return [];
    }

    return (data ?? []).map(toHistoryEntry);
  } catch (err) {
    console.error('getLeaderboardHistory unexpected error:', err);
    return [];
  }
};

/**
 * Localizes leaderboard entries using the translation object (pass-through for now).
 */
export const localizeLeaderboardData = (
  data: WeeklyLeaderboardData,
): WeeklyLeaderboardData => data;
