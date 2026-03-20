/**
 * Server-side Supabase client (service-role key).
 *
 * ONLY import this in server-side code (API routes, getServerSideProps).
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS for admin queries.
 */
import { type SupabaseClient, createClient } from '@supabase/supabase-js';

import type { Database } from '@/interfaces/database';

let _client: SupabaseClient<Database> | null = null;

export const getServiceSupabase = (): SupabaseClient<Database> => {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_PROJECT_URL or SUPABASE_SERVICE_ROLE_KEY env vars',
    );
  }

  _client = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _client;
};
