import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';
import { apiFetch } from '@/lib/api/client';

/**
 * Fetch active global prayer sessions via API route.
 */
export const getActiveGlobalPrayerSessions = async (): Promise<
  GlobalPrayerSessionsDB[]
> => {
  try {
    const { data } = await apiFetch<{ data: GlobalPrayerSessionsDB[] }>(
      '/api/prayer-sessions',
    );
    return data ?? [];
  } catch (err) {
    console.error('getActiveGlobalPrayerSessions error:', err);
    return [];
  }
};
