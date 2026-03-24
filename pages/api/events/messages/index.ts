import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sb = getServiceSupabase();

  // GET — fetch messages for an event
  if (req.method === 'GET') {
    const { eventId } = req.query;
    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({ error: 'eventId query param is required' });
    }

    try {
      const joinTables = `
        created_at, deleted_at, donation_amount, event_id, first_name, id,
        last_name, message, reply_id, updated_at, user_id,
        event_messages_actions(id, likes, flagged, created_at)
      `;
      const { data, error } = await sb
        .from('event_messages')
        .select(joinTables)
        .order('created_at', { ascending: false })
        .eq('event_id', Number(eventId));

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      console.error('GET /api/events/messages error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST — send a new message (auth required)
  if (req.method === 'POST') {
    const userId = await requireAuth(req, res);
    if (!userId) return;

    const { message, firstName, lastName, eventId } = req.body ?? {};
    if (!message || !eventId) {
      return res
        .status(400)
        .json({ error: 'message and eventId are required' });
    }

    try {
      const { data, error } = await sb
        .from('event_messages')
        .insert([
          {
            message,
            first_name: firstName,
            last_name: lastName,
            event_id: eventId,
            user_id: userId,
          },
        ])
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    } catch (err) {
      console.error('POST /api/events/messages error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
