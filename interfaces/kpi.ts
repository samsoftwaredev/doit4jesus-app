// ─── Admin Dashboard KPI Types ──────────────────────────────────────────────

/** Available date range presets for the filter bar */
export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'custom';

/** Platform filter values */
export type PlatformFilter = 'all' | 'web' | 'ios' | 'android';

/** Segment filter */
export type UserSegment = 'all' | 'new' | 'returning' | 'power';

// ─── Filter state ───────────────────────────────────────────────────────────

export interface AdminFilters {
  dateRange: DateRangePreset;
  customStart?: string; // ISO date
  customEnd?: string;
  platform: PlatformFilter;
  segment: UserSegment;
}

// ─── KPI Card data ──────────────────────────────────────────────────────────

export interface KpiValue {
  label: string;
  value: number | string;
  change?: number; // percentage vs previous period
  changeLabel?: string;
  unit?: string; // '%', '$', etc.
}

// ─── Overview payload ───────────────────────────────────────────────────────

export interface KpiOverview {
  totalUsers: number;
  dau: number;
  wau: number;
  mau: number;
  newSignups: { today: number; last7d: number; last30d: number };
  retention: { d1: number; d7: number; d30: number }; // percentages
  conversion: { visitorToSignup: number; signupToActive: number }; // percentages
  churnRate: number; // percentage
  taskCompletionRate: number; // percentage — rosary completion rate
  revenue?: { mrr: number; total: number; arpu: number };
}

// ─── Trend data (line/area charts) ──────────────────────────────────────────

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface TrendSeries {
  label: string;
  key: string;
  data: TrendPoint[];
  color?: string;
}

export interface KpiTrends {
  users: TrendSeries;
  activeUsers: TrendSeries;
  signups: TrendSeries;
  rosariesCompleted: TrendSeries;
  xpAwarded: TrendSeries;
}

// ─── Cohort analysis ────────────────────────────────────────────────────────

export interface CohortRow {
  cohort: string; // e.g. "2026-W10" or "2026-03"
  size: number;
  retention: number[]; // [week0, week1, week2, ...] as percentages (100, 72, 55, ...)
}

export interface KpiCohorts {
  granularity: 'week' | 'month';
  rows: CohortRow[];
}

// ─── Alerts & insights ─────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
}

export interface Insight {
  id: string;
  text: string;
  metric: string;
  change: number; // percentage
  direction: 'up' | 'down';
}

export interface KpiAlerts {
  alerts: Alert[];
  insights: Insight[];
}

// ─── Engagement ─────────────────────────────────────────────────────────────

export interface EngagementMetrics {
  avgSessionsPerWeek: number;
  avgSessionDuration: number; // seconds
  featureAdoption: { feature: string; adoptionPct: number }[];
  completionFunnel: { step: string; count: number; pct: number }[];
}

// ─── Table row for paginated data ───────────────────────────────────────────

export interface KpiTableRow {
  [key: string]: string | number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── API response wrapper ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
