import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  useFriendProfile,
  useFriendRequests,
  useFriends,
  useFriendsComparison,
  useFriendSearch,
  useRosaryLeaderboard,
  useSendFriendRequest,
} from "./friends.hooks";
import type {
  FriendDetails,
  FriendRequest,
  FriendSummary,
  FriendsComparison,
  FriendsLeaderboard,
} from "./friends.types";

const mockAcceptFriendRequest = jest.fn();
const mockCancelFriendRequest = jest.fn();
const mockGetFriendProfile = jest.fn();
const mockGetFriendRequests = jest.fn();
const mockGetFriends = jest.fn();
const mockGetFriendsComparison = jest.fn();
const mockGetRosaryLeaderboard = jest.fn();
const mockRejectFriendRequest = jest.fn();
const mockSearchUsers = jest.fn();
const mockSendFriendRequest = jest.fn();

jest.mock("./friends.api", () => ({
  acceptFriendRequest: (...args: unknown[]) => mockAcceptFriendRequest(...args),
  cancelFriendRequest: (...args: unknown[]) => mockCancelFriendRequest(...args),
  getFriendProfile: (...args: unknown[]) => mockGetFriendProfile(...args),
  getFriendRequests: (...args: unknown[]) => mockGetFriendRequests(...args),
  getFriends: (...args: unknown[]) => mockGetFriends(...args),
  getFriendsComparison: (...args: unknown[]) => mockGetFriendsComparison(...args),
  getRosaryLeaderboard: (...args: unknown[]) => mockGetRosaryLeaderboard(...args),
  rejectFriendRequest: (...args: unknown[]) => mockRejectFriendRequest(...args),
  searchUsers: (...args: unknown[]) => mockSearchUsers(...args),
  sendFriendRequest: (...args: unknown[]) => mockSendFriendRequest(...args),
}));

const friend: FriendSummary = {
  avatarUrl: null,
  badgeCount: 2,
  countryCode: "US",
  currentLevel: { code: "disciple", levelNumber: 3, name: "Disciple" },
  displayName: "Maria",
  friendsSince: "2026-08-20T00:00:00.000Z",
  id: "friend-1",
  rosaryTotal: 25,
  title: null,
  totalXp: 4320,
  username: "maria",
};
const request: FriendRequest = {
  cancelledAt: null,
  createdAt: "2026-08-20T00:00:00.000Z",
  direction: "incoming",
  id: "request-1",
  respondedAt: null,
  status: "pending",
  user: friend,
};
const leaderboard: FriendsLeaderboard = {
  currentUserEntry: null,
  entries: [
    {
      friend: { ...friend, saintAvatarId: null },
      isCurrentUser: false,
      points: 25,
      prayersCount: 2,
      rank: 1,
      rosariesCount: 1,
      scriptureReadingsCount: 1,
    },
  ],
  period: {
    code: "week",
    endsAt: "2026-08-30T00:00:00.000Z",
    id: "period-1",
    name: "This week",
    periodType: "weekly",
    startsAt: "2026-08-24T00:00:00.000Z",
    status: "active",
  },
  total: 2,
};
const details: FriendDetails = {
  badges: [],
  friend,
  progress: { currentLevel: friend.currentLevel, totalXp: friend.totalXp },
  rosaryTotal: friend.rosaryTotal,
};
const comparison: FriendsComparison = {
  entries: [
    {
      badgeCount: 2,
      currentLevel: friend.currentLevel,
      isCurrentUser: true,
      lifetimePoints: 4320,
      periodActivity: { prayersCount: 2, rosariesCount: 1, scriptureReadingsCount: 1 },
      periodPoints: 25,
      profile: { ...friend, id: "current-user" },
      rank: 1,
      rosaryStreak: { asOfDate: "2026-08-20", currentStreak: 2, longestStreak: 3, timezone: "America/Chicago" },
      rosaryTotal: 25,
      totalXp: 4320,
    },
    {
      badgeCount: 2,
      currentLevel: friend.currentLevel,
      isCurrentUser: false,
      lifetimePoints: 1200,
      periodActivity: { prayersCount: 1, rosariesCount: 1, scriptureReadingsCount: 0 },
      periodPoints: 10,
      profile: friend,
      rank: 2,
      rosaryStreak: { asOfDate: "2026-08-20", currentStreak: 1, longestStreak: 1, timezone: "America/Chicago" },
      rosaryTotal: 12,
      totalXp: 1200,
    },
  ],
  limit: 100,
  offset: 0,
  period: leaderboard.period,
  total: 2,
};

