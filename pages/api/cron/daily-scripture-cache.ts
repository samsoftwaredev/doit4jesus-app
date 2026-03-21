import type { NextApiRequest, NextApiResponse } from 'next';

import {
  runDailyScriptureCron,
  sanitizeDailyScriptureDateInput,
} from '@/lib/scripture/dailyScriptureCache';

const getTokenFromHeader = (header: string | undefined): string => {
  if (!header) return '';
  return header.replace(/^Bearer\s+/i, '').trim();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expectedSecret = process.env.CRON_SECRET ?? '';
  const receivedSecret = getTokenFromHeader(
    req.headers.authorization as string | undefined,
  );

  if (expectedSecret && receivedSecret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized cron request' });
  }

  const date = sanitizeDailyScriptureDateInput(req.query.date);
  const locales =
    typeof req.query.locales === 'string'
      ? req.query.locales
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      : undefined;

  try {
    const result = await runDailyScriptureCron({ date, locales });
    return res.status(200).json(result);
  } catch (err) {
    console.error('daily-scripture cron API error:', err);
    return res
      .status(500)
      .json({ error: 'Daily scripture cron execution failed' });
  }
}
