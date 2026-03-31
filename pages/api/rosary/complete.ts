import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';
import { getUserSupabase } from '@/lib/supabase/userClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.slice(7) ?? '';
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const { onlineUsers, location } = req.body ?? {};
    const userClient = getUserSupabase(token);

    const { data, error } = await userClient.functions.invoke(
      'rosary-completed',
      { body: { onlineUsers: onlineUsers ?? [] } },
    );

    if (error) {
      console.error('rosary-completed edge function error:', error);
      return res.status(500).json({ error: 'Unable to record rosary' });
    }

    // ── Increment prayer_locations for the map ─────────────────────────
    // Location resolution priority:
    //   1. Explicit location from request body
    //   2. Profile city (user's saved location)
    //   3. No location → skip silently
    try {
      const sb = getServiceSupabase();
      let resolved: {
        city: string;
        countryCode: string;
        countryName: string;
        latitude: number;
        longitude: number;
      } | null = null;

      if (
        location?.city &&
        location?.countryCode &&
        location?.countryName &&
        location?.latitude != null &&
        location?.longitude != null
      ) {
        resolved = {
          city: location.city,
          countryCode: location.countryCode,
          countryName: location.countryName,
          latitude: location.latitude,
          longitude: location.longitude,
        };
      } else {
        // Fallback: look up user's profile location
        const { data: profile } = await sb
          .from('profiles')
          .select('city, state')
          .eq('id', userId)
          .single();

        if (profile?.city) {
          // Look up the city in prayer_locations to get coordinates
          const { data: loc } = await sb
            .from('prayer_locations')
            .select('city, country_code, country_name, latitude, longitude')
            .ilike('city', profile.city)
            .limit(1)
            .single();

          if (loc) {
            resolved = {
              city: loc.city,
              countryCode: loc.country_code,
              countryName: loc.country_name,
              latitude: Number(loc.latitude),
              longitude: Number(loc.longitude),
            };
          }
        }
      }

      if (resolved) {
        await sb.rpc('increment_prayer_count', {
          p_city: resolved.city,
          p_country_code: resolved.countryCode,
          p_country_name: resolved.countryName,
          p_latitude: resolved.latitude,
          p_longitude: resolved.longitude,
          p_increment: 1,
        });
      }
    } catch (locErr) {
      // Non-fatal: rosary was already recorded, map update is best-effort
      console.error(
        'rosary/complete: prayer location increment failed:',
        locErr,
      );
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('POST /api/rosary/complete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
