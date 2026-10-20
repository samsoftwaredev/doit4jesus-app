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

export type ConscienceQuestionCategory = "single" | "married" | "religious";

export type ConscienceQuestionListItemViewModel = {
  category: ConscienceQuestionCategory;
  id: string;
  question: string;
  title: string;
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
  countryCode: string | null;
  displayName: string;
  isCurrentUser: boolean;
  rank: number;
  rosaries: number;
  saintAvatarId: string | null;
  userId: string;
};

export type GlobalLeaderboardPeriodType = "weekly" | "lifetime";

export type GlobalLeaderboardPeriod = {
  code: string;
  createdAt: string;
  endsAt: string;
  finalizedAt: string | null;
  id: string;
  name: string;
  periodType: GlobalLeaderboardPeriodType;
  startsAt: string;
  status: string;
};

export type GlobalLeaderboardMeta = {
  limit: number;
  offset: number;
  total: number;
};

export type GlobalRosaryLeaderboard = {
  currentUserEntry: LeaderboardEntryViewModel | null;
  entries: LeaderboardEntryViewModel[];
  meta: GlobalLeaderboardMeta;
  period: GlobalLeaderboardPeriod;
};

export const ROSARY_REMINDER_THRESHOLDS = {
  URGENT: 3 * 60 * 60,
} as const;

export type RosaryReminderState = "completed" | "expired" | "normal" | "urgent";
