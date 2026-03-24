import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await requireAuth(req, res);
  if (!userId) return;

  const { userIds } = req.body ?? {};

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'userIds array is required' });
  }

  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb.rpc('get_profiles_by_user_ids', {
      user_ids: userIds,
    });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  } catch (err) {
    console.error('POST /api/friends/profiles error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
