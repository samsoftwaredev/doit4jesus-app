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
    const sb = getServiceSupabase();
    const { lang } = req.query;

    let query = sb
      .from('events')
      .select('*')
      .order('started_at', { ascending: false });

    if (lang && typeof lang === 'string') {
      query = query.or(`language.eq.${lang},language.is.null`);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err) {
    console.error('GET /api/events error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
