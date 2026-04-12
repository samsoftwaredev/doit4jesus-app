import { db, supabase } from '@/classes/SupabaseDB';
import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';

const ACTIVE_THRESHOLD_MINUTES = 120; // 2 hours

interface ActiveSessionsResult {
  sessions: GlobalPrayerSessionsDB[];
  activeOnlineUsers: number;
}

export const getActiveGlobalPrayerSessions =
  async (): Promise<ActiveSessionsResult> => {
    const twoHoursAgo = new Date(
      Date.now() - ACTIVE_THRESHOLD_MINUTES * 60_000,
    ).toISOString();

    const [sessionsRes, activeUsersRes] = await Promise.all([
      db
        .getGlobalPrayerSessions()
        .select('*')
        .eq('is_active', true)
        .order('participants_count', { ascending: false })
        .order('updated_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('last_seen', twoHoursAgo),
    ]);

    if (sessionsRes.error) {
      console.error(
        'Failed to fetch global prayer sessions:',
        sessionsRes.error,
      );
    }

    if (activeUsersRes.error) {
      console.error('Failed to fetch active user count:', activeUsersRes.error);
    }

    return {
      sessions: sessionsRes.data ?? [],
      activeOnlineUsers: activeUsersRes.count ?? 0,
    };
  };
