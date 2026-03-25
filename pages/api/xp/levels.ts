import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('xp_levels_config')
      .select('level,title,min_xp,badge_key')
      .order('level', { ascending: true });

    if (error) {
      console.error('xp levels API error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ levels: data ?? [] });
  } catch (err) {
    console.error('xp levels API unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
