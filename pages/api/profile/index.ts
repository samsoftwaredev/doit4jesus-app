import type { NextApiRequest, NextApiResponse } from 'next';

import { requireAuth } from '@/lib/api/requireAuth';
import { getServiceSupabase } from '@/lib/supabase/server';
import { getUserSupabase } from '@/lib/supabase/userClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers.authorization?.slice(7) ?? '';
  const userId = await requireAuth(req, res);
  if (!userId) return;

  const sb = getServiceSupabase();

  if (req.method === 'GET') {
    try {
      const [profileRes, statsRes] = await Promise.all([
        sb.from('profiles').select('*').eq('id', userId).single(),
        sb.from('rosary_stats').select('*').eq('user_id', userId),
      ]);

      if (profileRes.error) {
        return res.status(500).json({ error: profileRes.error.message });
      }

      // Fetch streak via edge function (user-scoped client)
      let currentStreak = 0;
      try {
        const userClient = getUserSupabase(token);
        const { data: streakData, error: streakErr } =
          await userClient.functions.invoke('get_rosary_streak', {
            body: { user_id: userId },
          });
        if (!streakErr && streakData?.streak != null) {
          currentStreak = Number(streakData.streak);
        }
      } catch {
        // Non-critical — streak defaults to 0
      }

      // If Google user with no first_name, sync from auth metadata
      const { data: authData } = await sb.auth.getUser(token);
      const authUser = authData?.user;
      if (
        authUser?.app_metadata?.provider === 'google' &&
        profileRes.data?.first_name === null
      ) {
        await sb
          .from('profiles')
          .update({
            first_name: authUser.user_metadata?.name ?? null,
            picture_url: authUser.user_metadata?.picture ?? null,
          })
          .eq('id', userId);
      }

      return res.status(200).json({
        profile: profileRes.data,
        rosaryStats: statsRes.data ?? [],
        currentStreak,
        provider: authUser?.app_metadata?.provider ?? null,
      });
    } catch (err) {
      console.error('GET /api/profile error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { language } = req.body ?? {};

      if (language && typeof language === 'string') {
        const { error } = await sb
          .from('profiles')
          .update({ language })
          .eq('id', userId);
        if (error) return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('PATCH /api/profile error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
