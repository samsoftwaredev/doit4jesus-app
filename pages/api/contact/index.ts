import type { NextApiRequest, NextApiResponse } from 'next';

import { getUserSupabase } from '@/lib/supabase/userClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userEmail, userName, userMessage } = req.body ?? {};

  if (!userEmail || !userName || !userMessage) {
    return res
      .status(400)
      .json({ error: 'userEmail, userName, and userMessage are required' });
  }

  try {
    // Contact form is public — use anonymous client
    const anonClient = getUserSupabase('');
    const { data, error } = await anonClient.functions.invoke('contact-us', {
      body: { userEmail, userName, userMessage },
    });

    if (error) {
      console.error('contact-us edge function error:', error);
      return res.status(500).json({ error: 'Unable to send message' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('POST /api/contact error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
