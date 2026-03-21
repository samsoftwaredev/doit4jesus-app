import type { NextApiRequest, NextApiResponse } from 'next';

import type { DailyScripture, ReadingItem } from '@/interfaces/dailyScripture';
import {
  type LiturgicalReadingRef,
  resolveLiturgicalDay,
} from '@/services/liturgicalCalendar';

// ─── Config ─────────────────────────────────────────────────────────────────

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? '';
const RAPIDAPI_HOST = 'catholic-bible.p.rapidapi.com';
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

// ─── Helpers ────────────────────────────────────────────────────────────────

const bibleBookIds = [
  {
    id: 1,
    type: 'Old Testament',
    book: 'Genesis',
  },
  {
    id: 2,
    type: 'Old Testament',
    book: 'Exodus',
  },
  {
    id: 3,
    type: 'Old Testament',
    book: 'Leviticus',
  },
  {
    id: 4,
    type: 'Old Testament',
    book: 'Numbers',
  },
  {
    id: 5,
    type: 'Old Testament',
    book: 'Deuteronomy',
  },
  {
    id: 6,
    type: 'Old Testament',
    book: 'Josue (Joshua)',
  },
  {
    id: 7,
    type: 'Old Testament',
    book: 'Judges',
  },
  {
    id: 8,
    type: 'Old Testament',
    book: 'Ruth',
  },
  {
    id: 9,
    type: 'Old Testament',
    book: '1st Book of Kings (1 Samuel)',
  },
  {
    id: 10,
    type: 'Old Testament',
    book: '2nd Book of Kings (2 Samuel)',
  },
  {
    id: 11,
    type: 'Old Testament',
    book: '3rd Book of Kings (1 Kings)',
  },
  {
    id: 12,
    type: 'Old Testament',
    book: '4th Book of Kings (2 Kings)',
  },
  {
    id: 13,
    type: 'Old Testament',
    book: '1 Paralipomenon (1 Chronicles)',
  },
  {
    id: 14,
    type: 'Old Testament',
    book: '2 Paralipomenon (2 Chronicles)',
  },
  {
    id: 15,
    type: 'Old Testament',
    book: '1st Book of Esdras (Ezra)',
  },
  {
    id: 16,
    type: 'Old Testament',
    book: '2nd Book of Esdras (Nehemiah)',
  },
  {
    id: 17,
    type: 'Old Testament',
    book: 'Tobias (Tobit)',
  },
  {
    id: 18,
    type: 'Old Testament',
    book: 'Judith',
  },
  {
    id: 19,
    type: 'Old Testament',
    book: 'Esther',
  },
  {
    id: 20,
    type: 'Old Testament',
    book: 'Job',
  },
  {
    id: 21,
    type: 'Old Testament',
    book: 'Psalms',
  },
  {
    id: 22,
    type: 'Old Testament',
    book: 'Proverbs',
  },
  {
    id: 23,
    type: 'Old Testament',
    book: 'Ecclesiastes',
  },
  {
    id: 24,
    type: 'Old Testament',
    book: 'Canticle of Canticles (Song of Solomon)',
  },
  {
    id: 25,
    type: 'Old Testament',
    book: 'Wisdom',
  },
  {
    id: 26,
    type: 'Old Testament',
    book: 'Ecclesiasticus (Sirach)',
  },
  {
    id: 27,
    type: 'Old Testament',
    book: 'Prophecy of Isaias (Isaiah)',
  },
  {
    id: 28,
    type: 'Old Testament',
    book: 'Prophecy of Jeremias (Jeremiah)',
  },
  {
    id: 29,
    type: 'Old Testament',
    book: 'Lamentations of Jeremias',
  },
  {
    id: 30,
    type: 'Old Testament',
    book: 'Prophecy of Baruch',
  },
  {
    id: 31,
    type: 'Old Testament',
    book: 'Prophecy of Ezechiel (Ezekiel)',
  },
  {
    id: 32,
    type: 'Old Testament',
    book: 'Prophecy of Daniel',
  },
  {
    id: 33,
    type: 'Old Testament',
    book: 'Prophecy of Osee (Hosea)',
  },
  {
    id: 34,
    type: 'Old Testament',
    book: 'Prophecy of Joel',
  },
  {
    id: 35,
    type: 'Old Testament',
    book: 'Prophecy of Amos',
  },
  {
    id: 36,
    type: 'Old Testament',
    book: 'Prophecy of Abdias (Obadiah)',
  },
  {
    id: 37,
    type: 'Old Testament',
    book: 'Prophecy of Jonas (Jonah)',
  },
  {
    id: 38,
    type: 'Old Testament',
    book: 'Prophecy of Micheas (Micah)',
  },
  {
    id: 39,
    type: 'Old Testament',
    book: 'Prophecy of Nahum',
  },
  {
    id: 40,
    type: 'Old Testament',
    book: 'Prophecy of Habacuc (Habakkuk)',
  },
  {
    id: 41,
    type: 'Old Testament',
    book: 'Prophecy of Sophonias (Zephaniah)',
  },
  {
    id: 42,
    type: 'Old Testament',
    book: 'Prophecy of Aggeus (Haggai)',
  },
  {
    id: 43,
    type: 'Old Testament',
    book: 'Prophecy of Zacharias (Zechariah)',
  },
  {
    id: 44,
    type: 'Old Testament',
    book: 'Prophecy of Malachias (Malachi)',
  },
  {
    id: 45,
    type: 'Old Testament',
    book: '1st Book of Machabees',
  },
  {
    id: 46,
    type: 'Old Testament',
    book: '2nd Book of Machabees',
  },
  {
    id: 47,
    type: 'New Testament',
    book: 'Gospel According to St Matthew',
  },
  {
    id: 48,
    type: 'New Testament',
    book: 'Gospel According to St Mark',
  },
  {
    id: 49,
    type: 'New Testament',
    book: 'Gospel According to St Luke',
  },
  {
    id: 50,
    type: 'New Testament',
    book: 'Gospel According to St John',
  },
  {
    id: 51,
    type: 'New Testament',
    book: 'The Acts of the Apostles',
  },
  {
    id: 52,
    type: 'New Testament',
    book: 'Epistle of St Paul to the Romans',
  },
  {
    id: 53,
    type: 'New Testament',
    book: '1st Epistle of St Paul to the Corinthians',
  },
  {
    id: 54,
    type: 'New Testament',
    book: '2nd Epistle of St Paul to the Corinthians',
  },
  {
    id: 55,
    type: 'New Testament',
    book: 'Epistle of St Paul to the Galatians',
  },
  {
    id: 56,
    type: 'New Testament',
    book: 'Epistle of St Paul to the Ephesians',
  },
  {
    id: 57,
    type: 'New Testament',
    book: 'Epistle of St Paul to the Philippians',
  },
  {
    id: 58,
    type: 'New Testament',
    book: 'Epistle of St Paul to the Colossians',
  },
  {
    id: 59,
    type: 'New Testament',
    book: '1st Epistle of St Paul to the Thessalonians',
  },
  {
    id: 60,
    type: 'New Testament',
    book: '2nd Epistle of St Paul to the Thessalonians',
  },
  {
    id: 61,
    type: 'New Testament',
    book: '1st Epistle of St Paul to Timothy',
  },
  {
    id: 62,
    type: 'New Testament',
    book: '2nd Epistle of St Paul to Timothy',
  },
  {
    id: 63,
    type: 'New Testament',
    book: 'Epistle of St Paul to Titus',
  },
  {
    id: 64,
    type: 'New Testament',
    book: 'Epistle of St Paul to Philemon',
  },
  {
    id: 65,
    type: 'New Testament',
    book: 'Epistle of St Paul to the Hebrews',
  },
  {
    id: 66,
    type: 'New Testament',
    book: 'Epistle of St James',
  },
  {
    id: 67,
    type: 'New Testament',
    book: '1st Epistle of St Peter',
  },
  {
    id: 68,
    type: 'New Testament',
    book: '2nd Epistle of St Peter',
  },
  {
    id: 69,
    type: 'New Testament',
    book: '1st Epistle of St John',
  },
  {
    id: 70,
    type: 'New Testament',
    book: '2nd Epistle of St John',
  },
  {
    id: 71,
    type: 'New Testament',
    book: '3rd Epistle of St John',
  },
  {
    id: 72,
    type: 'New Testament',
    book: 'Epistle of St Jude',
  },
  {
    id: 73,
    type: 'New Testament',
    book: 'The Apocalypse of St John (Revelation)',
  },
];

