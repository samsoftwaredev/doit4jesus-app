import type {
  AwardXPResult,
  SpiritualProgressSnapshot,
  UserXP,
  WeeklyXPSummary,
  XPActionType,
  XPEvent,
  XPLevelConfig,
} from '@/interfaces';

import { supabase } from '../classes';

const toUserXP = (row: any): UserXP => ({
  id: row.id,
  userId: row.user_id,
  totalXp: row.total_xp,
  currentLevel: row.current_level,
  currentTitle: row.current_title,
  updatedAt: row.updated_at,
});

const toXPEvent = (row: any): XPEvent => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  xpAmount: row.xp_amount,
  metadata: row.metadata ?? {},
  idempotencyKey: row.idempotency_key,
  createdAt: row.created_at,
});

const toXPLevelConfig = (row: any): XPLevelConfig => ({
  level: row.level,
  title: row.title,
  minXp: row.min_xp,
  badgeKey: row.badge_key,
});

const toAwardXPResult = (data: any): AwardXPResult => ({
  duplicate: Boolean(data?.duplicate),
  awardedXp: Number(data?.awarded_xp ?? 0),
  totalXp: Number(data?.total_xp ?? 0),
  previousLevel: Number(data?.previous_level ?? 1),
  currentLevel: Number(data?.current_level ?? 1),
  currentTitle: String(data?.current_title ?? 'Orange'),
  leveledUp: Boolean(data?.leveled_up),
  nextLevel:
    data?.next_level === null || data?.next_level === undefined
      ? null
      : Number(data.next_level),
  nextTitle:
    data?.next_title === null || data?.next_title === undefined
      ? null
      : String(data.next_title),
  nextMinXp:
    data?.next_min_xp === null || data?.next_min_xp === undefined
      ? null
      : Number(data.next_min_xp),
});

const buildWeeklySummary = (events: XPEvent[]): WeeklyXPSummary => {
  const weeklyEvents = events.filter((event) => {
    const diff = Date.now() - new Date(event.createdAt).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  });

  const grouped = weeklyEvents.reduce<
    Record<string, { totalXp: number; events: number }>
  >((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = { totalXp: 0, events: 0 };
    }
    acc[event.type].totalXp += event.xpAmount;
    acc[event.type].events += 1;
    return acc;
  }, {});

  const breakdown = Object.entries(grouped)
    .map(([type, value]) => ({
      type,
      totalXp: value.totalXp,
      events: value.events,
    }))
    .sort((a, b) => b.totalXp - a.totalXp);

  return {
    totalXp: weeklyEvents.reduce((sum, event) => sum + event.xpAmount, 0),
    eventCount: weeklyEvents.length,
    breakdown,
  };
};

export const awardXP = async (
  userId: string,
  actionType: XPActionType | string,
  metadata: Record<string, unknown> = {},
  options?: { idempotencyKey?: string },
): Promise<AwardXPResult | null> => {
  try {
    const response = await fetch('/api/xp/award', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        actionType,
        metadata,
        idempotencyKey: options?.idempotencyKey,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      if (
        response.status === 422 &&
        errorBody?.code === 'XP_RULE_MISSING' &&
        typeof actionType === 'string'
      ) {
        console.warn(
          `awardXP skipped: missing active XP rule for ${actionType}`,
        );
        return null;
      }
      console.error('awardXP failed:', errorBody);
      return null;
    }

    const data = await response.json();
    return toAwardXPResult(data);
  } catch (error) {
    console.error('awardXP unexpected error:', error);
    return null;
  }
};

export const getSpiritualProgress = async (
  userId: string,
  options?: { eventsLimit?: number },
): Promise<SpiritualProgressSnapshot | null> => {
  try {
    const eventsLimit = options?.eventsLimit ?? 40;

    const { error: ensureError } = await supabase.rpc('ensure_user_xp_row', {
      p_user_id: userId,
    });
    if (ensureError) {
      console.error('ensure_user_xp_row failed:', ensureError);
      return null;
    }

    const [userXPRes, levelsRes, eventsRes] = await Promise.all([
      supabase.from('user_xp').select('*').eq('user_id', userId).single(),
      supabase
        .from('xp_levels_config')
        .select('*')
        .order('min_xp', { ascending: true }),
      supabase
        .from('xp_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(eventsLimit),
    ]);

    if (userXPRes.error || levelsRes.error || eventsRes.error) {
      console.error('getSpiritualProgress failed:', {
        userXPError: userXPRes.error,
        levelsError: levelsRes.error,
        eventsError: eventsRes.error,
      });
      return null;
    }

    const profile = toUserXP(userXPRes.data);
    const levels = (levelsRes.data ?? []).map(toXPLevelConfig);
    const recentEvents = (eventsRes.data ?? []).map(toXPEvent);

    const currentLevel = levels.find(
      (level: XPLevelConfig) => level.level === profile.currentLevel,
    );
    const nextLevel =
      levels.find((level: XPLevelConfig) => level.minXp > profile.totalXp) ??
      null;

    const currentMinXp = currentLevel?.minXp ?? 0;
    const nextMinXp = nextLevel?.minXp ?? profile.totalXp;
    const span = Math.max(nextMinXp - currentMinXp, 1);
    const progressPercentToNext = nextLevel
      ? Math.min(
          100,
          Math.max(0, ((profile.totalXp - currentMinXp) / span) * 100),
        )
      : 100;

    const latestLevelUp = recentEvents.find(
      (event: XPEvent) => event.type === 'level_up',
    );
    const recentlyLeveledUp = latestLevelUp
      ? Date.now() - new Date(latestLevelUp.createdAt).getTime() <=
        10 * 60 * 1000
      : false;

    return {
      profile,
      levels,
      recentEvents,
      nextLevel,
      xpToNextLevel: nextLevel
        ? Math.max(nextLevel.minXp - profile.totalXp, 0)
        : 0,
      progressPercentToNext,
      currentLevelBadgeKey: currentLevel?.badgeKey,
      weeklySummary: buildWeeklySummary(recentEvents),
      recentlyLeveledUp,
    };
  } catch (error) {
    console.error('getSpiritualProgress unexpected error:', error);
    return null;
  }
};

/**
 * When a user levels up and the new level has a badgeKey,
 * insert the corresponding badge into user_badges.
 */
export const grantLevelUpBadge = async (
  userId: string,
  result: AwardXPResult,
): Promise<void> => {
  if (!result.leveledUp) return;

  try {
    const { data } = await supabase
      .from('xp_levels_config')
      .select('badge_key')
      .eq('level', result.currentLevel)
      .single();

    if (data?.badge_key) {
      await supabase.from('user_badges').upsert(
        {
          user_id: userId,
          badge_key: data.badge_key,
          earned_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,badge_key' },
      );
    }
  } catch (error) {
    console.error('grantLevelUpBadge failed:', error);
  }
};

/**
 * Award XP for each earned badge. Idempotency keys ensure
 * each badge only awards XP once.
 */
export const awardBadgeXP = async (
  userId: string,
  earnedBadges: { badgeKey: string }[],
): Promise<void> => {
  for (const badge of earnedBadges) {
    const result = await awardXP(
      userId,
      'badge_earned',
      { badge_key: badge.badgeKey },
      { idempotencyKey: `badge_earned:${badge.badgeKey}` },
    );
    if (result) {
      await grantLevelUpBadge(userId, result);
    }
  }
};
