import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * POST /api/prayer-sessions/start
 *
 * Creates or joins an active global prayer session for the given city.
 * Also increments the prayer_locations count for that city.
 *
 * Body: { city, countryCode, countryName, latitude, longitude, prayerType }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await requireAuth(req, res);
  if (!userId) return;

  const { city, countryCode, countryName, latitude, longitude, prayerType } =
    req.body ?? {};

  if (
    !city ||
    !countryCode ||
    !countryName ||
    latitude == null ||
    longitude == null ||
    !prayerType
  ) {
    return res.status(400).json({
      error:
        'Missing required fields: city, countryCode, countryName, latitude, longitude, prayerType',
    });
  }

  try {
    const sb = getServiceSupabase();

    // Upsert the session
    const { data: sessionId, error: sessionError } = await sb.rpc(
      'upsert_global_prayer_session',
      {
        p_city: city,
        p_country_code: countryCode,
        p_country_name: countryName,
        p_latitude: latitude,
        p_longitude: longitude,
        p_prayer_type: prayerType,
        p_created_by: userId,
      },
    );

    if (sessionError) {
      console.error('POST /api/prayer-sessions/start RPC error:', sessionError);
      return res.status(500).json({ error: 'Failed to start session' });
    }

    // Also increment the prayer count for this city
    const { error: incError } = await sb.rpc('increment_prayer_count', {
      p_city: city,
      p_country_code: countryCode,
      p_country_name: countryName,
      p_latitude: latitude,
      p_longitude: longitude,
      p_increment: 1,
    });

    if (incError) {
      console.error(
        'POST /api/prayer-sessions/start increment error:',
        incError,
      );
      // Non-fatal — session was already created
    }

    return res.status(200).json({ sessionId });
  } catch (err) {
    console.error('POST /api/prayer-sessions/start error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
