/**
 * API middleware: verifies the caller's Supabase JWT and returns the user ID.
 *
 * Usage in an API route:
 *
 *   const userId = await requireAuth(req, res);
 *   if (!userId) return;          // 401 already sent
 *   // … use userId safely …
 *
 * For admin-only routes, continue using `requireAdmin` from `@/lib/admin/requireAdmin`.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * Extracts the Bearer token from the Authorization header,
 * verifies it with Supabase Auth, and returns the authenticated user's ID.
 *
 * Sends a 401 JSON response and returns `null` if auth fails.
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing authorization' });
    return null;
  }

  const token = auth.slice(7);
  const {
    data: { user },
    error,
  } = await getServiceSupabase().auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return null;
  }

  return user.id;
}
