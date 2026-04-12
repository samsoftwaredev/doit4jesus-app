import type {
  PrayerCity,
  PrayerLocationRow,
} from '@/interfaces/globalPrayerMap';

import { supabase } from '../classes';

// ── Row mapper (snake_case DB → camelCase TS) ────────────────────────────────

const toPrayerCity = (row: PrayerLocationRow): PrayerCity => ({
  id: `${row.city}-${row.country_code}`.toLowerCase().replace(/\s+/g, '-'),
  city: row.city,
  countryCode: row.country_code,
  countryName: row.country_name,
  latitude: Number(row.latitude),
  longitude: Number(row.longitude),
  prayerCount: row.prayer_count,
  activeUsers: row.active_users,
  lastUpdated: row.last_updated,
});

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all prayer cities ordered by prayer count.
 * Uses the `get_prayer_map_cities` RPC when available,
 * falls back to a direct table query.
 */
export const getPrayerMapCities = async (): Promise<PrayerCity[]> => {
  try {
    const { data, error } = await (supabase.from as any)('prayer_locations')
      .select('*')
      .order('prayer_count', { ascending: false });

    if (error) {
      console.error('getPrayerMapCities failed:', error);
      return [];
    }

    return ((data as PrayerLocationRow[]) ?? []).map(toPrayerCity);
  } catch (err) {
    console.error('getPrayerMapCities unexpected error:', err);
    return [];
  }
};

/**
 * Increment the prayer count for a city (upsert).
 */
export const incrementPrayerCount = async (payload: {
  city: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  increment?: number;
}): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('increment_prayer_count', {
      p_city: payload.city,
      p_country_code: payload.countryCode,
      p_country_name: payload.countryName,
      p_latitude: payload.latitude,
      p_longitude: payload.longitude,
      p_increment: payload.increment ?? 1,
    });

    if (error) {
      console.error('incrementPrayerCount RPC failed:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('incrementPrayerCount unexpected error:', err);
    return false;
  }
};
