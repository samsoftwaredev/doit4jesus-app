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

  // GET — list pending friend requests for this user
  if (req.method === 'GET') {
    try {
      const { data, error } = await sb
        .from('friend_requests')
        .select('*')
        .or(`uuid1.eq.${userId},uuid2.eq.${userId}`);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      console.error('GET /api/friends/requests error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST — send a new friend request
  if (req.method === 'POST') {
    try {
      const { uuid1, uuid2, uuid1_accepted, uuid2_accepted } = req.body ?? {};

      if (!uuid1 || !uuid2) {
        return res.status(400).json({ error: 'uuid1 and uuid2 are required' });
      }

      // Ensure the caller is one of the two UUIDs
      if (uuid1 !== userId && uuid2 !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { data, error } = await sb
        .from('friend_requests')
        .insert([{ uuid1, uuid2, uuid1_accepted, uuid2_accepted }])
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) {
      console.error('POST /api/friends/requests error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
