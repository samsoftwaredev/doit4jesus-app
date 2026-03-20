import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/admin/requireAdmin';
import { getKpiTrends } from '@/lib/analytics/kpi-service';
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
  if (!adminId) return;

  try {
    const days = Math.min(Number(req.query.days) || 30, 365);
    const sb = getServiceSupabase();
    const trends = await getKpiTrends(sb, days);

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    return res.status(200).json({ ok: true, data: trends });
  } catch (err) {
    console.error('admin/kpis/trends error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
