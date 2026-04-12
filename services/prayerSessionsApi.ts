import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';
import { apiFetch } from '@/lib/api/client';

export interface ActiveSessionsResult {
  sessions: GlobalPrayerSessionsDB[];
  activeOnlineUsers: number;
}

/**
 * Fetch active global prayer sessions and online user count via API route.
 */
export const getActiveGlobalPrayerSessions =
  async (): Promise<ActiveSessionsResult> => {
    try {
      const { data, activeOnlineUsers } = await apiFetch<{
        data: GlobalPrayerSessionsDB[];
        activeOnlineUsers: number;
      }>('/api/prayer-sessions');
      return {
        sessions: data ?? [],
        activeOnlineUsers: activeOnlineUsers ?? 0,
      };
    } catch (err) {
      console.error('getActiveGlobalPrayerSessions error:', err);
      return { sessions: [], activeOnlineUsers: 0 };
    }
  };
