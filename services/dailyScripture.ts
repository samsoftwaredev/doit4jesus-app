/**
 * Daily Scripture service.
 *
 * Fetches scripture text from the Catholic Bible API (Douay-Rheims via
 * RapidAPI) and combines it with the liturgical calendar to produce a
 * complete DailyScripture payload.
 *
 * The actual API call is proxied through our own /api/daily-scripture
 * route so the RapidAPI key is never exposed to the browser.
 */
import { supabase } from '@/classes';
import type {
  DailyScripture,
  ReadingItem,
  ScriptureCompletionRow,
} from '@/interfaces/dailyScripture';

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch today's fully-composed scripture with readings text.
 * Calls our own API route which proxies to RapidAPI + liturgical calendar.
 */
export const getDailyScripture = async (
  lang: 'en' | 'es' = 'en',
): Promise<DailyScripture | null> => {
  try {
    const res = await fetch(`/api/daily-scripture?lang=${lang}`);
    if (!res.ok) {
      console.error('getDailyScripture: API returned', res.status);
      return null;
    }
    return (await res.json()) as DailyScripture;
  } catch (err) {
    console.error('getDailyScripture error:', err);
    return null;
  }
};

// ─── Scripture completion tracking ──────────────────────────────────────────

/**
 * Check whether the user has already completed the daily scripture today.
 */
export const getScriptureCompletionToday = async (
  userId: string,
  liturgicalDate: string,
): Promise<ScriptureCompletionRow | null> => {
  try {
    const { data, error } = await (supabase.from as any)(
      'scripture_completions',
    )
      .select('*')
      .eq('user_id', userId)
      .eq('liturgical_date', liturgicalDate)
      .maybeSingle();

    if (error) {
      console.error('getScriptureCompletionToday error:', error);
      return null;
    }
    return data as ScriptureCompletionRow | null;
  } catch (err) {
    console.error('getScriptureCompletionToday unexpected error:', err);
    return null;
  }
};

/**
 * Record that the user has read today's scripture.
 * Returns the inserted row, or null on error/duplicate.
 */
export const recordScriptureCompletion = async (
  userId: string,
  liturgicalDate: string,
): Promise<ScriptureCompletionRow | null> => {
  try {
    const { data, error } = await (supabase.from as any)(
      'scripture_completions',
    )
      .upsert(
        { user_id: userId, liturgical_date: liturgicalDate },
        { onConflict: 'user_id,liturgical_date' },
      )
      .select()
      .single();

    if (error) {
      console.error('recordScriptureCompletion error:', error);
      return null;
    }
    return data as ScriptureCompletionRow;
  } catch (err) {
    console.error('recordScriptureCompletion unexpected error:', err);
    return null;
  }
};
