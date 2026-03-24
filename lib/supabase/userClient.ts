/**
 * Create a Supabase client authenticated as a specific user.
 *
 * Used in API routes to invoke Edge Functions on behalf of the caller,
 * preserving the user's JWT so the function sees the correct identity.
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/interfaces/database';

export function getUserSupabase(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_KEY!;

  return createClient<Database>(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
