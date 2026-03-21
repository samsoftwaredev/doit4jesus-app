import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, actionType, metadata, idempotencyKey } = req.body ?? {};

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required' });
  }
  if (!actionType || typeof actionType !== 'string') {
    return res.status(400).json({ error: 'actionType is required' });
  }

  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_action_type: actionType,
      p_metadata: metadata ?? {},
      p_idempotency_key: idempotencyKey ?? null,
    });

    if (error) {
      console.error('award_xp RPC failed:', error);
      if (error.message.includes('No active XP rule for action_type=')) {
        return res.status(422).json({
          error: error.message,
          code: 'XP_RULE_MISSING',
          actionType,
        });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('award_xp API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
