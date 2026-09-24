import type { FriendRequest, FriendSummary, FriendsComparison, FriendsLeaderboard } from "../friends.types";

export const maria: FriendSummary = {
  avatarUrl: null,
  badgeCount: 2,
  countryCode: "MX",
  currentLevel: { code: "disciple", levelNumber: 3, name: "Disciple" },
  displayName: "Maria Santos",
  friendsSince: "2026-08-15T00:00:00.000Z",
  id: "friend-maria",
  rosaryStreak: { asOfDate: "2026-08-17", currentStreak: 4, longestStreak: 7, timezone: "America/Chicago" },
  rosaryTotal: 12,
  title: "Prayer Champion",
  totalXp: 920,
  username: "mariasantos",
};

export const johnRequest: FriendRequest = {
  cancelledAt: null,
  createdAt: "2026-08-15T00:00:00.000Z",
  direction: "incoming",
  id: "request-john",
  respondedAt: null,
  status: "pending",
  user: {
    avatarUrl: null,
    countryCode: "US",
    displayName: "John Paul",
    id: "friend-john",
    title: "Scripture Seeker",
    username: "johnpaul",
  },
};

export const leaderboard: FriendsLeaderboard = {
  currentUserEntry: {
    friend: {
      avatarUrl: null,
      countryCode: "US",
      displayName: "Virgin Mary",
      id: "current-user",
      saintAvatarId: null,
      title: "Prayer Warrior",
      username: "samsoftwaredev",
    },
    isCurrentUser: true,
    points: 120,
    prayersCount: 5,
    rank: 2,
    rosariesCount: 1,
    scriptureReadingsCount: 2,
  },
  entries: [
    {
      friend: {
        avatarUrl: null,
        countryCode: "MX",
        displayName: "Maria Santos",
        id: "friend-maria",
        saintAvatarId: null,
        title: "Prayer Champion",
        username: "mariasantos",
      },
      isCurrentUser: false,
      points: 240,
      prayersCount: 9,
      rank: 1,
      rosariesCount: 3,
      scriptureReadingsCount: 4,
    },
    {
      friend: {
        avatarUrl: null,
        countryCode: "US",
        displayName: "Virgin Mary",
        id: "current-user",
        saintAvatarId: null,
        title: "Prayer Warrior",
        username: "samsoftwaredev",
      },
      isCurrentUser: true,
      points: 120,
      prayersCount: 5,
      rank: 2,
      rosariesCount: 1,
      scriptureReadingsCount: 2,
    },
  ],
  period: {
    code: "current-week",
    endsAt: "2026-08-18T00:00:00.000Z",
    id: "period-week",
    name: "This Week",
    periodType: "weekly",
    startsAt: "2026-08-11T00:00:00.000Z",
    status: "active",
  },
  total: 2,
};

export const comparison: FriendsComparison = {
  entries: [
    {
      badgeCount: 6,
      currentLevel: { code: "servant", levelNumber: 16, name: "Faithful Servant" },
      isCurrentUser: true,
      lifetimePoints: 1300,
      periodActivity: { prayersCount: 6, rosariesCount: 4, scriptureReadingsCount: 3 },
      periodPoints: 120,
      profile: {
        avatarUrl: null,
        countryCode: "US",
        displayName: "Virgin Mary",
        id: "current-user",
        title: "Prayer Warrior",
        username: "samsoftwaredev",
      },
      rank: 2,
      rosaryStreak: { asOfDate: "2026-08-17", currentStreak: 8, longestStreak: 12, timezone: "America/Chicago" },
      rosaryTotal: 47,
      totalXp: 1200,
    },
    {
      badgeCount: 8,
      currentLevel: { code: "champion", levelNumber: 18, name: "Prayer Champion" },
      isCurrentUser: false,
      lifetimePoints: 1500,
      periodActivity: { prayersCount: 8, rosariesCount: 6, scriptureReadingsCount: 4 },
      periodPoints: 240,
      profile: {
        avatarUrl: null,
        countryCode: "MX",
        displayName: "Maria Santos",
        id: "friend-maria",
        title: "Prayer Champion",
        username: "mariasantos",
      },
      rank: 1,
      rosaryStreak: { asOfDate: "2026-08-17", currentStreak: 12, longestStreak: 21, timezone: "America/Mexico_City" },
      rosaryTotal: 61,
      totalXp: 1500,
    },
  ],
  limit: 100,
  offset: 0,
  period: leaderboard.period,
  total: 2,
};

export function mockFriendsDashboard(hooks: Record<string, jest.Mock>, overrides: Record<string, unknown> = {}) {
  hooks.useFriends.mockReturnValue({
    error: undefined,
    friends: [maria],
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    loadMore: jest.fn(),
    reload: jest.fn(),
    ...overrides,
  });
  hooks.useFriendRequests.mockReturnValue({
    error: undefined,
    hasMore: false,
    isLoading: false,
    isLoadingMore: false,
    isMutatingId: undefined,
    loadMore: jest.fn(),
    reload: jest.fn(),
    requests: [johnRequest],
    resolve: jest.fn(() => Promise.resolve()),
  });
  hooks.useRosaryLeaderboard.mockReturnValue({
    error: undefined,
    isLoading: false,
    isLoadingMore: false,
    leaderboard,
    loadMore: jest.fn(),
    periodType: "weekly",
    reload: jest.fn(),
    setPeriodType: jest.fn(),
  });
}
