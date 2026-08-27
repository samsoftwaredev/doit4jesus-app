import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

import { AddFriendScreen } from "@/features/friends/screens/AddFriendScreen";
import { CompareStatsScreen } from "@/features/friends/screens/CompareStatsScreen";
import { FriendProfileScreen } from "@/features/friends/screens/FriendProfileScreen";
import { FriendsLeaderboardScreen } from "@/features/friends/screens/FriendsLeaderboardScreen";
import { FriendsScreen } from "@/features/friends/screens/FriendsScreen";
import type {
  FriendRequest,
  FriendSummary,
  FriendsComparison,
  FriendsLeaderboard,
} from "@/features/friends/friends.types";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRemoveFriend = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, push: mockPush, replace: mockReplace }),
}));

jest.mock("@/features/friends/friends.api", () => ({
  removeFriend: (...args: unknown[]) => mockRemoveFriend(...args),
}));

jest.mock("@/features/friends/friends.hooks", () => ({
  useFriendProfile: jest.fn(),
  useFriendRequests: jest.fn(),
  useFriendSearch: jest.fn(),
  useFriends: jest.fn(),
  useFriendsComparison: jest.fn(),
  useRosaryLeaderboard: jest.fn(),
  useSendFriendRequest: jest.fn(),
}));

const hooks = jest.requireMock("@/features/friends/friends.hooks") as Record<string, jest.Mock>;