/** Map standard/modern book names (lowercase) to their Catholic Bible API book IDs. */
const BOOK_NAME_TO_ID: Record<string, number> = {
  genesis: 1,
  exodus: 2,
  leviticus: 3,
  numbers: 4,
  deuteronomy: 5,
  joshua: 6,
  josue: 6,
  judges: 7,
  ruth: 8,
  '1 samuel': 9,
  '2 samuel': 10,
  '1 kings': 11,
  '2 kings': 12,
  '1 chronicles': 13,
  '2 chronicles': 14,
  ezra: 15,
  nehemiah: 16,
  tobit: 17,
  tobias: 17,
  judith: 18,
  esther: 19,
  job: 20,
  psalms: 21,
  psalm: 21,
  proverbs: 22,
  ecclesiastes: 23,
  'song of solomon': 24,
  'song of songs': 24,
  wisdom: 25,
  sirach: 26,
  ecclesiasticus: 26,
  isaiah: 27,
  jeremiah: 28,
  lamentations: 29,
  baruch: 30,
  ezekiel: 31,
  daniel: 32,
  hosea: 33,
  joel: 34,
  amos: 35,
  obadiah: 36,
  jonah: 37,
  micah: 38,
  nahum: 39,
  habakkuk: 40,
  zephaniah: 41,
  haggai: 42,
  zechariah: 43,
  malachi: 44,
  '1 maccabees': 45,
  '2 maccabees': 46,
  matthew: 47,
  mark: 48,
  luke: 49,
  john: 50,
  acts: 51,
  romans: 52,
  '1 corinthians': 53,
  '2 corinthians': 54,
  galatians: 55,
  ephesians: 56,
  philippians: 57,
  colossians: 58,
  '1 thessalonians': 59,
  '2 thessalonians': 60,
  '1 timothy': 61,
  '2 timothy': 62,
  titus: 63,
  philemon: 64,
  hebrews: 65,
  james: 66,
  '1 peter': 67,
  '2 peter': 68,
  '1 john': 69,
  '2 john': 70,
  '3 john': 71,
  jude: 72,
  revelation: 73,
};

