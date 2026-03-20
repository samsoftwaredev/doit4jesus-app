/**
 * Admin API middleware: validates session + admin role.
 * Returns userId if admin, or sends 401/403 and returns null.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

export const requireAdmin = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> => {
  // Extract bearer token from Authorization header
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, error: 'Missing authorization' });
    return null;
  }

  const token = auth.slice(7);
  const sb = getServiceSupabase();

  // Verify JWT → get user
  const {
    data: { user },
    error,
  } = await sb.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ ok: false, error: 'Invalid session' });
    return null;
  }

  // Check admin role on profiles
  const { data: profile } = await (sb.from as any)('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    res.status(403).json({ ok: false, error: 'Admin access required' });
    return null;
  }

  return user.id;
};
