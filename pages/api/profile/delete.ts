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
    const userClient = getUserSupabase(token);
    const { data, error } = await userClient.functions.invoke('delete-user');

    if (error) {
      console.error('delete-user edge function error:', error);
      return res.status(500).json({ error: 'Unable to delete account' });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('POST /api/profile/delete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