const resolveBookId = (bookName: string): number | null =>
  BOOK_NAME_TO_ID[bookName.toLowerCase().trim()] ?? null;

interface ParsedVerseRef {
  bookId: number;
  chapter: number;
  verseFrom: number;
  verseTo: number;
}

/**
 * Extract all numeric verse values from a spec like "4-5a, 12-14a, 16"
 * and return the min/max range.
 */
const parseVerseRange = (verseSpec: string): { from: number; to: number } => {
  const numbers = verseSpec.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return { from: 1, to: 999 };
  return { from: Math.min(...numbers), to: Math.max(...numbers) };
};

/**
 * Parse a liturgical reference like "2 Samuel 7:4-5a, 12-14a, 16"
 * or "Isaiah 7:10-14; 8:10" into structured API parameters.
 */
const parseReference = (reference: string): ParsedVerseRef[] => {
  const segments = reference.split(';').map((s) => s.trim());
  const results: ParsedVerseRef[] = [];
  let lastBookName = '';

  for (const segment of segments) {
    // Full: "BookName Chapter:Verses"
    const fullMatch = segment.match(/^(.+)\s+(\d+):(.+)$/);
    if (fullMatch) {
      lastBookName = fullMatch[1].trim();
      const chapter = parseInt(fullMatch[2], 10);
      const { from, to } = parseVerseRange(fullMatch[3]);
      const bookId = resolveBookId(lastBookName);
      if (bookId) {
        results.push({ bookId, chapter, verseFrom: from, verseTo: to });
      }
      continue;
    }
    // Partial: "Chapter:Verses" — inherit book from previous segment
    const partialMatch = segment.match(/^(\d+):(.+)$/);
    if (partialMatch && lastBookName) {
      const chapter = parseInt(partialMatch[1], 10);
      const { from, to } = parseVerseRange(partialMatch[2]);
      const bookId = resolveBookId(lastBookName);
      if (bookId) {
        results.push({ bookId, chapter, verseFrom: from, verseTo: to });
      }
    }
  }

  return results;
};

/** Return today's date in YYYY-MM-DD for the US Eastern timezone. */
const todayUS = (): string => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
  }).format(now); // en-CA gives YYYY-MM-DD
};

/**
 * Fetch verse(s) from the Catholic Bible API using book_id, chapter, and verse range.
 * Falls back to '' on failure.
 */
const fetchPassage = async (reference: string): Promise<string> => {
  if (!RAPIDAPI_KEY) return '';

  const refs = parseReference(reference);
  if (refs.length === 0) return '';

  const parts: string[] = [];

  for (const ref of refs) {
    try {
      const params = new URLSearchParams({
        book_id: String(ref.bookId),
        chapter_num: String(ref.chapter),
        verse_from: String(ref.verseFrom),
        verse_to: String(ref.verseTo),
      });
      const url = `${RAPIDAPI_BASE}/bible/verse?${params}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      });

      if (!res.ok) continue;

      const json = await res.json();

      if (typeof json === 'string') {
        parts.push(json);
      } else if (Array.isArray(json)) {
        const text = json
          .map((v: any) => {
            if (typeof v === 'string') return v;
            return v?.text ?? v?.verse_text ?? v?.verse ?? '';
          })
          .filter(Boolean)
          .join(' ');
        if (text) parts.push(text);
      } else if (json?.verses && Array.isArray(json.verses)) {
        const text = (json.verses as any[])
          .map((v: any) => v?.text ?? v?.verse_text ?? v?.verse ?? '')
          .filter(Boolean)
          .join(' ');
        if (text) parts.push(text);
      } else if (json?.text) {
        parts.push(json.text);
      } else if (json?.passage) {
        parts.push(json.passage);
      }
    } catch {
      // Skip failed segments
    }
  }

  return parts.join('\n');
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
