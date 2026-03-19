// ── City-level prayer location ───────────────────────────────────────────────

export interface PrayerCity {
  id: string;
  city: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  prayerCount: number;
  liveSessions: number;
  activeUsers: number;
  lastUpdated: string;
}

// ── Country-level aggregation ────────────────────────────────────────────────

export interface PrayerCountry {
  countryCode: string;
  countryName: string;
  prayerCount: number;
  activeUsers: number;
  liveSessions: number;
}

// ── Map view mode ────────────────────────────────────────────────────────────

export type PrayerMapView = 'city' | 'country';

// ── Tooltip data ─────────────────────────────────────────────────────────────

export interface MapTooltipData {
  x: number;
  y: number;
  name: string;
  prayerCount: number;
  activeUsers: number;
  liveSessions: number;
  /** City only */
  countryName?: string;
}

// ── Selected location detail ─────────────────────────────────────────────────

export interface SelectedLocationDetail {
  id: string;
  name: string;
  countryName?: string;
  prayerCount: number;
  activeUsers: number;
  liveSessions: number;
  latitude?: number;
  longitude?: number;
}

// ── Summary stats ────────────────────────────────────────────────────────────

export interface PrayerMapSummary {
  totalPrayers: number;
  mostActiveCity: string;
  mostActiveCountry: string;
  totalLiveSessions: number;
}

// ── DB row (snake_case from Supabase) ────────────────────────────────────────

export interface PrayerLocationRow {
  id: number;
  city: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  prayer_count: number;
  live_sessions: number;
  active_users: number;
  last_updated: string;
}
