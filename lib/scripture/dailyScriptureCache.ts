import type { DailyScripture, ReadingItem } from '@/interfaces/dailyScripture';
import { getServiceSupabase } from '@/lib/supabase/server';
import {
  type LiturgicalReadingRef,
  resolveLiturgicalDay,
} from '@/services/liturgicalCalendar';
import { normalizeCatholicBookName } from '@/utils/normalizers/catholicBookName';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? '';
const RAPIDAPI_HOST = 'catholic-bible.p.rapidapi.com';
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

type Locale = 'en' | 'es';
type CacheStatus = 'success' | 'partial' | 'failed';

export type ReadingSegmentLog = {
  segment: string;
  originalBookName: string;
  normalizedBookName: string | null;
  bookId: number | null;
  chapter: number;
  verseFrom: number;
  verseTo: number;
  status: 'ok' | 'parse_failed' | 'normalization_failed' | 'api_failed';
  error: string | null;
};

export type CachedReadingItem = ReadingItem & {
  segments: ReadingSegmentLog[];
};

type CachedDailyScriptureRow = {
  scripture_date: string;
  locale: Locale;
  liturgical_title: string;
  season: string;
  featured_verse_reference: string;
  featured_verse_text: string;
  readings: CachedReadingItem[];
};

type FetchPassageResult = {
  text: string;
  segments: ReadingSegmentLog[];
  hasFailures: boolean;
};

const LABEL_ES: Record<string, string> = {
  'First Reading': 'Primera Lectura',
  'Responsorial Psalm': 'Salmo Responsorial',
  'Second Reading': 'Segunda Lectura',
  'Gospel Acclamation': 'Aclamación del Evangelio',
  Gospel: 'Evangelio',
};

const parseVerseRange = (verseSpec: string): { from: number; to: number } => {
  const numbers = verseSpec.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return { from: 1, to: 999 };
  return { from: Math.min(...numbers), to: Math.max(...numbers) };
};

const extractBookNameAndRange = (
  segment: string,
  inheritedBook: string,
): {
  originalBookName: string;
  chapter: number;
  verseFrom: number;
  verseTo: number;
} | null => {
  const fullMatch = segment.match(/^(.+?)\s+(\d+):(.+)$/);
  if (fullMatch) {
    const originalBookName = fullMatch[1].trim();
    const chapter = parseInt(fullMatch[2], 10);
    const { from, to } = parseVerseRange(fullMatch[3]);
    return { originalBookName, chapter, verseFrom: from, verseTo: to };
  }

  const partialMatch = segment.match(/^(\d+):(.+)$/);
  if (partialMatch && inheritedBook) {
    const chapter = parseInt(partialMatch[1], 10);
    const { from, to } = parseVerseRange(partialMatch[2]);
    return {
      originalBookName: inheritedBook,
      chapter,
      verseFrom: from,
      verseTo: to,
    };
  }

  return null;
};

const parseReferenceSegments = (reference: string): ReadingSegmentLog[] => {
  const segments = reference.split(';').map((s) => s.trim());
  const results: ReadingSegmentLog[] = [];
  let inheritedBook = '';

  for (const segment of segments) {
    const parsed = extractBookNameAndRange(segment, inheritedBook);
    if (!parsed) {
      results.push({
        segment,
        originalBookName: inheritedBook,
        normalizedBookName: null,
        bookId: null,
        chapter: 0,
        verseFrom: 0,
        verseTo: 0,
        status: 'parse_failed',
        error: `Could not parse reference segment: ${segment}`,
      });
      continue;
    }

    inheritedBook = parsed.originalBookName;

    const normalized = normalizeCatholicBookName(parsed.originalBookName);
    if (!normalized) {
      results.push({
        segment,
        originalBookName: parsed.originalBookName,
        normalizedBookName: null,
        bookId: null,
        chapter: parsed.chapter,
        verseFrom: parsed.verseFrom,
        verseTo: parsed.verseTo,
        status: 'normalization_failed',
        error: `Could not normalize book name: ${parsed.originalBookName}`,
      });
      continue;
    }

    results.push({
      segment,
      originalBookName: parsed.originalBookName,
      normalizedBookName: normalized.canonicalBookName,
      bookId: normalized.bookId,
      chapter: parsed.chapter,
      verseFrom: parsed.verseFrom,
      verseTo: parsed.verseTo,
      status: 'ok',
      error: null,
    });
  }

  return results;
};

