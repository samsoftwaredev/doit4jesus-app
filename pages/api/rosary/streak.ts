import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getUserSupabase } from '@/lib/supabase/userClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.slice(7) ?? '';
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const userClient = getUserSupabase(token);
    const { data, error } = await userClient.functions.invoke(
      'get_rosary_streak',
      { body: { user_id: userId } },
    );

    if (error) {
      console.error('get_rosary_streak edge function error:', error);
      return res.status(500).json({ error: 'Unable to fetch streak' });
    }

    return res.status(200).json({ streak: data?.streak ?? 0 });
  } catch (err) {
    console.error('GET /api/rosary/streak error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
