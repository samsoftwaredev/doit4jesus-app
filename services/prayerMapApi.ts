import type {
  PrayerCity,
  PrayerLocationRow,
} from '@/interfaces/globalPrayerMap';
import { apiFetch } from '@/lib/api/client';

// ── Row mapper (snake_case DB → camelCase TS) ────────────────────────────────

const toPrayerCity = (row: PrayerLocationRow): PrayerCity => ({
  id: `${row.city}-${row.country_code}`.toLowerCase().replace(/\s+/g, '-'),
  city: row.city,
  countryCode: row.country_code,
  countryName: row.country_name,
  latitude: Number(row.latitude),
  longitude: Number(row.longitude),
  prayerCount: row.prayer_count,
  liveSessions: row.live_sessions,
  activeUsers: row.active_users,
  lastUpdated: row.last_updated,
});

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all prayer cities via the API route.
 */
export const getPrayerMapCities = async (): Promise<PrayerCity[]> => {
  try {
    const { data } = await apiFetch<{ data: PrayerLocationRow[] }>(
      '/api/prayer-map',
    );
    return (data ?? []).map(toPrayerCity);
  } catch (err) {
    console.error('getPrayerMapCities error:', err);
    return [];
  }
};

/**
 * Start or join a global prayer session (also increments prayer count).
 */
export const startPrayerSession = async (payload: {
  city: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  prayerType: string;
}): Promise<number | null> => {
  try {
    const { sessionId } = await apiFetch<{ sessionId: number }>(
      '/api/prayer-sessions/start',
      { method: 'POST', body: payload },
    );
    return sessionId ?? null;
  } catch (err) {
    console.error('startPrayerSession error:', err);
    return null;
  }
};

/**
 * Join an existing prayer session (also increments prayer count).
 */
export const joinPrayerSession = async (
  sessionId: number,
): Promise<number | null> => {
  try {
    const { participantsCount } = await apiFetch<{
      participantsCount: number;
    }>('/api/prayer-sessions/join', {
      method: 'POST',
      body: { sessionId },
    });
    return participantsCount ?? null;
  } catch (err) {
    console.error('joinPrayerSession error:', err);
    return null;
  }
};
