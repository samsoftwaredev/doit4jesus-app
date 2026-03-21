import type { NextApiRequest, NextApiResponse } from 'next';

import type { DailyScripture } from '@/interfaces/dailyScripture';
import {
  getCachedDailyScripture,
  sanitizeDailyScriptureDateInput,
} from '@/lib/scripture/dailyScriptureCache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DailyScripture | { error: string; cacheMiss?: boolean }>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lang = (req.query.lang as string) === 'es' ? 'es' : 'en';
  const date = sanitizeDailyScriptureDateInput(req.query.date);

  try {
    const cached = await getCachedDailyScripture(date, lang);

    if (!cached) {
      return res.status(404).json({
        error: `No cached scripture found for ${date} (${lang})`,
        cacheMiss: true,
      });
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(cached);
  } catch (err) {
    console.error('daily-scripture cache API error:', err);
    return res
      .status(500)
      .json({ error: 'Failed to load cached daily scripture' });
  }
}
