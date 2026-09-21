import { getSupabaseAccessToken } from "@/lib/supabase";
import type {
  CurrentLevel,
  EarnedFriendBadge,
  FriendDetails,
  FriendProfileSummary,
  FriendRequest,
  FriendRequestDirection,
  FriendRequestStatus,
  FriendRequestsPage,
  FriendsComparison,
  FriendsComparisonEntry,
  FriendsLeaderboard,
  FriendsLeaderboardEntry,
  FriendsPage,
  LeaderboardFriendProfile,
  LeaderboardPeriod,
  LeaderboardPeriodType,
  OffsetPageMeta,
  RosaryStreak,
  UserSearchPage,
} from "./friends.types";

type RequestOptions = {
  body?: Record<string, string>;
  method?: "DELETE" | "GET" | "PATCH" | "POST";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`The Friends API returned an invalid ${field}.`);
  }

  return value;
}

function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`The Friends API returned an invalid ${field}.`);
  }

  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The Friends API returned an invalid ${field}.`);
  }

  return value;
}

function readRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`The Friends API returned an invalid ${field}.`);
  }

  return value;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`The Friends API returned an invalid ${field}.`);
  }

  return value;
}

function readNullableString(value: unknown, field: string): string | null {
  return value === null ? null : readString(value, field);
}

function readOptionalNullableString(value: unknown, field: string): string | null {
  return value === undefined || value === null ? null : readString(value, field);
}

function parseOffsetPageMeta(value: unknown): OffsetPageMeta {
  const meta = readRecord(value, "pagination metadata");
  const nextOffset = meta.nextOffset;

  return {
    hasMore: readBoolean(meta.hasMore, "has more"),
    limit: readNumber(meta.limit, "page limit"),
    nextOffset: nextOffset === null ? null : readNumber(nextOffset, "next offset"),
    offset: readNumber(meta.offset, "page offset"),
  };
}

function parseCurrentLevel(value: unknown): CurrentLevel {
  const level = readRecord(value, "current level");

  return {
    code: readNullableString(level.code, "level code"),
    levelNumber: readNumber(level.levelNumber, "level number"),
    name: readNullableString(level.name, "level name"),
  };
}

function parseRosaryStreak(value: unknown): RosaryStreak {
  const streak = readRecord(value, "Rosary streak");

  return {
    asOfDate: readString(streak.asOfDate, "streak date"),
    currentStreak: readNumber(streak.currentStreak, "current streak"),
    longestStreak: readNumber(streak.longestStreak, "longest streak"),
    timezone: readString(streak.timezone, "streak timezone"),
  };
}

function parseFriendProfile(value: unknown): FriendProfileSummary {
  const profile = readRecord(value, "friend profile");

  return {
    avatarUrl: readNullableString(profile.avatarUrl, "friend avatar URL"),
    countryCode: readString(profile.countryCode, "friend country code"),
    displayName: readString(profile.displayName, "friend display name"),
    id: readString(profile.id, "friend ID"),
    title: readNullableString(profile.title, "friend title"),
    username: readNullableString(profile.username, "friend username"),
  };
}

/** Parses the smaller profile projection returned by leaderboard endpoints. */
function parseLeaderboardFriendProfile(value: unknown): LeaderboardFriendProfile {
  const profile = readRecord(value, "leaderboard friend profile");

  return {
    avatarUrl: readOptionalNullableString(profile.avatarUrl, "leaderboard friend avatar URL"),
    countryCode: readOptionalNullableString(profile.countryCode, "leaderboard friend country code"),
    displayName: readString(profile.displayName, "leaderboard friend display name"),
    id: readString(profile.id, "leaderboard friend ID"),
    saintAvatarId: readOptionalNullableString(profile.saintAvatarId, "leaderboard friend saint avatar ID"),
    title: readOptionalNullableString(profile.title, "leaderboard friend title"),
    username: readOptionalNullableString(profile.username, "leaderboard friend username"),
  };
}

function parseFriendSummary(value: unknown) {
  const friend = readRecord(value, "friend summary");
  const rosaryStreak = friend.rosaryStreak;

  return {
    ...parseFriendProfile(friend),
    badgeCount: readNumber(friend.badgeCount, "friend badge count"),
    currentLevel: parseCurrentLevel(friend.currentLevel),
    friendsSince: readString(friend.friendsSince, "friendship date"),
    ...(rosaryStreak === undefined ? {} : { rosaryStreak: parseRosaryStreak(rosaryStreak) }),
    rosaryTotal: readNumber(friend.rosaryTotal, "friend Rosary total"),
    totalXp: readNumber(friend.totalXp, "friend total XP"),
  };
}

function parseFriendRequest(value: unknown): FriendRequest {
  const request = readRecord(value, "friend request");
  const status = readString(request.status, "friend request status") as FriendRequestStatus;
  const direction = readString(request.direction, "friend request direction") as FriendRequestDirection;

  if (!["pending", "accepted", "rejected", "cancelled"].includes(status)) {
    throw new Error("The Friends API returned an unknown friend request status.");
  }

  if (!["incoming", "outgoing"].includes(direction)) {
    throw new Error("The Friends API returned an unknown friend request direction.");
  }

  return {
    cancelledAt: readNullableString(request.cancelledAt, "cancelled date"),
    createdAt: readString(request.createdAt, "friend request creation date"),
    direction,
    id: readString(request.id, "friend request ID"),
    respondedAt: readNullableString(request.respondedAt, "response date"),
    status,
    user: parseFriendProfile(request.user),
  };
}

/** Parses supported periods and normalizes legacy client periods to weekly metadata. */
function parseLeaderboardPeriod(value: unknown): LeaderboardPeriod {
  const period = readRecord(value, "leaderboard period");
  const rawPeriodType = readString(period.periodType, "period type");
  const status = readString(period.status, "period status") as LeaderboardPeriod["status"];
  let periodType: LeaderboardPeriodType;

  if (rawPeriodType === "weekly" || rawPeriodType === "yearly") {
    periodType = rawPeriodType;
  } else if (["daily", "monthly", "season"].includes(rawPeriodType)) {
    periodType = "weekly";
  } else {
    throw new Error("The Friends API returned an unknown leaderboard period.");
  }

  if (!["scheduled", "active", "calculating", "finalized"].includes(status)) {
    throw new Error("The Friends API returned an unknown leaderboard status.");
  }

  return {
    code: readString(period.code, "period code"),
    endsAt: readString(period.endsAt, "period end"),
    id: readString(period.id, "period ID"),
    name: readString(period.name, "period name"),
    periodType,
    startsAt: readString(period.startsAt, "period start"),
    status,
  };
}

function parseLeaderboardEntry(value: unknown): FriendsLeaderboardEntry {
  const entry = readRecord(value, "leaderboard entry");

  return {
    friend: parseLeaderboardFriendProfile(entry.friend),
    isCurrentUser: readBoolean(entry.isCurrentUser, "current user ranking flag"),
    points: readNumber(entry.points, "leaderboard points"),
    prayersCount: readNumber(entry.prayersCount, "prayer count"),
    rank: readNumber(entry.rank, "leaderboard rank"),
    rosariesCount: readNumber(entry.rosariesCount, "Rosary count"),
    scriptureReadingsCount: readNumber(entry.scriptureReadingsCount, "Scripture reading count"),
  };
}

function parseFriendsComparisonEntry(value: unknown): FriendsComparisonEntry {
  const entry = readRecord(value, "friends comparison entry");
  const activity = readRecord(entry.periodActivity, "period activity");

  return {
    badgeCount: readNumber(entry.badgeCount, "comparison badge count"),
    currentLevel: parseCurrentLevel(entry.currentLevel),
    isCurrentUser: readBoolean(entry.isCurrentUser, "comparison current user flag"),
    lifetimePoints: readNumber(entry.lifetimePoints, "lifetime points"),
    periodActivity: {
      prayersCount: readNumber(activity.prayersCount, "comparison prayer count"),
      rosariesCount: readNumber(activity.rosariesCount, "comparison Rosary count"),
      scriptureReadingsCount: readNumber(activity.scriptureReadingsCount, "comparison Scripture reading count"),
    },
    periodPoints: readNumber(entry.periodPoints, "period points"),
    profile: parseFriendProfile(entry.profile),
    rank: readNumber(entry.rank, "comparison rank"),
    rosaryStreak: parseRosaryStreak(entry.rosaryStreak),
    rosaryTotal: readNumber(entry.rosaryTotal, "comparison Rosary total"),
    totalXp: readNumber(entry.totalXp, "comparison total XP"),
  };
}

function parseEarnedFriendBadge(value: unknown): EarnedFriendBadge {
  const earned = readRecord(value, "earned badge");
  const badge = readRecord(earned.badge, "badge");

  return {
    badge: {
      category: readString(badge.category, "badge category"),
      code: readString(badge.code, "badge code"),
      description: readString(badge.description, "badge description"),
      iconUrl: readNullableString(badge.iconUrl, "badge icon URL"),
      id: readString(badge.id, "badge ID"),
      name: readString(badge.name, "badge name"),
      rarity: readString(badge.rarity, "badge rarity"),
    },
    earnedAt: readString(earned.earnedAt, "badge earned date"),
    id: readString(earned.id, "earned badge ID"),
    isFeatured: readBoolean(earned.isFeatured, "featured badge flag"),
    sequenceNumber: readNumber(earned.sequenceNumber, "badge sequence number"),
  };
}

async function getRequestConfig() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Set EXPO_PUBLIC_API_URL before loading Friends data.");
  }

  const accessToken = await getSupabaseAccessToken();

  return { accessToken, apiUrl: apiUrl.replace(/\/$/, "") };
}

async function request(path: string, options: RequestOptions = {}): Promise<unknown> {
  const { accessToken, apiUrl } = await getRequestConfig();
  const body = options.body ? JSON.stringify(options.body) : undefined;
  const response = await fetch(`${apiUrl}${path}`, {
    body,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    method: options.method ?? "GET",
  });

  if (!response.ok) {
    throw new Error(`Unable to complete Friends request (${response.status}).`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json() as Promise<unknown>;
}

function createQuery(values: Record<string, number | string | undefined>): string {
  const search = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) search.set(key, String(value));
  });

  return search.toString();
}

export async function getFriends({
  includeRosaryStreak = true,
  limit = 20,
  offset = 0,
}: {
  includeRosaryStreak?: boolean;
  limit?: number;
  offset?: number;
} = {}): Promise<FriendsPage> {
  const payload = readRecord(
    await request(
      `/api/v1/me/friends?${createQuery({ include: includeRosaryStreak ? "rosaryStreak" : undefined, limit, offset })}`,
    ),
    "friends response",
  );

  return {
    data: readArray(payload.data, "friends").map(parseFriendSummary),
    meta: parseOffsetPageMeta(payload.meta),
  };
}

export async function getFriendRequests({
  direction = "incoming",
  limit = 20,
  offset = 0,
  status = "pending",
}: {
  direction?: FriendRequestDirection;
  limit?: number;
  offset?: number;
  status?: FriendRequestStatus | "all";
} = {}): Promise<FriendRequestsPage> {
  const payload = readRecord(
    await request(`/api/v1/me/friend-requests?${createQuery({ direction, limit, offset, status })}`),
    "friend requests response",
  );
  return {
    data: readArray(payload.data, "friend requests").map(parseFriendRequest),
    meta: parseOffsetPageMeta(payload.meta),
  };
}

export async function searchUsers(query: string, limit = 20, offset = 0): Promise<UserSearchPage> {
  if (!/^[a-zA-Z0-9_]{4,30}$/.test(query)) {
    throw new Error("Enter 4–30 letters, numbers, or underscores to search usernames.");
  }

  const payload = readRecord(
    await request(`/api/v1/users/search?${createQuery({ limit, offset, q: query })}`),
    "user search response",
  );

  return {
    data: readArray(payload.data, "user search results").map((result) => {
      const user = readRecord(result, "user search result");
      const relationshipState = readString(
        user.relationshipState,
        "relationship state",
      ) as UserSearchPage["data"][number]["relationshipState"];
      if (!["none", "outgoingPending", "incomingPending", "friends"].includes(relationshipState)) {
        throw new Error("The Friends API returned an unknown relationship state.");
      }
      return {
        avatarUrl: readNullableString(user.avatarUrl, "search avatar URL"),
        relationshipState,
        title: readNullableString(user.title, "search title"),
        username: readString(user.username, "search username"),
      };
    }),
    meta: parseOffsetPageMeta(payload.meta),
  };
}

export async function sendFriendRequest(username: string): Promise<void> {
  await request("/api/v1/me/friend-requests", { body: { username }, method: "POST" });
}

export async function acceptFriendRequest(requestId: string): Promise<void> {
  await request(`/api/v1/me/friend-requests/${encodeURIComponent(requestId)}`, {
    body: { decision: "accepted" },
    method: "PATCH",
  });
}

export async function rejectFriendRequest(requestId: string): Promise<void> {
  await request(`/api/v1/me/friend-requests/${encodeURIComponent(requestId)}`, {
    body: { decision: "rejected" },
    method: "PATCH",
  });
}

export async function cancelFriendRequest(requestId: string): Promise<void> {
  await request(`/api/v1/me/friend-requests/${encodeURIComponent(requestId)}`, { method: "DELETE" });
}

export async function removeFriend(friendId: string): Promise<void> {
  await request(`/api/v1/me/friends/${encodeURIComponent(friendId)}`, { method: "DELETE" });
}

export async function getRosaryLeaderboard({
  limit = 50,
  offset = 0,
  periodType = "weekly",
}: {
  limit?: number;
  offset?: number;
  periodType?: LeaderboardPeriodType;
} = {}): Promise<FriendsLeaderboard> {
  const payload = readRecord(
    await request(`/api/v1/me/friends/leaderboard?${createQuery({ limit, offset, periodType })}`),
    "friends leaderboard response",
  );
  const data = readRecord(payload.data, "friends leaderboard data");
  const currentUserEntry = data.currentUserEntry;

  return {
    currentUserEntry:
      currentUserEntry === undefined || currentUserEntry === null ? null : parseLeaderboardEntry(currentUserEntry),
    entries: readArray(data.entries, "leaderboard entries").map(parseLeaderboardEntry),
    period: parseLeaderboardPeriod(data.period),
    total: readNumber(data.total, "leaderboard total"),
  };
}

export async function getFriendProfile(friendId: string, includeRosaryStreak = true): Promise<FriendDetails> {
  const query = includeRosaryStreak ? "?include=rosaryStreak" : "";
  const payload = readRecord(
    await request(`/api/v1/me/friends/${encodeURIComponent(friendId)}${query}`),
    "friend profile response",
  );
  const data = readRecord(payload.data, "friend profile data");
  const progress = readRecord(data.progress, "friend progress");

  return {
    badges: readArray(data.badges, "friend badges").map(parseEarnedFriendBadge),
    friend: parseFriendProfile(data.friend),
    progress: {
      currentLevel: parseCurrentLevel(progress.currentLevel),
      totalXp: readNumber(progress.totalXp, "friend total XP"),
    },
    ...(data.rosaryStreak === undefined ? {} : { rosaryStreak: parseRosaryStreak(data.rosaryStreak) }),
    rosaryTotal: readNumber(data.rosaryTotal, "friend Rosary total"),
  };
}

export async function getFriendsComparison({
  limit = 100,
  offset = 0,
  periodType = "weekly",
}: {
  limit?: number;
  offset?: number;
  periodType?: LeaderboardPeriodType;
} = {}): Promise<FriendsComparison> {
  const payload = readRecord(
    await request(`/api/v1/me/friends/comparison?${createQuery({ limit, offset, periodType })}`),
    "friends comparison response",
  );
  const data = readRecord(payload.data, "friends comparison data");

  return {
    entries: readArray(data.entries, "comparison entries").map(parseFriendsComparisonEntry),
    limit: readNumber(data.limit, "comparison limit"),
    offset: readNumber(data.offset, "comparison offset"),
    period: parseLeaderboardPeriod(data.period),
    total: readNumber(data.total, "comparison total"),
  };
}
