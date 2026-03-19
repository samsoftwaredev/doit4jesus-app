/** Reading types that appear in the Mass liturgy. */
export type ReadingType =
  | 'first_reading'
  | 'responsorial_psalm'
  | 'second_reading'
  | 'gospel_acclamation'
  | 'gospel';

/** A single scripture reading for the Mass. */
export interface ReadingItem {
  type: ReadingType;
  label: string;
  reference: string;
  text: string;
  order: number;
}

/** Full daily scripture payload for one liturgical day. */
export interface DailyScripture {
  date: string; // ISO date  YYYY-MM-DD
  liturgicalTitle: string;
  season: string;
  language: 'en' | 'es';
  featuredVerse: {
    reference: string;
    text: string;
  };
  readings: ReadingItem[];
}

/** Tracks whether the user has read today's scripture. */
export interface ScriptureReadStatus {
  hasReadToday: boolean;
  awardedXp: boolean;
  completedAt: string | null;
}

/** Row returned by scripture_completions DB table. */
export interface ScriptureCompletionRow {
  id: number;
  user_id: string;
  liturgical_date: string;
  completed_at: string;
}
