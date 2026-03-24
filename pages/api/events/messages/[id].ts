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
    return res.status(400).json({ error: 'Missing message ID' });
  }

  const sb = getServiceSupabase();

  // Verify ownership
  const { data: msg } = await sb
    .from('event_messages')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!msg || msg.user_id !== userId) {
    return res.status(403).json({ error: 'Not your message' });
  }

  // PATCH — edit message
  if (req.method === 'PATCH') {
    try {
      const { message } = req.body ?? {};
      const { data, error } = await sb
        .from('event_messages')
        .update({
          message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      console.error('PATCH /api/events/messages/[id] error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE — soft-delete message
  if (req.method === 'DELETE') {
    try {
      const { data, error } = await sb
        .from('event_messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      console.error('DELETE /api/events/messages/[id] error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
