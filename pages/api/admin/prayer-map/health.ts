import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAdmin } from '@/lib/admin/requireAdmin';
import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * GET /api/admin/prayer-map/health
 *
 * Admin-only endpoint. Returns a health snapshot of the world-map feature:
 *
 *  - activeSessions          Total active global_prayer_sessions rows
 *  - recentlyUpdatedCities   prayer_locations updated in the last 24 hours
 *  - staleCities             prayer_locations not updated in the last 48 hours
 *                            (should be investigated or re-seeded)
 *  - aggregateMismatches     Cities where the DB live_sessions count differs
 *                            from the actual count of active sessions for that city
 *  - totalCities             Total rows in prayer_locations
 *  - totalPrayers            Sum of all prayer_count values
 *  - lastMapUpdate           The most recent last_updated timestamp in prayer_locations
 *
 * Use this endpoint to determine at a glance whether the world-map feature is
 * healthy. A mismatch or large stale-city list indicates the map aggregate
 * write path is degraded.
 */
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
    const now = new Date();
    const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const ago48h = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

    // Run all queries in parallel for fast response
    const [
      activeSessionsRes,
      allLocationsRes,
      recentLocationsRes,
      staleLocationsRes,
      activeSessionsByCityRes,
    ] = await Promise.all([
      // 1. Count of active sessions
      sb
        .from('global_prayer_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),

      // 2. All prayer locations for aggregate checks
      sb
        .from('prayer_locations')
        .select('city, country_code, prayer_count, live_sessions, last_updated')
        .order('last_updated', { ascending: false }),

      // 3. Recently updated (last 24 h)
      sb
        .from('prayer_locations')
        .select('city, country_code, country_name, prayer_count, last_updated')
        .gte('last_updated', ago24h)
        .order('last_updated', { ascending: false }),

      // 4. Stale (not updated in 48 h)
      sb
        .from('prayer_locations')
        .select('city, country_code, country_name, prayer_count, last_updated')
        .lt('last_updated', ago48h)
        .order('last_updated', { ascending: true }),

      // 5. Active sessions grouped by city — used to detect aggregate mismatches
      sb
        .from('global_prayer_sessions')
        .select('city, country_code')
        .eq('is_active', true),
    ]);

    // ── Compute aggregate mismatch ─────────────────────────────────────────
    // A mismatch means prayer_locations.live_sessions doesn't match the actual
    // count of active sessions for that city.

    const sessionCountByCity: Record<string, number> = {};
    if (activeSessionsByCityRes.data) {
      for (const row of activeSessionsByCityRes.data) {
        const key = `${row.city}::${row.country_code}`;
        sessionCountByCity[key] = (sessionCountByCity[key] ?? 0) + 1;
      }
    }

    const aggregateMismatches: Array<{
      city: string;
      countryCode: string;
      storedLiveSessions: number;
      actualActiveSessions: number;
    }> = [];

    if (allLocationsRes.data) {
      for (const loc of allLocationsRes.data) {
        const key = `${loc.city}::${loc.country_code}`;
        const actual = sessionCountByCity[key] ?? 0;
        const stored = loc.live_sessions ?? 0;
        if (stored !== actual) {
          aggregateMismatches.push({
            city: loc.city,
            countryCode: loc.country_code,
            storedLiveSessions: stored,
            actualActiveSessions: actual,
          });
        }
      }
    }

    // ── Compute summary stats ──────────────────────────────────────────────
    const locations = allLocationsRes.data ?? [];
    const totalPrayers = locations.reduce(
      (sum, loc) => sum + (loc.prayer_count ?? 0),
      0,
    );
    const lastMapUpdate = locations[0]?.last_updated ?? null;

    // ── Surface fetch errors ───────────────────────────────────────────────
    const fetchErrors: string[] = [];
    if (activeSessionsRes.error)
      fetchErrors.push(`active_sessions: ${activeSessionsRes.error.message}`);
    if (allLocationsRes.error)
      fetchErrors.push(`all_locations: ${allLocationsRes.error.message}`);
    if (recentLocationsRes.error)
      fetchErrors.push(`recent_locations: ${recentLocationsRes.error.message}`);
    if (staleLocationsRes.error)
      fetchErrors.push(`stale_locations: ${staleLocationsRes.error.message}`);
    if (activeSessionsByCityRes.error)
      fetchErrors.push(
        `sessions_by_city: ${activeSessionsByCityRes.error.message}`,
      );

    const healthy =
      fetchErrors.length === 0 && aggregateMismatches.length === 0;

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      healthy,
      checkedAt: now.toISOString(),
      data: {
        activeSessions: activeSessionsRes.count ?? 0,
        totalCities: locations.length,
        totalPrayers,
        lastMapUpdate,
        recentlyUpdatedCities: recentLocationsRes.data ?? [],
        staleCities: staleLocationsRes.data ?? [],
        aggregateMismatches,
        fetchErrors,
      },
    });
  } catch (err) {
    console.error('GET /api/admin/prayer-map/health error:', err);
    return res
      .status(500)
      .json({ ok: false, error: 'Internal server error', healthy: false });
  }
}