const maria: FriendSummary = {
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

const johnRequest: FriendRequest = {
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

const leaderboard: FriendsLeaderboard = {
  currentUserEntry: {
    friend: {
      avatarUrl: null,
      countryCode: "US",
      displayName: "Samuel Ruiz",
      id: "current-user",
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
        displayName: "Samuel Ruiz",
        id: "current-user",
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

const comparison: FriendsComparison = {
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
        displayName: "Samuel Ruiz",
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

function mockMainScreen(overrides: Record<string, unknown> = {}) {
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

describe("Friends feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMainScreen();
  });

  it("renders friends, points, current-user rank, and requests", async () => {
    await render(<FriendsScreen />);

    expect(screen.getByText("Community")).toBeTruthy();
    expect(screen.getByText("LEADERBOARD")).toBeTruthy();
    expect(screen.getByText("240")).toBeTruthy();
    expect(screen.getByText("Samuel Ruiz (You)")).toBeTruthy();
    expect(screen.getByText("John Paul")).toBeTruthy();
    expect(screen.getByText("Your friends")).toBeTruthy();
  });

  it("shows the Friends loading state", async () => {
    mockMainScreen({ friends: [], isLoading: true });
    hooks.useRosaryLeaderboard.mockReturnValue({ isLoading: true });
    hooks.useFriendRequests.mockReturnValue({ isLoading: true });
    await render(<FriendsScreen />);
    expect(screen.getAllByText(/Loading/i).length).toBeGreaterThan(0);
  });

  it("shows the empty friends state", async () => {
    mockMainScreen({ friends: [] });
    await render(<FriendsScreen />);
    expect(screen.getByText("Your fellowship begins here")).toBeTruthy();
  });

  it("shows the Friends error state", async () => {
    mockMainScreen();
    hooks.useRosaryLeaderboard.mockReturnValue({ error: "Network unavailable", isLoading: false });
    await render(<FriendsScreen />);
    expect(screen.getByText("Couldn't load the leaderboard")).toBeTruthy();
  });

  it("accepts and declines incoming friend requests", async () => {
    const friendsReload = jest.fn(() => Promise.resolve());
    const leaderboardReload = jest.fn(() => Promise.resolve());
    const resolve = jest.fn(() => Promise.resolve());
    hooks.useFriends.mockReturnValue({
      error: undefined,
      friends: [maria],
      hasMore: false,
      isLoading: false,
      isLoadingMore: false,
      loadMore: jest.fn(),
      reload: friendsReload,
    });
    hooks.useRosaryLeaderboard.mockReturnValue({
      error: undefined,
      isLoading: false,
      isLoadingMore: false,
      leaderboard,
      loadMore: jest.fn(),
      periodType: "weekly",
      reload: leaderboardReload,
      setPeriodType: jest.fn(),
    });
    hooks.useFriendRequests.mockReturnValue({
      error: undefined,
      isLoading: false,
      isMutatingId: undefined,
      reload: jest.fn(),
      requests: [johnRequest],
      resolve,
    });
    await render(<FriendsScreen />);

    await fireEvent.press(screen.getByLabelText("Accept friend request from John Paul"));
    expect(resolve).toHaveBeenCalledWith(johnRequest, "accepted");
    expect(friendsReload).toHaveBeenCalledTimes(1);
    expect(leaderboardReload).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByLabelText("Decline friend request from John Paul"));
    expect(resolve).toHaveBeenCalledWith(johnRequest, "rejected");
    expect(friendsReload).toHaveBeenCalledTimes(1);
    expect(leaderboardReload).toHaveBeenCalledTimes(1);
  });

  it("switches leaderboard periods and highlights the current user", async () => {
    const setPeriodType = jest.fn();
    hooks.useRosaryLeaderboard.mockReturnValue({
      error: undefined,
      isLoading: false,
      isLoadingMore: false,
      leaderboard,
      loadMore: jest.fn(),
      periodType: "weekly",
      reload: jest.fn(),
      setPeriodType,
    });
    await render(<FriendsLeaderboardScreen />);

    await fireEvent.press(screen.getByText("This Month"));
    expect(setPeriodType).toHaveBeenCalledWith("monthly");
    expect(screen.getByLabelText(/Samuel Ruiz.*You/i)).toBeTruthy();
    expect(screen.getByText("120 more points to reach #1")).toBeTruthy();
  });

  it("shows username search results and sends a friend request", async () => {
    const send = jest.fn(() => Promise.resolve());
    hooks.useFriendSearch.mockReturnValue({
      error: undefined,
      isLoading: false,
      results: [{ avatarUrl: null, relationshipState: "none", title: "Scripture Seeker", username: "johnpaul" }],
    });
    hooks.useSendFriendRequest.mockReturnValue({
      error: undefined,
      pendingUsername: undefined,
      requestedUsernames: [],
      send,
    });
    await render(<AddFriendScreen />);

    await fireEvent.press(screen.getByLabelText("Add @johnpaul as a friend"));
    expect(send).toHaveBeenCalledWith("johnpaul");
  });

  it("renders a friend profile and confirms removal", async () => {
    hooks.useFriendProfile.mockReturnValue({
      error: undefined,
      friend: {
        badges: [],
        friend: maria,
        progress: { currentLevel: maria.currentLevel, totalXp: maria.totalXp },
        rosaryStreak: maria.rosaryStreak,
        rosaryTotal: maria.rosaryTotal,
      },
      isLoading: false,
      reload: jest.fn(),
    });
    const alertSpy = jest.spyOn(Alert, "alert");
    await render(<FriendProfileScreen friendId="friend-maria" />);

    expect(screen.getByText("TOTAL ROSARIES")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Friend options"));
    await fireEvent.press(screen.getByText("Remove Friend"));
    expect(alertSpy).toHaveBeenCalledWith("Remove friend?", expect.any(String), expect.any(Array));
  });

  it("compares only backend-supported friend stats", async () => {
    hooks.useFriendsComparison.mockReturnValue({
      comparison,
      currentUser: comparison.entries[0],
      error: undefined,
      friend: comparison.entries[1],
      isLoading: false,
      reload: jest.fn(),
    });
    await render(<CompareStatsScreen friendId="friend-maria" />);

    expect(screen.getByText("Total Rosaries")).toBeTruthy();
    expect(screen.getByText("120 points to catch up. Every prayer moves you forward.")).toBeTruthy();
  });
});
