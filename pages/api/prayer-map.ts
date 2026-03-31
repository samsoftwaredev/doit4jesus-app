import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * GET /api/prayer-map
 *
 * Returns all prayer locations ordered by prayer_count DESC.
 * Public endpoint (no auth required) — map data is visible to everyone.
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

    const { data, error } = await sb
      .from('prayer_locations')
      .select('*')
      .order('prayer_count', { ascending: false });

    if (error) {
      console.error('GET /api/prayer-map error:', error);
      return res.status(500).json({ error: 'Failed to fetch prayer map data' });
    }

    return res.status(200).json({ data: data ?? [] });
  } catch (err) {
    console.error('GET /api/prayer-map unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
