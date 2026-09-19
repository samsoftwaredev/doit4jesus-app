import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendProfile,
  getFriendRequests,
  getFriends,
  getFriendsComparison,
  getRosaryLeaderboard,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from "./friends.api";

jest.mock("@/lib/supabase", () => ({
  getSupabaseAccessToken: jest.fn(async () => "test-token"),
}));

const pageMeta = { hasMore: true, limit: 20, nextOffset: 20, offset: 0 };
const profile = {
  avatarUrl: null,
  countryCode: "US",
  displayName: "Maria Santos",
  id: "friend-maria",
  title: "Prayer Champion",
  username: "maria",
};
const level = { code: "disciple", levelNumber: 3, name: "Disciple" };
const streak = {
  asOfDate: "2026-08-26",
  currentStreak: 14,
  longestStreak: 27,
  timezone: "America/Chicago",
};
const period = {
  code: "week-2026-35",
  endsAt: "2026-08-30T00:00:00.000Z",
  id: "period-1",
  name: "This week",
  periodType: "weekly",
  startsAt: "2026-08-24T00:00:00.000Z",
  status: "active",
};
const leaderboardEntry = {
  friend: profile,
  isCurrentUser: false,
  points: 4320,
  prayersCount: 15,
  rank: 1,
  rosariesCount: 25,
  scriptureReadingsCount: 10,
};

function successResponse(data: unknown, status = 200) {
  return { json: async () => data, ok: true, status };
}

function buildFetchMock() {
  return jest.fn(async (input: string) => {
    if (input.includes("/friend-requests?")) {
      return successResponse({
        data: [
          {
            cancelledAt: null,
            createdAt: "2026-08-20T00:00:00.000Z",
            direction: "incoming",
            id: "request-1",
            respondedAt: null,
            status: "pending",
            user: profile,
          },
        ],
        meta: pageMeta,
      });
    }

    if (input.includes("/users/search?")) {
      return successResponse({
        data: [{ avatarUrl: null, relationshipState: "none", title: null, username: "maria" }],
        meta: pageMeta,
      });
    }

    if (input.includes("/friends/leaderboard?")) {
      return successResponse({
        data: { currentUserEntry: leaderboardEntry, entries: [leaderboardEntry], period, total: 1 },
      });
    }

    if (input.includes("/friends/comparison?")) {
      return successResponse({
        data: {
          entries: [
            {
              badgeCount: 2,
              currentLevel: level,
              isCurrentUser: true,
              lifetimePoints: 4320,
              periodActivity: { prayersCount: 15, rosariesCount: 25, scriptureReadingsCount: 10 },
              periodPoints: 240,
              profile: { ...profile, id: "current-user" },
              rank: 1,
              rosaryStreak: streak,
              rosaryTotal: 25,
              totalXp: 4320,
            },
          ],
          limit: 100,
          offset: 0,
          period,
          total: 1,
        },
      });
    }

    if (/\/friends\/[^?]+/.test(input) && !input.includes("/friends?")) {
      return successResponse({
        data: {
          badges: [
            {
              badge: {
                category: "prayer",
                code: "FIRST_ROSARY",
                description: "Prayed your first rosary.",
                iconUrl: null,
                id: "badge-1",
                name: "First Rosary",
                rarity: "common",
              },
              earnedAt: "2026-08-20T00:00:00.000Z",
              id: "earned-1",
              isFeatured: false,
              sequenceNumber: 1,
            },
          ],
          friend: profile,
          progress: { currentLevel: level, totalXp: 4320 },
          rosaryStreak: streak,
          rosaryTotal: 25,
        },
      });
    }

    if (input.includes("/friends?")) {
      return successResponse({
        data: [
          {
            ...profile,
            badgeCount: 2,
            currentLevel: level,
            friendsSince: "2026-08-20T00:00:00.000Z",
            rosaryStreak: streak,
            rosaryTotal: 25,
            totalXp: 4320,
          },
        ],
        meta: pageMeta,
      });
    }

    return { ok: true, status: 204 };
  });
}

