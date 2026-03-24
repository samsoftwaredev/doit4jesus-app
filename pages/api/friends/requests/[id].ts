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
    return res.status(400).json({ error: 'Missing request ID' });
  }

  const sb = getServiceSupabase();

  // Verify this request belongs to the caller
  const { data: request } = await sb
    .from('friend_requests')
    .select('uuid1, uuid2')
    .eq('id', id)
    .single();

  if (!request || (request.uuid1 !== userId && request.uuid2 !== userId)) {
    return res.status(403).json({ error: 'Not your friend request' });
  }

  // PATCH — approve friend request
  if (req.method === 'PATCH') {
    try {
      const uuidKey =
        request.uuid1 !== userId ? 'uuid2_accepted' : 'uuid1_accepted';
      // The approver is the one whose uuid matches, so we set THEIR accepted flag
      const approverKey =
        request.uuid1 === userId ? 'uuid1_accepted' : 'uuid2_accepted';

      const { data, error } = await sb
        .from('friend_requests')
        .update({ [approverKey]: true })
        .eq('id', id)
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      console.error('PATCH /api/friends/requests/[id] error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE — decline / cancel friend request
  if (req.method === 'DELETE') {
    try {
      const { error } = await sb.from('friend_requests').delete().eq('id', id);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/friends/requests/[id] error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
