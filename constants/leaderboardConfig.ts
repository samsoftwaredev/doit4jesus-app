import type {
  LeaderboardConfig,
  WeekStartDay,
} from '@/interfaces/weeklyLeaderboard';

const DEFAULT_CONFIG: LeaderboardConfig = {
  weekStartDay: 'monday',
  rankingMetric: 'xp_only',
  tieBreaker: 'rosaries_then_streak',
};

let cachedConfig: LeaderboardConfig | null = null;

export const getLeaderboardConfig = (): LeaderboardConfig =>
  cachedConfig ?? DEFAULT_CONFIG;

export const setLeaderboardConfig = (
  config: Partial<LeaderboardConfig>,
): void => {
  cachedConfig = { ...getLeaderboardConfig(), ...config };
};

/** Returns the start (inclusive) and end (inclusive) dates for the current week. */
export const getCurrentWeekRange = (
  weekStartDay: WeekStartDay = getLeaderboardConfig().weekStartDay,
): { weekStart: string; weekEnd: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const targetStart = weekStartDay === 'monday' ? 1 : 0;

  let diff = dayOfWeek - targetStart;
  if (diff < 0) diff += 7;

  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10),
  };
};

/** Returns the previous week's range. */
export const getLastWeekRange = (
  weekStartDay: WeekStartDay = getLeaderboardConfig().weekStartDay,
): { weekStart: string; weekEnd: string } => {
  const { weekStart } = getCurrentWeekRange(weekStartDay);
  const start = new Date(weekStart);
  start.setDate(start.getDate() - 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10),
  };
};

/** Milliseconds until the next week reset. */
export const getMillisUntilReset = (
  weekStartDay: WeekStartDay = getLeaderboardConfig().weekStartDay,
): number => {
  const { weekEnd } = getCurrentWeekRange(weekStartDay);
  const end = new Date(weekEnd);
  end.setHours(23, 59, 59, 999);

  const nextReset = new Date(end);
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);

  return Math.max(0, nextReset.getTime() - Date.now());
};
