import type { NextApiRequest, NextApiResponse } from 'next';

import {
  getCurrentWeekRange,
  getLastWeekRange,
} from '@/constants/leaderboardConfig';
import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const tab = req.query.tab === 'last_week' ? 'last_week' : 'this_week';
    const neighbors = Math.min(Number(req.query.neighbors) || 3, 10);
    const range =
      tab === 'last_week' ? getLastWeekRange() : getCurrentWeekRange();

    const { data, error } = await (getServiceSupabase().rpc as any)(
      'get_weekly_leaderboard_me',
      {
        p_user_id: userId,
        p_week_start: range.weekStart,
        p_week_end: range.weekEnd,
        p_neighbors: neighbors,
      },
    );

    if (error) {
      console.error('weekly-leaderboard/me RPC failed:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      entries: data ?? [],
      weekStart: range.weekStart,
      weekEnd: range.weekEnd,
    });
  } catch (err) {
    console.error('GET /api/weekly-leaderboard/me error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
