import { db } from '@/classes/SupabaseDB';
import { GlobalPrayerSessionsDB } from '@/interfaces/databaseTable';
import { awardXP } from '@/services/spiritualXp';

export const getActiveGlobalPrayerSessions = async (): Promise<
  GlobalPrayerSessionsDB[]
> => {
  const { data, error } = await db
    .getGlobalPrayerSessions()
    .select('*')
    .eq('is_active', true)
    .order('participants_count', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch global prayer sessions:', error);
    return [];
  }

  return data ?? [];
};

export const joinGlobalPrayerSession = async (
  sessionId: number,
  userId?: string,
): Promise<number | null> => {
  const { data, error } = await db
    .get()
    .rpc('join_global_prayer_session', { p_session_id: sessionId });

  if (error) {
    console.error('Failed to join global prayer session:', error);
    return null;
  }

  if (userId && data !== null) {
    await awardXP(
      userId,
      'helping_user',
      {
        session_id: sessionId,
        source: 'global_prayer_join',
      },
      {
        idempotencyKey: `global_prayer_join:${sessionId}:${userId}`,
      },
    );
  }

  return data ?? null;
};

export const startOrJoinGlobalPrayerSession = async (payload: {
  city: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  prayerType: string;
  createdBy?: string;
}): Promise<number | null> => {
  const { data, error } = await db.get().rpc('upsert_global_prayer_session', {
    p_city: payload.city,
    p_country_code: payload.countryCode,
    p_country_name: payload.countryName,
    p_latitude: payload.latitude,
    p_longitude: payload.longitude,
    p_prayer_type: payload.prayerType,
    p_created_by: payload.createdBy,
  });

  if (error) {
    console.error('Failed to upsert global prayer session:', error);
    return null;
  }

  if (payload.createdBy && data !== null) {
    await awardXP(
      payload.createdBy,
      'helping_user',
      {
        session_id: data,
        source: 'global_prayer_start',
        city: payload.city,
      },
      {
        idempotencyKey: `global_prayer_start:${data}:${payload.createdBy}`,
      },
    );
  }

  return data ?? null;
};
