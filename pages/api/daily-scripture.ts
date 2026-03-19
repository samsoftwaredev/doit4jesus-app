import type { NextApiRequest, NextApiResponse } from 'next';

import type { DailyScripture, ReadingItem } from '@/interfaces/dailyScripture';
import {
  type LiturgicalReadingRef,
  resolveLiturgicalDay,
} from '@/services/liturgicalCalendar';

// ─── Config ─────────────────────────────────────────────────────────────────

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? '';
const RAPIDAPI_HOST = 'catholic-bible-lookup.p.rapidapi.com';
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Return today's date in YYYY-MM-DD for the US Eastern timezone. */
const todayUS = (): string => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
  }).format(now); // en-CA gives YYYY-MM-DD
};

/**
 * Fetch a single verse/passage from the Catholic Bible API (Douay-Rheims).
 * Returns plain text or '' on failure.
 */
const fetchPassage = async (reference: string): Promise<string> => {
  if (!RAPIDAPI_KEY) return '';
  try {
    const url = `${RAPIDAPI_BASE}/search?query=${encodeURIComponent(reference)}`;
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    if (!res.ok) return '';

    const json = await res.json();

    // The API may return results in various shapes — normalise to text.
    if (typeof json === 'string') return json;
    if (Array.isArray(json)) {
      return json
        .map((v: any) => {
          if (typeof v === 'string') return v;
          if (v?.text) return v.text;
          if (v?.verse_text) return v.verse_text;
          return JSON.stringify(v);
        })
        .join('\n');
    }
    if (json?.text) return json.text;
    if (json?.passage) return json.passage;
    if (json?.verses) {
      return (json.verses as any[])
        .map((v: any) => v.text ?? v.verse_text ?? '')
        .join(' ');
    }
    return JSON.stringify(json);
  } catch {
    return '';
  }
};

/**
 * Simple mapping for Spanish reading labels.
 */
const LABEL_ES: Record<string, string> = {
  'First Reading': 'Primera Lectura',
  'Responsorial Psalm': 'Salmo Responsorial',
  'Second Reading': 'Segunda Lectura',
  'Gospel Acclamation': 'Aclamación del Evangelio',
  Gospel: 'Evangelio',
};

// ─── Handler ────────────────────────────────────────────────────────────────

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DailyScripture | { error: string }>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lang = (req.query.lang as string) === 'es' ? 'es' : 'en';

  try {
    const dateStr = todayUS();
    const liturgical = resolveLiturgicalDay(dateStr);

    // Fetch all readings in parallel
    const readingResults = await Promise.all(
      liturgical.readings.map(
        async (ref: LiturgicalReadingRef): Promise<ReadingItem> => {
          const text = await fetchPassage(ref.reference);
          return {
            type: ref.type,
            label:
              lang === 'es' ? (LABEL_ES[ref.label] ?? ref.label) : ref.label,
            reference: ref.reference,
            text: text || `[${ref.reference}]`,
            order: ref.order,
          };
        },
      ),
    );

    // Sort readings by order
    readingResults.sort((a, b) => a.order - b.order);

    // Pick a featured verse from the Gospel reading
    const gospel = readingResults.find((r) => r.type === 'gospel');
    const firstReading = readingResults[0];
    const featuredSource = gospel ?? firstReading;
    const featuredText =
      featuredSource?.text?.split('\n')[0]?.slice(0, 300) ?? '';

    const scripture: DailyScripture = {
      date: dateStr,
      liturgicalTitle: liturgical.title,
      season: liturgical.season,
      language: lang,
      featuredVerse: {
        reference: featuredSource?.reference ?? '',
        text: featuredText,
      },
      readings: readingResults,
    };

    // Cache for 1 hour
    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=7200',
    );
    return res.status(200).json(scripture);
  } catch (err) {
    console.error('daily-scripture API error:', err);
    return res.status(500).json({ error: 'Failed to fetch daily scripture' });
  }
}
