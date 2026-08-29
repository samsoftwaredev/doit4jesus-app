export type HolyProgressViewModel = {
  level: number | null;
  levelName: string | null;
  points: number | null;
  rosaries: number | null;
};

export type ConscienceQuestionViewModel = {
  id: string;
  question: string;
  reflection: string | null;
};

export type RosaryStreakStatus = "active" | "at-risk" | "none" | "reset";

export type RosaryReminderViewModel = {
  completed: boolean;
  deadlineAt: string | null;
  serverNow: string;
  streak: {
    current: number;
    longest: number;
    status: RosaryStreakStatus;
  };
};

export type LeaderboardEntryViewModel = {
  avatarUrl: string | null;
  displayName: string;
  rank: number;
  rosaries: number;
};

export const ROSARY_REMINDER_THRESHOLDS = {
  FINAL_FIFTEEN: 15 * 60,
  ONE_HOUR: 60 * 60,
  THREE_HOURS: 3 * 60 * 60,
} as const;

export type RosaryReminderState = "completed" | "expired" | "final-fifteen" | "normal" | "one-hour" | "three-hour";
