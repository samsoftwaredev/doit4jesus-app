/**
 * Daily Scripture service.
 *
 * Reads cached scripture from our own API/database layer.
 *
 * Frontend never calls RapidAPI directly; scheduled backend jobs cache the
 * daily readings into Supabase, and this service reads from that cache.
 */
import { supabase } from '@/classes';
import type {
  DailyScripture,
  ReadingItem,
  ScriptureCompletionRow,
} from '@/interfaces/dailyScripture';

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch today's cached scripture from our own backend.
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