describe("friends hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFriends.mockResolvedValue({ data: [friend], meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 } });
    mockGetFriendRequests.mockResolvedValue({
      data: [request],
      meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 },
    });
    mockGetRosaryLeaderboard.mockResolvedValue(leaderboard);
    mockGetFriendProfile.mockResolvedValue(details);
    mockGetFriendsComparison.mockResolvedValue(comparison);
    mockSearchUsers.mockResolvedValue({
      data: [{ avatarUrl: null, relationshipState: "none", title: null, username: "maria" }],
    });
    mockSendFriendRequest.mockResolvedValue(undefined);
    mockAcceptFriendRequest.mockResolvedValue(undefined);
    mockRejectFriendRequest.mockResolvedValue(undefined);
    mockCancelFriendRequest.mockResolvedValue(undefined);
  });

  it("loads and extends the friends list", async () => {
    const { result } = await renderHook(() => useFriends());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => result.current.loadMore());

    expect(result.current.friends).toHaveLength(2);
    expect(mockGetFriends).toHaveBeenLastCalledWith({ offset: 20 });
  });

  it("manages requests, their mutations, and pagination", async () => {
    const { result } = await renderHook(() => useFriendRequests("incoming"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => result.current.resolve(request, "accepted"));
    expect(result.current.requests).toEqual([]);

    mockGetFriendRequests.mockResolvedValueOnce({
      data: [request],
      meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 },
    });
    await act(async () => result.current.reload());
    await act(async () => result.current.resolve(request, "rejected"));
    expect(mockRejectFriendRequest).toHaveBeenCalledWith("request-1");

    await act(async () => result.current.reload());
    await act(async () => result.current.cancel(request));
    expect(mockCancelFriendRequest).toHaveBeenCalledWith("request-1");
  });

  it("loads, appends, and changes leaderboard periods", async () => {
    const { result } = await renderHook(() => useRosaryLeaderboard());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => result.current.loadMore());
    expect(mockGetRosaryLeaderboard).toHaveBeenLastCalledWith({ offset: 1, periodType: "weekly" });

    mockGetRosaryLeaderboard.mockResolvedValueOnce({
      ...leaderboard,
      period: { ...leaderboard.period, name: "This year", periodType: "yearly" },
    });
    await act(async () => result.current.setPeriodType("yearly"));
    await waitFor(() => expect(mockGetRosaryLeaderboard).toHaveBeenLastCalledWith({ periodType: "yearly" }));
  });

  it("ignores a stale weekly leaderboard response after switching to yearly", async () => {
    let resolveWeekly: (value: FriendsLeaderboard) => void = () => undefined;
    const weeklyRequest = new Promise<FriendsLeaderboard>((resolve) => {
      resolveWeekly = resolve;
    });
    const yearlyLeaderboard: FriendsLeaderboard = {
      ...leaderboard,
      period: { ...leaderboard.period, name: "This year", periodType: "yearly" },
    };
    mockGetRosaryLeaderboard.mockImplementation(({ periodType }: { periodType: string }) =>
      periodType === "weekly" ? weeklyRequest : Promise.resolve(yearlyLeaderboard),
    );
    const { result } = await renderHook(() => useRosaryLeaderboard());

    await act(async () => result.current.setPeriodType("yearly"));
    await waitFor(() => expect(result.current.leaderboard?.period.periodType).toBe("yearly"));
    await act(async () => {
      resolveWeekly(leaderboard);
      await weeklyRequest;
    });

    expect(result.current.leaderboard?.period.periodType).toBe("yearly");
  });

  it("falls back to weekly when leaderboard metadata is normalized from a legacy period", async () => {
    const { result } = await renderHook(() => useRosaryLeaderboard("yearly"));

    await waitFor(() => expect(result.current.periodType).toBe("weekly"));
    expect(mockGetRosaryLeaderboard).toHaveBeenNthCalledWith(1, { periodType: "yearly" });
    expect(mockGetRosaryLeaderboard).toHaveBeenLastCalledWith({ periodType: "weekly" });
  });

  it("handles profile and comparison requirements", async () => {
    const missingProfile = await renderHook(() => useFriendProfile(undefined));
    await waitFor(() => expect(missingProfile.result.current.error).toBe("A friend profile could not be found."));

    const profileHook = await renderHook(() => useFriendProfile("friend-1"));
    await waitFor(() => expect(profileHook.result.current.friend).toEqual(details));

    const missingComparison = await renderHook(() => useFriendsComparison(undefined));
    await waitFor(() => expect(missingComparison.result.current.error).toBe("A friend profile could not be found."));

    const comparisonHook = await renderHook(() => useFriendsComparison("friend-1"));
    await waitFor(() => expect(comparisonHook.result.current.friend).toEqual(comparison.entries[1]));
    expect(comparisonHook.result.current.currentUser).toEqual(comparison.entries[0]);
    expect(mockGetFriendsComparison).toHaveBeenLastCalledWith({ periodType: "weekly" });

    mockGetFriendsComparison.mockResolvedValueOnce({
      ...comparison,
      period: { ...comparison.period, name: "This year", periodType: "yearly" },
    });
    await act(async () => comparisonHook.result.current.setPeriodType("yearly"));
    await waitFor(() => expect(mockGetFriendsComparison).toHaveBeenLastCalledWith({ periodType: "yearly" }));
  });

  it("ignores a stale weekly comparison response after switching to yearly", async () => {
    let resolveWeekly: (value: FriendsComparison) => void = () => undefined;
    const weeklyRequest = new Promise<FriendsComparison>((resolve) => {
      resolveWeekly = resolve;
    });
    const yearlyComparison: FriendsComparison = {
      ...comparison,
      period: { ...comparison.period, name: "This year", periodType: "yearly" },
    };
    mockGetFriendsComparison.mockImplementation(({ periodType }: { periodType: string }) =>
      periodType === "weekly" ? weeklyRequest : Promise.resolve(yearlyComparison),
    );
    const { result } = await renderHook(() => useFriendsComparison("friend-1"));

    await act(async () => result.current.setPeriodType("yearly"));
    await waitFor(() => expect(result.current.comparison?.period.periodType).toBe("yearly"));
    await act(async () => {
      resolveWeekly(comparison);
      await weeklyRequest;
    });

    expect(result.current.comparison?.period.periodType).toBe("yearly");
  });

  it("falls back to weekly when comparison metadata is normalized from a legacy period", async () => {
    const { result } = await renderHook(() => useFriendsComparison("friend-1", "yearly"));

    await waitFor(() => expect(result.current.periodType).toBe("weekly"));
    expect(mockGetFriendsComparison).toHaveBeenNthCalledWith(1, { periodType: "yearly" });
    expect(mockGetFriendsComparison).toHaveBeenLastCalledWith({ periodType: "weekly" });
  });

  it("validates and debounces search queries", async () => {
    jest.useFakeTimers();
    const empty = await renderHook(() => useFriendSearch("  "));
    expect(empty.result.current.results).toEqual([]);

    const invalid = await renderHook(() => useFriendSearch("no"));
    await waitFor(() => expect(invalid.result.current.error).toContain("at least 4"));

    const valid = await renderHook(() => useFriendSearch(" maria "));
    await act(async () => jest.advanceTimersByTime(300));
    await waitFor(() => expect(valid.result.current.results).toHaveLength(1));
    expect(mockSearchUsers).toHaveBeenCalledWith("maria");
    jest.useRealTimers();
  });

  it("tracks sent friend requests and exposes API errors", async () => {
    const { result } = await renderHook(() => useSendFriendRequest());

    await act(async () => result.current.send("Maria"));
    expect(result.current.requestedUsernames).toEqual(["maria"]);

    mockSendFriendRequest.mockRejectedValueOnce(new Error("Offline"));
    await act(async () => {
      await expect(result.current.send("Joseph")).rejects.toThrow("Offline");
    });
    expect(result.current.error).toBe("Offline");
  });

  it("keeps friend and request pagination errors visible while allowing a retry", async () => {
    mockGetFriends
      .mockResolvedValueOnce({ data: [friend], meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 } })
      .mockRejectedValueOnce(new Error("Friend page unavailable"));
    const friendsHook = await renderHook(() => useFriends());
    await waitFor(() => expect(friendsHook.result.current.isLoading).toBe(false));
    await act(async () => friendsHook.result.current.loadMore());
    expect(friendsHook.result.current.error).toBe("Friend page unavailable");

    mockGetFriendRequests
      .mockResolvedValueOnce({ data: [request], meta: { hasMore: true, limit: 20, nextOffset: 20, offset: 0 } })
      .mockRejectedValueOnce("unavailable");
    const requestsHook = await renderHook(() => useFriendRequests("incoming"));
    await waitFor(() => expect(requestsHook.result.current.isLoading).toBe(false));
    await act(async () => requestsHook.result.current.loadMore());
    expect(requestsHook.result.current.error).toBe("Unable to load more requests.");
  });

  it("handles failed profile, comparison, search, and friend-request updates", async () => {
    mockGetFriendProfile.mockRejectedValueOnce("unavailable");
    const profileHook = await renderHook(() => useFriendProfile("friend-1"));
    await waitFor(() => expect(profileHook.result.current.error).toBe("Unable to load this friend profile."));

    mockGetFriendsComparison.mockRejectedValueOnce(new Error("Comparison unavailable"));
    const comparisonHook = await renderHook(() => useFriendsComparison("friend-1"));
    await waitFor(() => expect(comparisonHook.result.current.error).toBe("Comparison unavailable"));

    jest.useFakeTimers();
    mockSearchUsers.mockRejectedValueOnce(new Error("Search unavailable"));
    const searchHook = await renderHook(() => useFriendSearch("maria"));
    await act(async () => jest.advanceTimersByTime(300));
    await waitFor(() => expect(searchHook.result.current.error).toBe("Search unavailable"));
    jest.useRealTimers();

    mockAcceptFriendRequest.mockRejectedValueOnce("unavailable");
    const requestsHook = await renderHook(() => useFriendRequests("incoming"));
    await waitFor(() => expect(requestsHook.result.current.isLoading).toBe(false));
    await act(async () => {
      await expect(requestsHook.result.current.resolve(request, "accepted")).rejects.toThrow(
        "Unable to update this friend request.",
      );
    });
    expect(requestsHook.result.current.error).toBe("Unable to update this friend request.");
  });
});
