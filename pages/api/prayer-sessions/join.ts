import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * POST /api/prayer-sessions/join
 *
 * Joins an existing active prayer session and increments the city prayer count.
 *
 * Body: { sessionId }
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

  const { sessionId } = req.body ?? {};

  if (!sessionId || typeof sessionId !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid sessionId' });
  }

  try {
    const sb = getServiceSupabase();

    // Join the session
    const { data: newCount, error: joinError } = await sb.rpc(
      'join_global_prayer_session',
      { p_session_id: sessionId },
    );

    if (joinError) {
      console.error('POST /api/prayer-sessions/join RPC error:', joinError);
      return res.status(500).json({ error: 'Failed to join session' });
    }

    // Look up the session to get city info for incrementing prayer_locations
    const { data: session } = await sb
      .from('global_prayer_sessions')
      .select('city, country_code, country_name, latitude, longitude')
      .eq('id', sessionId)
      .single();

    if (session && session.country_name) {
      const { error: incError } = await sb.rpc('increment_prayer_count', {
        p_city: session.city,
        p_country_code: session.country_code,
        p_country_name: session.country_name,
        p_latitude: session.latitude,
        p_longitude: session.longitude,
        p_increment: 1,
      });

      if (incError) {
        console.error(
          'POST /api/prayer-sessions/join increment error:',
          incError,
        );
      }
    }

    return res.status(200).json({ participantsCount: newCount });
  } catch (err) {
    console.error('POST /api/prayer-sessions/join error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
