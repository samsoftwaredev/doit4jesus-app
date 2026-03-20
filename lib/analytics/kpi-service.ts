/**
 * Admin KPI Service — server-side analytics queries.
 *
 * All functions accept a Supabase service-role client and return typed KPI data.
 * These run ONLY in API routes, never on the client.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

import type {
  Alert,
  CohortRow,
  EngagementMetrics,
  Insight,
  KpiAlerts,
  KpiCohorts,
  KpiOverview,
  KpiTrends,
  TrendPoint,
} from '@/interfaces/kpi';

// ─── Helpers ────────────────────────────────────────────────────────────────

const todayISO = () => new Date().toISOString().slice(0, 10);

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const weekAgo = () => daysAgo(7);
const monthAgo = () => daysAgo(30);

const pct = (num: number, den: number): number =>
  den === 0 ? 0 : Math.round((num / den) * 1000) / 10;

// ─── Overview KPIs ──────────────────────────────────────────────────────────

export const getKpiOverview = async (
  sb: SupabaseClient,
): Promise<KpiOverview> => {
  const today = todayISO();
  const d7 = weekAgo();
  const d30 = monthAgo();

  // All queries in parallel
  const [
    totalUsersRes,
    signupsTodayRes,
    signups7dRes,
    signups30dRes,
    dauRes,
    wauRes,
    mauRes,
    rosariesTodayRes,
    rosaries30dRes,
    d1RetentionRes,
    d7RetentionRes,
    d30RetentionRes,
  ] = await Promise.all([
    // Total users
    sb.from('profiles').select('id', { count: 'exact', head: true }),
    // Signups today
    sb
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', today),
    // Signups last 7d
    sb
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', d7),
    // Signups last 30d
    sb
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', d30),
    // DAU: distinct users with rosary_stats or xp_events today
    sb
      .from('xp_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', today),
    // WAU
    sb
      .from('xp_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', d7),
    // MAU
    sb
      .from('xp_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', d30),
    // Rosaries completed today
    sb
      .from('rosary_stats')
      .select('id', { count: 'exact', head: true })
      .gte('completed_at', today),
    // Rosaries completed in 30d
    sb
      .from('rosary_stats')
      .select('id', { count: 'exact', head: true })
      .gte('completed_at', d30),
    // D1 retention: users who signed up yesterday AND have activity today
    sb.rpc('admin_retention_d1' as any).maybeSingle(),
    sb.rpc('admin_retention_d7' as any).maybeSingle(),
    sb.rpc('admin_retention_d30' as any).maybeSingle(),
  ]);

  const totalUsers = totalUsersRes.count ?? 0;
  const mau = mauRes.count ?? 0;
  const dau = dauRes.count ?? 0;

  // Retention: if RPCs don't exist, compute approximate from counts
  const d1Val = (d1RetentionRes.data as any)?.retention ?? 0;
  const d7Val = (d7RetentionRes.data as any)?.retention ?? 0;
  const d30Val = (d30RetentionRes.data as any)?.retention ?? 0;

  // Conversion: signup->active = MAU / total users
  const signupToActive = pct(mau, totalUsers);

  // Churn = users who were active 30d+ ago but NOT in last 30d
  const churnRate =
    totalUsers > 0 ? Math.max(0, 100 - pct(mau, totalUsers)) : 0;

  // Task completion: rosaries done today vs DAU
  const rosariesToday = rosariesTodayRes.count ?? 0;
  const taskCompletionRate = pct(rosariesToday, Math.max(dau, 1));

  return {
    totalUsers,
    dau,
    wau: wauRes.count ?? 0,
    mau,
    newSignups: {
      today: signupsTodayRes.count ?? 0,
      last7d: signups7dRes.count ?? 0,
      last30d: signups30dRes.count ?? 0,
    },
    retention: {
      d1: d1Val,
      d7: d7Val,
      d30: d30Val,
    },
    conversion: {
      visitorToSignup: 0, // needs web analytics (GA / Vercel Analytics)
      signupToActive,
    },
    churnRate,
    taskCompletionRate,
  };
};

// ─── Trend data ─────────────────────────────────────────────────────────────

export const getKpiTrends = async (
  sb: SupabaseClient,
  days: number = 30,
): Promise<KpiTrends> => {
  const since = daysAgo(days);

  // Fetch raw data
  const [signupsRaw, rosariesRaw, xpRaw] = await Promise.all([
    sb
      .from('profiles')
      .select('created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true }),
    sb
      .from('rosary_stats')
      .select('completed_at')
      .gte('completed_at', since)
      .order('completed_at', { ascending: true }),
    sb
      .from('xp_events')
      .select('created_at, xp_amount, user_id')
      .gte('created_at', since)
      .order('created_at', { ascending: true }),
  ]);

  const signupsByDay = groupByDay(
    (signupsRaw.data ?? []).map((r) => r.created_at!),
    days,
  );
  const rosariesByDay = groupByDay(
    (rosariesRaw.data ?? []).map((r) => r.completed_at),
    days,
  );

  // Active users by day: distinct user_ids per day from xp_events
  const xpRows = xpRaw.data ?? [];
  const activeByDay = groupDistinctByDay(
    xpRows.map((r) => ({ date: r.created_at!, key: r.user_id })),
    days,
  );

  // XP awarded by day
  const xpByDay = groupSumByDay(
    xpRows.map((r) => ({ date: r.created_at!, value: r.xp_amount })),
    days,
  );

  // Cumulative users
  const usersCumulative = cumulativeFromDaily(signupsByDay);

  return {
    users: {
      label: 'Total Users',
      key: 'users',
      data: usersCumulative,
      color: '#6366f1',
    },
    activeUsers: {
      label: 'Active Users',
      key: 'activeUsers',
      data: activeByDay,
      color: '#22c55e',
    },
    signups: {
      label: 'New Signups',
      key: 'signups',
      data: signupsByDay,
      color: '#3b82f6',
    },
    rosariesCompleted: {
      label: 'Rosaries',
      key: 'rosaries',
      data: rosariesByDay,
      color: '#f59e0b',
    },
    xpAwarded: {
      label: 'XP Awarded',
      key: 'xp',
      data: xpByDay,
      color: '#ef4444',
    },
  };
};

// ─── Cohort analysis ────────────────────────────────────────────────────────

export const getKpiCohorts = async (
  sb: SupabaseClient,
  weeks: number = 8,
): Promise<KpiCohorts> => {
  const since = daysAgo(weeks * 7);

  // Fetch all users created since `since` and their activity dates
  const [profilesRes, activityRes] = await Promise.all([
    sb.from('profiles').select('id, created_at').gte('created_at', since),
    sb.from('xp_events').select('user_id, created_at').gte('created_at', since),
  ]);

  const profiles = profilesRes.data ?? [];
  const activity = activityRes.data ?? [];

  // Build user -> signup week map
  const userCohort: Record<string, string> = {};
  const cohortSizes: Record<string, Set<string>> = {};

  for (const p of profiles) {
    const weekKey = getWeekKey(p.created_at!);
    userCohort[p.id] = weekKey;
    if (!cohortSizes[weekKey]) cohortSizes[weekKey] = new Set();
    cohortSizes[weekKey].add(p.id);
  }

  // Build cohort -> week offset -> active users
  const cohortActivity: Record<string, Record<number, Set<string>>> = {};
  for (const a of activity) {
    const uid = a.user_id;
    const cohortKey = userCohort[uid];
    if (!cohortKey) continue;
    const signupDate = new Date(
      profiles.find((p) => p.id === uid)?.created_at ?? '',
    );
    const actDate = new Date(a.created_at!);
    const weekOffset = Math.floor(
      (actDate.getTime() - signupDate.getTime()) / (7 * 86400 * 1000),
    );
    if (weekOffset < 0 || weekOffset > weeks) continue;
    if (!cohortActivity[cohortKey]) cohortActivity[cohortKey] = {};
    if (!cohortActivity[cohortKey][weekOffset])
      cohortActivity[cohortKey][weekOffset] = new Set();
    cohortActivity[cohortKey][weekOffset].add(uid);
  }

  const rows: CohortRow[] = Object.keys(cohortSizes)
    .sort()
    .map((cohort) => {
      const size = cohortSizes[cohort].size;
      const retention: number[] = [];
      for (let w = 0; w <= weeks; w++) {
        const active = cohortActivity[cohort]?.[w]?.size ?? 0;
        retention.push(pct(active, size));
      }
      return { cohort, size, retention };
    });

  return { granularity: 'week', rows };
};

// ─── Engagement metrics ─────────────────────────────────────────────────────

export const getEngagementMetrics = async (
  sb: SupabaseClient,
): Promise<EngagementMetrics> => {
  const d30 = monthAgo();

  const [xpRes, rosaryRes, scriptureRes, prayerMapRes] = await Promise.all([
    sb
      .from('xp_events')
      .select('user_id, type, created_at')
      .gte('created_at', d30),
    sb.from('rosary_stats').select('user_id').gte('completed_at', d30),
    (sb.from as any)('scripture_completions')
      .select('user_id')
      .gte('completed_at', d30),
    sb
      .from('global_prayer_sessions')
      .select('created_by')
      .gte('created_at', d30),
  ]);

  const xpRows = xpRes.data ?? [];
  const distinctUsers = new Set(xpRows.map((r: any) => r.user_id));
  const userCount = Math.max(distinctUsers.size, 1);

  // Sessions per week per user (approximate: xp_events as activity proxy)
  const userDays: Record<string, Set<string>> = {};
  for (const r of xpRows) {
    const uid = r.user_id;
    const day = r.created_at?.slice(0, 10) ?? '';
    if (!userDays[uid]) userDays[uid] = new Set();
    userDays[uid].add(day);
  }
  const avgSessionsPerWeek =
    Object.values(userDays).reduce((s, days) => s + days.size, 0) /
    userCount /
    4.3;

  // Feature adoption
  const rosaryUsers = new Set(
    (rosaryRes.data ?? []).map((r: any) => r.user_id),
  );
  const scriptureUsers = new Set(
    (scriptureRes.data ?? []).map((r: any) => r.user_id),
  );
  const prayerMapUsers = new Set(
    (prayerMapRes.data ?? []).map((r: any) => r.created_by),
  );

  const featureAdoption = [
    { feature: 'Rosary', adoptionPct: pct(rosaryUsers.size, userCount) },
    {
      feature: 'Daily Scripture',
      adoptionPct: pct(scriptureUsers.size, userCount),
    },
    {
      feature: 'Global Prayer Map',
      adoptionPct: pct(prayerMapUsers.size, userCount),
    },
  ];

  // Completion funnel: signed up → visited dashboard → completed rosary → completed scripture
  const totalProfiles =
    (await sb.from('profiles').select('id', { count: 'exact', head: true }))
      .count ?? 0;
  const completionFunnel = [
    { step: 'Signed Up', count: totalProfiles, pct: 100 },
    {
      step: 'Active (30d)',
      count: userCount,
      pct: pct(userCount, totalProfiles),
    },
    {
      step: 'Rosary Completed',
      count: rosaryUsers.size,
      pct: pct(rosaryUsers.size, totalProfiles),
    },
    {
      step: 'Scripture Read',
      count: scriptureUsers.size,
      pct: pct(scriptureUsers.size, totalProfiles),
    },
  ];

  return {
    avgSessionsPerWeek: Math.round(avgSessionsPerWeek * 10) / 10,
    avgSessionDuration: 0, // no session duration tracking yet
    featureAdoption,
    completionFunnel,
  };
};

// ─── Alerts & Insights ──────────────────────────────────────────────────────

export const getKpiAlerts = async (sb: SupabaseClient): Promise<KpiAlerts> => {
  const today = todayISO();
  const d7 = weekAgo();
  const d14 = daysAgo(14);

  // Compare this week vs last week
  const [
    thisWeekXP,
    lastWeekXP,
    thisWeekSignups,
    lastWeekSignups,
    thisWeekRosaries,
    lastWeekRosaries,
  ] = await Promise.all([
    sb
      .from('xp_events')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', d7),
    sb
      .from('xp_events')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', d14)
      .lt('created_at', d7),
    sb
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', d7),
    sb
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', d14)
      .lt('created_at', d7),
    sb
      .from('rosary_stats')
      .select('id', { count: 'exact', head: true })
      .gte('completed_at', d7),
    sb
      .from('rosary_stats')
      .select('id', { count: 'exact', head: true })
      .gte('completed_at', d14)
      .lt('completed_at', d7),
  ]);

  const insights: Insight[] = [];
  const alerts: Alert[] = [];

  // WAU change
  const wauThis = thisWeekXP.count ?? 0;
  const wauLast = lastWeekXP.count ?? 1;
  const wauChange = Math.round(
    ((wauThis - wauLast) / Math.max(wauLast, 1)) * 100,
  );
  insights.push({
    id: 'wau-change',
    text: `Weekly active XP events ${wauChange >= 0 ? 'up' : 'down'} ${Math.abs(wauChange)}% WoW`,
    metric: 'WAU',
    change: wauChange,
    direction: wauChange >= 0 ? 'up' : 'down',
  });

  // Signups change
  const signThis = thisWeekSignups.count ?? 0;
  const signLast = lastWeekSignups.count ?? 1;
  const signChange = Math.round(
    ((signThis - signLast) / Math.max(signLast, 1)) * 100,
  );
  insights.push({
    id: 'signups-change',
    text: `Signups ${signChange >= 0 ? 'up' : 'down'} ${Math.abs(signChange)}% WoW (${signThis} this week)`,
    metric: 'Signups',
    change: signChange,
    direction: signChange >= 0 ? 'up' : 'down',
  });

  // Rosary change
  const rosThis = thisWeekRosaries.count ?? 0;
  const rosLast = lastWeekRosaries.count ?? 1;
  const rosChange = Math.round(
    ((rosThis - rosLast) / Math.max(rosLast, 1)) * 100,
  );
  insights.push({
    id: 'rosaries-change',
    text: `Rosaries completed ${rosChange >= 0 ? 'up' : 'down'} ${Math.abs(rosChange)}% WoW`,
    metric: 'Rosaries',
    change: rosChange,
    direction: rosChange >= 0 ? 'up' : 'down',
  });

  // Alerts for drops > 20%
  if (wauChange < -20) {
    alerts.push({
      id: 'alert-wau-drop',
      severity: 'warning',
      title: 'Weekly Activity Drop',
      message: `XP activity down ${Math.abs(wauChange)}% vs last week`,
      metric: 'WAU',
      value: wauThis,
      threshold: wauLast,
      timestamp: today,
    });
  }
  if (signChange < -30) {
    alerts.push({
      id: 'alert-signup-drop',
      severity: 'critical',
      title: 'Signup Drop',
      message: `New signups down ${Math.abs(signChange)}% vs last week`,
      metric: 'Signups',
      value: signThis,
      threshold: signLast,
      timestamp: today,
    });
  }
  if (rosChange < -25) {
    alerts.push({
      id: 'alert-rosary-drop',
      severity: 'warning',
      title: 'Rosary Completion Drop',
      message: `Rosaries completed down ${Math.abs(rosChange)}% vs last week`,
      metric: 'Rosaries',
      value: rosThis,
      threshold: rosLast,
      timestamp: today,
    });
  }

  return { alerts, insights };
};

// ─── Admin auth check ───────────────────────────────────────────────────────

export const isAdmin = async (
  sb: SupabaseClient,
  userId: string,
): Promise<boolean> => {
  const { data } = await (sb.from as any)('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'admin';
};

// ─── Utility functions ──────────────────────────────────────────────────────

function groupByDay(dates: string[], windowDays: number): TrendPoint[] {
  const counts: Record<string, number> = {};
  for (let i = 0; i < windowDays; i++) {
    counts[daysAgo(windowDays - 1 - i)] = 0;
  }
  for (const d of dates) {
    const key = d?.slice(0, 10);
    if (key && key in counts) counts[key]++;
  }
  return Object.entries(counts).map(([date, value]) => ({ date, value }));
}

function groupDistinctByDay(
  items: { date: string; key: string }[],
  windowDays: number,
): TrendPoint[] {
  const sets: Record<string, Set<string>> = {};
  for (let i = 0; i < windowDays; i++) {
    sets[daysAgo(windowDays - 1 - i)] = new Set();
  }
  for (const item of items) {
    const key = item.date?.slice(0, 10);
    if (key && key in sets) sets[key].add(item.key);
  }
  return Object.entries(sets).map(([date, s]) => ({ date, value: s.size }));
}

function groupSumByDay(
  items: { date: string; value: number }[],
  windowDays: number,
): TrendPoint[] {
  const sums: Record<string, number> = {};
  for (let i = 0; i < windowDays; i++) {
    sums[daysAgo(windowDays - 1 - i)] = 0;
  }
  for (const item of items) {
    const key = item.date?.slice(0, 10);
    if (key && key in sums) sums[key] += item.value;
  }
  return Object.entries(sums).map(([date, value]) => ({ date, value }));
}

function cumulativeFromDaily(daily: TrendPoint[]): TrendPoint[] {
  let running = 0;
  return daily.map(({ date, value }) => {
    running += value;
    return { date, value: running };
  });
}

function getWeekKey(isoDate: string): string {
  const d = new Date(isoDate);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}
