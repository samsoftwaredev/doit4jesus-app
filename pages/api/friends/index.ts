import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = await requireAuth(req, res);
  if (!userId) return;

  const sb = getServiceSupabase();

  if (req.method === 'GET') {
    try {
      const { data, error } = await sb
        .from('friends')
        .select('*')
        .or(`uuid1.eq.${userId},uuid2.eq.${userId}`);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      console.error('GET /api/friends error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).json({ error: 'Method not allowed' });
}
