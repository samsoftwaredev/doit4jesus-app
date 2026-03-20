import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/admin/requireAdmin';
import { getKpiAlerts } from '@/lib/analytics/kpi-service';
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
    const sb = getServiceSupabase();
    const alertsData = await getKpiAlerts(sb);

    return res.status(200).json({ ok: true, data: alertsData });
  } catch (err) {
    console.error('admin/kpis/alerts error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
