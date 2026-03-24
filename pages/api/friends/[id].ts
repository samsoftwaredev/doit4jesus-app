import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = await requireAuth(req, res);
  if (!userId) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing friend ID' });
  }

  const sb = getServiceSupabase();

  if (req.method === 'DELETE') {
    try {
      // Verify the friendship belongs to the caller
      const { data: friendship } = await sb
        .from('friends')
        .select('uuid1, uuid2')
        .eq('id', id)
        .single();

      if (
        !friendship ||
        (friendship.uuid1 !== userId && friendship.uuid2 !== userId)
      ) {
        return res.status(403).json({ error: 'Not your friendship' });
      }

      const { error } = await sb.from('friends').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/friends/[id] error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
