export type LiturgicalColor = "GREEN" | "RED" | "WHITE" | "VIOLET" | "ROSE" | "BLACK";

export type ReadingType =
  | "FIRST_READING"
  | "RESPONSORIAL_PSALM"
  | "SECOND_READING"
  | "GOSPEL_ACCLAMATION"
  | "GOSPEL";

export interface DailyReading {
  id: string;
  type: ReadingType;
  citation: string;
  text: string;
}

export interface DailyLiturgyViewModel {
  date: string;
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

export interface CompletionReward {
  idempotencyKey: string;
  occurredAt: string;
  completedAt: string;
  status: "pending" | "recorded";
  points?: number;
  totalXp?: number;
  currentLevel?: number;
  toastShownAt?: string;
}

export interface DailyReadingProgress {
  date: string;
  country: string;
  completedReadingIds: string[];
  completedAt?: string;
  reward?: CompletionReward;
}

export interface MarkReadingCompleteResult {
  allReadingsCompleted: boolean;
  didCompleteAllReadings: boolean;
  progress: DailyReadingProgress;
}
