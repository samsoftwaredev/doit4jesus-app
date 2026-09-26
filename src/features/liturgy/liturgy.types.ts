export type LiturgicalColor = "GREEN" | "RED" | "WHITE" | "VIOLET" | "ROSE" | "BLACK";

export type ReadingType = "FIRST_READING" | "RESPONSORIAL_PSALM" | "SECOND_READING" | "GOSPEL_ACCLAMATION" | "GOSPEL";

export interface DailyReading {
  id: string;
  type: ReadingType;
  citation: string;
  text: string;
}

export interface DailyLiturgyViewModel {
  date: string;
  completion: DailyScriptureCompletion;
  celebration: {
    id: string;
    name: string;
    grade: string;
    season: string;
    liturgicalColor: LiturgicalColor;
  };
  metadata: {
    country: string;
    sundayCycle?: "A" | "B" | "C";
    weekdayCycle?: "I" | "II";
    psalterWeek?: 1 | 2 | 3 | 4;
  };
  readings: DailyReading[];
  highlightedVerse?: {
    text: string;
    citation: string;
  };
}

export interface DailyScriptureCompletion {
  completed: boolean;
  completedAt: string | null;
}

export interface DailyReadingProgress {
  date: string;
  country: string;
  completedReadingIds: string[];
}

export interface MarkReadingCompleteResult {
  allReadingsCompleted: boolean;
  didCompleteAllReadings: boolean;
  progress: DailyReadingProgress;
}
