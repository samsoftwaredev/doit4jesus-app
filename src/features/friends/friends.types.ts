export type FriendRequestDirection = "incoming" | "outgoing";
export type FriendRequestStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type LeaderboardPeriodType = "daily" | "weekly" | "monthly" | "yearly" | "season";

export interface OffsetPageMeta {
  hasMore: boolean;
  limit: number;
  nextOffset: number | null;
  offset: number;
}

export interface RosaryStreak {
  asOfDate: string;
  currentStreak: number;
  longestStreak: number;
  timezone: string;
}

export interface CurrentLevel {
  code: string | null;
  levelNumber: number;
  name: string | null;
}

export interface FriendProfileSummary {
  avatarUrl: string | null;
  countryCode: string;
  displayName: string;
  id: string;
  title: string | null;
  username: string | null;
}

export interface FriendSummary extends FriendProfileSummary {
  badgeCount: number;
  currentLevel: CurrentLevel;
  friendsSince: string;
  rosaryStreak?: RosaryStreak;
  rosaryTotal: number;
  totalXp: number;
}

export interface FriendRequestUser extends FriendProfileSummary {}

export interface FriendRequest {
  cancelledAt: string | null;
  createdAt: string;
  direction: FriendRequestDirection;
  id: string;
  respondedAt: string | null;
  status: FriendRequestStatus;
  user: FriendRequestUser;
}

export interface UserSearchResult {
  avatarUrl: string | null;
  relationshipState: "none" | "outgoingPending" | "incomingPending" | "friends";
  title: string | null;
  username: string;
}

export interface LeaderboardPeriod {
  code: string;
  endsAt: string;
  id: string;
  name: string;
  periodType: LeaderboardPeriodType;
  startsAt: string;
  status: "scheduled" | "active" | "calculating" | "finalized";
}

export interface FriendsLeaderboardEntry {
  friend: FriendProfileSummary;
  isCurrentUser: boolean;
  points: number;
  prayersCount: number;
  rank: number;
  rosariesCount: number;
  scriptureReadingsCount: number;
}

export interface FriendsLeaderboard {
  currentUserEntry: FriendsLeaderboardEntry | null;
  entries: FriendsLeaderboardEntry[];
  period: LeaderboardPeriod;
  total: number;
}

export interface EarnedFriendBadge {
  badge: {
    category: string;
    code: string;
    description: string;
    iconUrl: string | null;
    id: string;
    name: string;
    rarity: string;
  };
  earnedAt: string;
  id: string;
  isFeatured: boolean;
  sequenceNumber: number;
}

export interface FriendDetails {
  badges: EarnedFriendBadge[];
  friend: FriendProfileSummary;
  progress: {
    currentLevel: CurrentLevel;
    totalXp: number;
  };
  rosaryStreak?: RosaryStreak;
  rosaryTotal: number;
}

export interface FriendsComparisonEntry {
  badgeCount: number;
  currentLevel: CurrentLevel;
  isCurrentUser: boolean;
  lifetimePoints: number;
  periodActivity: {
    prayersCount: number;
    rosariesCount: number;
    scriptureReadingsCount: number;
  };
  periodPoints: number;
  profile: FriendProfileSummary;
  rank: number;
  rosaryStreak: RosaryStreak;
  rosaryTotal: number;
  totalXp: number;
}

export interface FriendsComparison {
  entries: FriendsComparisonEntry[];
  limit: number;
  offset: number;
  period: LeaderboardPeriod;
  total: number;
}

export interface FriendsPage {
  data: FriendSummary[];
  meta: OffsetPageMeta;
}

export interface FriendRequestsPage {
  data: FriendRequest[];
  meta: OffsetPageMeta;
}

export interface UserSearchPage {
  data: UserSearchResult[];
  meta: OffsetPageMeta;
}
