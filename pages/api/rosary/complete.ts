import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
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
    const { onlineUsers } = req.body ?? {};
    const userClient = getUserSupabase(token);

    const { data, error } = await userClient.functions.invoke(
      'rosary-completed',
      { body: { onlineUsers: onlineUsers ?? [] } },
    );

    if (error) {
      console.error('rosary-completed edge function error:', error);
      return res.status(500).json({ error: 'Unable to record rosary' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('POST /api/rosary/complete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