describe("Friends API", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test/";
    globalThis.fetch = buildFetchMock() as unknown as typeof fetch;
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  it("parses each read endpoint with its authenticated response", async () => {
    const [friends, requests, search, leaderboard, friend, comparison] = await Promise.all([
      getFriends(),
      getFriendRequests(),
      searchUsers("maria"),
      getRosaryLeaderboard(),
      getFriendProfile("friend/maria"),
      getFriendsComparison(),
    ]);

    expect(friends.data[0]).toMatchObject({ displayName: "Maria Santos", rosaryStreak: streak });
    expect(requests.data[0]).toMatchObject({ direction: "incoming", status: "pending" });
    expect(search.data[0]).toMatchObject({ relationshipState: "none", username: "maria" });
    expect(leaderboard.currentUserEntry).toMatchObject({ points: 4320 });
    expect(friend.badges[0]).toMatchObject({ badge: { code: "FIRST_ROSARY" } });
    expect(comparison.entries[0]).toMatchObject({ isCurrentUser: true, rosaryTotal: 25 });
  });

  it("parses leaderboard friends when the endpoint omits countryCode", async () => {
    globalThis.fetch = jest.fn(async () =>
      successResponse({
        data: {
          currentUserEntry: {
            friend: {
              avatarUrl: "https://i.pravatar.cc/256?u=testuser",
              displayName: "Test User",
              id: "9629e3e7-72dc-4bb1-94d3-b5a2bdd9f002",
              title: "Faithful Beginner",
              username: "testuser",
            },
            isCurrentUser: true,
            points: 105,
            prayersCount: 1,
            rank: 2,
            rosariesCount: 0,
            scriptureReadingsCount: 2,
          },
          entries: [
            {
              friend: {
                avatarUrl: "https://i.pravatar.cc/256?u=mariasantos",
                displayName: "Maria Santos",
                id: "11111111-1111-4111-8111-111111111111",
                title: "Prayer Champion",
                username: "mariasantos",
              },
              isCurrentUser: false,
              points: 110,
              prayersCount: 0,
              rank: 1,
              rosariesCount: 0,
              scriptureReadingsCount: 0,
            },
          ],
          period: {
            code: "week-2026-W38",
            endsAt: "2026-09-21T00:00:00+00:00",
            id: "3e6ff0c6-ebf8-4949-b4a3-5fcf1bb24555",
            name: "Week of 2026-09-14",
            periodType: "weekly",
            startsAt: "2026-09-14T00:00:00+00:00",
            status: "active",
          },
          total: 2,
        },
      }),
    ) as unknown as typeof fetch;

    await expect(getRosaryLeaderboard()).resolves.toMatchObject({
      currentUserEntry: { friend: { countryCode: null, displayName: "Test User" } },
      entries: [{ friend: { countryCode: null, displayName: "Maria Santos" } }],
      period: { periodType: "weekly" },
      total: 2,
    });
  });

  it("requests yearly leaderboard and comparison periods", async () => {
    await getRosaryLeaderboard({ periodType: "yearly" });
    await getFriendsComparison({ periodType: "yearly" });

    const fetchMock = globalThis.fetch as unknown as jest.Mock;
    expect(fetchMock.mock.calls[0][0]).toContain("/friends/leaderboard?limit=50&offset=0&periodType=yearly");
    expect(fetchMock.mock.calls[1][0]).toContain("/friends/comparison?limit=100&offset=0&periodType=yearly");
  });

  it.each(["daily", "monthly", "season"])("normalizes legacy %s period metadata to weekly", async (periodType) => {
    globalThis.fetch = jest.fn(async () =>
      successResponse({
        data: { currentUserEntry: null, entries: [], period: { ...period, periodType }, total: 0 },
      }),
    ) as unknown as typeof fetch;

    await expect(getRosaryLeaderboard()).resolves.toMatchObject({ period: { periodType: "weekly" } });
  });

  it("rejects completely unknown leaderboard period metadata", async () => {
    globalThis.fetch = jest.fn(async () =>
      successResponse({
        data: { currentUserEntry: null, entries: [], period: { ...period, periodType: "lifetime" }, total: 0 },
      }),
    ) as unknown as typeof fetch;

    await expect(getRosaryLeaderboard()).rejects.toThrow("unknown leaderboard period");
  });

  it("sends all friend mutations as authenticated requests", async () => {
    await sendFriendRequest("maria");
    await acceptFriendRequest("request/one");
    await rejectFriendRequest("request/two");
    await cancelFriendRequest("request/three");
    await removeFriend("friend/four");

    const fetchMock = globalThis.fetch as unknown as jest.Mock;
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/friend-requests",
      expect.objectContaining({
        body: JSON.stringify({ username: "maria" }),
        headers: expect.objectContaining({ Authorization: "Bearer test-token", "Content-Type": "application/json" }),
        method: "POST",
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/me/friends/friend%2Ffour",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("supports optional friend data and omits disabled query parameters", async () => {
    const fetchMock = jest.fn(async (input: string) => {
      if (input.includes("/friends?")) {
        return successResponse({
          data: [
            {
              ...profile,
              avatarUrl: "https://cdn.example.test/avatar.png",
              badgeCount: 0,
              currentLevel: { code: null, levelNumber: 1, name: null },
              friendsSince: "2026-08-20T00:00:00.000Z",
              rosaryTotal: 0,
              title: null,
              totalXp: 0,
              username: null,
            },
          ],
          meta: { ...pageMeta, nextOffset: null },
        });
      }
      if (input.includes("/leaderboard?")) {
        return successResponse({ data: { currentUserEntry: null, entries: [], period, total: 0 } });
      }
      return successResponse({
        data: { badges: [], friend: profile, progress: { currentLevel: level, totalXp: 0 }, rosaryTotal: 0 },
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const friends = await getFriends({ includeRosaryStreak: false });
    const leaderboard = await getRosaryLeaderboard();
    const friend = await getFriendProfile("friend-1", false);

    expect(friends.data[0].rosaryStreak).toBeUndefined();
    expect(leaderboard.currentUserEntry).toBeNull();
    expect(friend.rosaryStreak).toBeUndefined();
    expect(fetchMock.mock.calls[0][0]).not.toContain("include=rosaryStreak");
    expect(fetchMock.mock.calls[2][0]).not.toContain("include=rosaryStreak");
  });

  it("rejects invalid client input and failed API responses", async () => {
    await expect(searchUsers("no")).rejects.toThrow("4–30");

    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 401 })) as unknown as typeof fetch;
    await expect(getFriends()).rejects.toThrow("401");

    delete process.env.EXPO_PUBLIC_API_URL;
    await expect(getFriends()).rejects.toThrow("Set EXPO_PUBLIC_API_URL");
  });

  it("rejects unsupported server enum values", async () => {
    globalThis.fetch = jest.fn(async (input: string) => {
      if (input.includes("/friend-requests?")) {
        return successResponse({
          data: [
            {
              cancelledAt: null,
              createdAt: "2026-08-20T00:00:00.000Z",
              direction: "sideways",
              id: "request-1",
              respondedAt: null,
              status: "pending",
              user: profile,
            },
          ],
          meta: pageMeta,
        });
      }
      if (input.includes("/users/search?")) {
        return successResponse({
          data: [{ avatarUrl: null, relationshipState: "unknown", title: null, username: "maria" }],
          meta: pageMeta,
        });
      }
      return successResponse({
        data: { currentUserEntry: null, entries: [], period: { ...period, status: "invalid" }, total: 0 },
      });
    }) as unknown as typeof fetch;

    await expect(getFriendRequests()).rejects.toThrow("unknown friend request direction");
    await expect(searchUsers("maria")).rejects.toThrow("unknown relationship state");
    await expect(getRosaryLeaderboard()).rejects.toThrow("unknown leaderboard status");
  });

  it("rejects an unsupported friend-request status", async () => {
    globalThis.fetch = jest.fn(async () =>
      successResponse({
        data: [
          {
            cancelledAt: null,
            createdAt: "2026-08-20T00:00:00.000Z",
            direction: "incoming",
            id: "request-1",
            respondedAt: null,
            status: "unknown",
            user: profile,
          },
        ],
        meta: pageMeta,
      }),
    ) as unknown as typeof fetch;

    await expect(getFriendRequests()).rejects.toThrow("unknown friend request status");
  });
});
