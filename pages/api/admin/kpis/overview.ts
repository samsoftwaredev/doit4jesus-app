import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/admin/requireAdmin';
import {
  getEngagementMetrics,
  getKpiOverview,
} from '@/lib/analytics/kpi-service';
import { getServiceSupabase } from '@/lib/supabase/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const adminId = await requireAdmin(req, res);
  if (!adminId) return; // response already sent

  try {
    const sb = getServiceSupabase();
    const [overview, engagement] = await Promise.all([
      getKpiOverview(sb),
      getEngagementMetrics(sb),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, data: { overview, engagement } });
  } catch (err) {
    console.error('admin/kpis/overview error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
