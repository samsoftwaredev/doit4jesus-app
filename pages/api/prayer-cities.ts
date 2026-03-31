import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * GET /api/prayer-cities
 * Returns the canonical list of prayer cities (city, country, lat/lng).
 * Public endpoint (no auth required).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sb = getServiceSupabase();
    // Get all unique city/country pairs from prayer_locations (canonical source)
    const { data, error } = await sb
      .from('prayer_locations')
      .select('city, country_code, country_name, latitude, longitude')
      .order('city', { ascending: true });

    if (error) {
      console.error('GET /api/prayer-cities error:', error);
      return res.status(500).json({ error: 'Failed to fetch city list' });
    }

    // Remove duplicates (if any)
    const unique = Array.from(
      new Map(
        (data ?? []).map((row) => [
          `${row.city.toLowerCase()}-${row.country_code.toLowerCase()}`,
          row,
        ]),
      ).values(),
    );

    return res.status(200).json({ data: unique });
  } catch (err) {
    console.error('GET /api/prayer-cities unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
