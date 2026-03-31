import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * GET /api/prayer-sessions
 *
 * Returns all active global prayer sessions.
 * Public endpoint — anyone can see what sessions are live.
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
      .from('global_prayer_sessions')
      .select('*')
      .eq('is_active', true)
      .order('participants_count', { ascending: false })
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('GET /api/prayer-sessions error:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    return res.status(200).json({ data: data ?? [] });
  } catch (err) {
    console.error('GET /api/prayer-sessions unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
