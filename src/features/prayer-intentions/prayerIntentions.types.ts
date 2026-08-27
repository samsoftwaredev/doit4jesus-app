export const prayerIntentionSymbols = ["candle", "dove", "olive_branch", "cross"] as const;

export type PrayerIntentionSymbol = (typeof prayerIntentionSymbols)[number];
export type MyPrayerIntentionStatus = "pending" | "visible" | "rejected";
export type MyPrayerIntentionsStatusFilter = MyPrayerIntentionStatus | "all";

export type PrayerIntentionCreator = {
  avatarUrl: string | null;
  countryCode: string | null;
  displayName: string;
};

export type ApprovedPrayerIntention = {
  approvedAt: string;
  createdAt: string;
  creator: PrayerIntentionCreator;
  description: string;
  expiresAt: string;
  id: string;
  symbol: string;
  title: string;
};

export type PrayerIntentionsPage = {
  data: ApprovedPrayerIntention[];
  meta: {
    hasMore: boolean;
    limit: number;
    nextOffset: number | null;
    offset: number;
  };
};

export type CreatePrayerIntentionInput = {
  description: string;
  symbol: PrayerIntentionSymbol;
  title: string;
};

export type MyPrayerIntention = {
  createdAt: string;
  description: string;
  expiresAt: string | null;
  id: string;
  reviewedAt: string | null;
  status: MyPrayerIntentionStatus;
  symbol: string;
  title: string;
};

export type MyPrayerIntentionsPage = {
  data: MyPrayerIntention[];
  meta: PrayerIntentionsPage["meta"];
};

export type PrayerIntentionPrayerResult = {
  id: string;
  intentionId: string;
  prayedAt: string;
  prayerCount: number;
};

export type PrayerIntentionPrayerSummary = ApprovedPrayerIntention & {
  prayerCount: number;
};
