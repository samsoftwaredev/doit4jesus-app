import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/admin/requireAdmin';
import { getKpiCohorts } from '@/lib/analytics/kpi-service';
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
    const weeks = Math.min(Number(req.query.weeks) || 8, 24);
    const sb = getServiceSupabase();
    const cohorts = await getKpiCohorts(sb, weeks);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ ok: true, data: cohorts });
  } catch (err) {
    console.error('admin/kpis/cohorts error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