const parseRapidApiVerseText = (json: any): string => {
  if (typeof json === 'string') return json;

  if (Array.isArray(json)) {
    return json
      .map((v: any) => {
        if (typeof v === 'string') return v;
        return v?.text ?? v?.verse_text ?? v?.verse ?? '';
      })
      .filter(Boolean)
      .join(' ');
  }

  if (json?.verses && Array.isArray(json.verses)) {
    return (json.verses as any[])
      .map((v: any) => v?.text ?? v?.verse_text ?? v?.verse ?? '')
      .filter(Boolean)
      .join(' ');
  }

  return json?.text ?? json?.passage ?? '';
};

const fetchPassage = async (reference: string): Promise<FetchPassageResult> => {
  if (!RAPIDAPI_KEY) {
    return {
      text: '',
      segments: [],
      hasFailures: true,
    };
  }

  const segments = parseReferenceSegments(reference);
  const parts: string[] = [];
  let hasFailures = false;

  for (const segment of segments) {
    if (!segment.bookId || segment.status !== 'ok') {
      hasFailures = true;
      continue;
    }

    try {
      const params = new URLSearchParams({
        book_id: String(segment.bookId),
        chapter_num: String(segment.chapter),
        verse_from: String(segment.verseFrom),
        verse_to: String(segment.verseTo),
      });

      const res = await fetch(`${RAPIDAPI_BASE}/bible/verse?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      });

      if (!res.ok) {
        hasFailures = true;
        segment.status = 'api_failed';
        segment.error = `RapidAPI status ${res.status}`;
        continue;
      }

      const json = await res.json();
      const parsedText = parseRapidApiVerseText(json);

      if (!parsedText) {
        hasFailures = true;
        segment.status = 'api_failed';
        segment.error = 'RapidAPI returned empty passage';
        continue;
      }

      parts.push(parsedText);
    } catch (error) {
      hasFailures = true;
      segment.status = 'api_failed';
      segment.error =
        error instanceof Error ? error.message : 'Unknown RapidAPI failure';
    }
  }

  return {
    text: parts.join('\n').trim(),
    segments,
    hasFailures,
  };
};

const featuredTextFrom = (text: string): string =>
  text.split('\n')[0]?.slice(0, 300)?.trim() ?? '';

const normalizeLocale = (value: string | undefined): Locale =>
  value === 'es' ? 'es' : 'en';

export const todayUTC = (): string => new Date().toISOString().slice(0, 10);

const buildCachedDailyScripture = async (
  date: string,
  locale: Locale,
): Promise<{
  row: CachedDailyScriptureRow;
  status: CacheStatus;
  failedReadings: Array<{ reference: string; reason: string }>;
}> => {
  const liturgical = resolveLiturgicalDay(date);

  const builtReadings = await Promise.all(
    liturgical.readings.map(
      async (readingRef: LiturgicalReadingRef): Promise<CachedReadingItem> => {
        const fetched = await fetchPassage(readingRef.reference);

        return {
          type: readingRef.type,
          label:
            locale === 'es'
              ? (LABEL_ES[readingRef.label] ?? readingRef.label)
              : readingRef.label,
          reference: readingRef.reference,
          text: fetched.text || `[${readingRef.reference}]`,
          order: readingRef.order,
          segments: fetched.segments,
        };
      },
    ),
  );

  builtReadings.sort((a, b) => a.order - b.order);

  const failedReadings = builtReadings
    .filter((reading) =>
      reading.segments.some((segment) => segment.status !== 'ok'),
    )
    .map((reading) => ({
      reference: reading.reference,
      reason: reading.segments
        .filter((segment) => segment.status !== 'ok')
        .map((segment) => segment.error ?? segment.status)
        .join('; '),
    }));

  const gospel = builtReadings.find((r) => r.type === 'gospel');
  const firstReading = builtReadings[0];
  const featuredSource = gospel ?? firstReading;

  const row: CachedDailyScriptureRow = {
    scripture_date: date,
    locale,
    liturgical_title: liturgical.title,
    season: liturgical.season,
    featured_verse_reference: featuredSource?.reference ?? '',
    featured_verse_text: featuredSource
      ? featuredTextFrom(featuredSource.text)
      : '',
    readings: builtReadings,
  };

  let status: CacheStatus = 'success';
  if (failedReadings.length > 0) status = 'partial';
  if (failedReadings.length === builtReadings.length) status = 'failed';

  return {
    row,
    status,
    failedReadings,
  };
};

const upsertDailyScripture = async (
  row: CachedDailyScriptureRow,
  status: CacheStatus,
  failedReadings: Array<{ reference: string; reason: string }>,
) => {
  const supabase = getServiceSupabase();

  const payload = {
    scripture_date: row.scripture_date,
    locale: row.locale,
    liturgical_title: row.liturgical_title,
    season: row.season,
    featured_verse_reference: row.featured_verse_reference,
    featured_verse_text: row.featured_verse_text,
    readings: row.readings,
    fetch_status: status,
    failed_readings: failedReadings,
  };

  const { error } = await (supabase.from as any)(
    'daily_scripture_cache',
  ).upsert(payload, { onConflict: 'scripture_date,locale' });

  if (error) {
    throw new Error(`Failed to upsert daily scripture cache: ${error.message}`);
  }
};

const insertCronRunLog = async (
  scriptureDate: string,
  locale: Locale,
  status: CacheStatus,
  failedReadings: Array<{ reference: string; reason: string }>,
  errorMessage: string | null,
) => {
  const supabase = getServiceSupabase();

  const { error } = await (supabase.from as any)(
    'daily_scripture_cron_runs',
  ).insert({
    scripture_date: scriptureDate,
    locale,
    status,
    failed_readings: failedReadings,
    error_message: errorMessage,
  });

  if (error) {
    console.error('daily_scripture_cron_runs insert error:', error.message);
  }
};

export const runDailyScriptureCron = async (params?: {
  date?: string;
  locales?: string[];
}) => {
  const date = params?.date ?? todayUTC();
  const locales = (params?.locales ?? ['en', 'es']).map(normalizeLocale);

  const summary: Array<{
    locale: Locale;
    status: CacheStatus;
    failures: number;
    error: string | null;
  }> = [];

  for (const locale of locales) {
    try {
      const { row, status, failedReadings } = await buildCachedDailyScripture(
        date,
        locale,
      );

      await upsertDailyScripture(row, status, failedReadings);
      await insertCronRunLog(date, locale, status, failedReadings, null);

      console.info('daily-scripture cron success:', {
        date,
        locale,
        status,
        failures: failedReadings.length,
      });

      summary.push({
        locale,
        status,
        failures: failedReadings.length,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown cron failure';

      await insertCronRunLog(date, locale, 'failed', [], message);

      console.error('daily-scripture cron failure:', {
        date,
        locale,
        error: message,
      });

      summary.push({
        locale,
        status: 'failed',
        failures: 0,
        error: message,
      });
    }
  }

  return {
    date,
    summary,
    successCount: summary.filter((item) => item.status !== 'failed').length,
    failedCount: summary.filter((item) => item.status === 'failed').length,
  };
};

export const getCachedDailyScripture = async (
  date: string,
  locale: Locale,
): Promise<DailyScripture | null> => {
  const supabase = getServiceSupabase();

  const { data, error } = await (supabase.from as any)('daily_scripture_cache')
    .select(
      'scripture_date,locale,liturgical_title,season,featured_verse_reference,featured_verse_text,readings',
    )
    .eq('scripture_date', date)
    .eq('locale', locale)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed reading daily scripture cache: ${error.message}`);
  }

  if (!data) return null;

  return {
    date: data.scripture_date,
    liturgicalTitle: data.liturgical_title,
    season: data.season,
    language: data.locale,
    featuredVerse: {
      reference: data.featured_verse_reference,
      text: data.featured_verse_text,
    },
    readings: data.readings,
  } as DailyScripture;
};

export const sanitizeDailyScriptureDateInput = (
  value: string | string[] | undefined,
): string => {
  if (!value || Array.isArray(value)) return todayUTC();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return todayUTC();
  return value;
};
