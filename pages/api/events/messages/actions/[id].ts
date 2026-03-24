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

  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sb = getServiceSupabase();

  try {
    const { likes } = req.body ?? {};
    const { data, error } = await sb
      .from('event_messages_actions')
      .upsert({ likes, id })
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err) {
    console.error('PUT /api/events/messages/actions/[id] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
