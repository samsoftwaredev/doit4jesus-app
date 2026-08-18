import { useCallback, useEffect, useMemo, useState } from "react";

import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendProfile,
  getFriendRequests,
  getFriends,
  getFriendsComparison,
  getRosaryLeaderboard,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from "./friends.api";
import type {
  FriendDetails,
  FriendRequest,
  FriendRequestDirection,
  FriendRequestStatus,
  FriendSummary,
  FriendsComparison,
  FriendsLeaderboard,
  LeaderboardPeriodType,
  UserSearchResult,
} from "./friends.types";

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useFriends() {
  const [friends, setFriends] = useState<FriendSummary[]>([]);
  const [error, setError] = useState<string>();
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      const page = await getFriends();
      setFriends(page.data);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load your friends."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const page = await getFriends({ offset: nextOffset });
      setFriends((current) => [...current, ...page.data]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load more friends."));
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextOffset]);

  return { error, friends, hasMore, isLoading, isLoadingMore, loadMore, reload: load };
}

export function useFriendRequests(direction: FriendRequestDirection) {
  const [error, setError] = useState<string>();
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMutatingId, setIsMutatingId] = useState<string>();
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      const page = await getFriendRequests({ direction });
      setRequests(page.data);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load friend requests."));
    } finally {
      setIsLoading(false);
    }
  }, [direction]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const page = await getFriendRequests({ direction, offset: nextOffset });
      setRequests((current) => [...current, ...page.data]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load more requests."));
    } finally {
      setIsLoadingMore(false);
    }
  }, [direction, hasMore, isLoadingMore, nextOffset]);

  const resolve = useCallback(async (request: FriendRequest, decision: "accepted" | "rejected") => {
    setError(undefined);
    setIsMutatingId(request.id);

    try {
      if (decision === "accepted") {
        await acceptFriendRequest(request.id);
      } else {
        await rejectFriendRequest(request.id);
      }
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (requestError) {
      const message = messageFrom(requestError, "Unable to update this friend request.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsMutatingId(undefined);
    }
  }, []);

  const cancel = useCallback(async (request: FriendRequest) => {
    setError(undefined);
    setIsMutatingId(request.id);

    try {
      await cancelFriendRequest(request.id);
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (requestError) {
      const message = messageFrom(requestError, "Unable to cancel this friend request.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsMutatingId(undefined);
    }
  }, []);

  return {
    cancel,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    isMutatingId,
    loadMore,
    reload: load,
    requests,
    resolve,
  };
}

export function useRosaryLeaderboard(initialPeriod: LeaderboardPeriodType = "weekly") {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [leaderboard, setLeaderboard] = useState<FriendsLeaderboard>();
  const [periodType, setPeriodType] = useState<LeaderboardPeriodType>(initialPeriod);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      setLeaderboard(await getRosaryLeaderboard({ periodType }));
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load the leaderboard."));
    } finally {
      setIsLoading(false);
    }
  }, [periodType]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!leaderboard || leaderboard.entries.length >= leaderboard.total || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const next = await getRosaryLeaderboard({
        offset: leaderboard.entries.length,
        periodType,
      });
      setLeaderboard((current) => {
        if (!current) return next;
        const entries = [...current.entries, ...next.entries].filter(
          (entry, index, all) => all.findIndex((candidate) => candidate.friend.id === entry.friend.id) === index,
        );
        return { ...next, entries };
      });
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load more rankings."));
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, leaderboard, periodType]);

  return {
    error,
    isLoading,
    isLoadingMore,
    leaderboard,
    loadMore,
    periodType,
    reload: load,
    setPeriodType,
  };
}

export function useFriendProfile(friendId: string | undefined) {
  const [error, setError] = useState<string>();
  const [friend, setFriend] = useState<FriendDetails>();
  const [isLoading, setIsLoading] = useState(Boolean(friendId));

  const load = useCallback(async () => {
    if (!friendId) {
      setError("A friend profile could not be found.");
      setIsLoading(false);
      return;
    }

    setError(undefined);
    setIsLoading(true);
    try {
      setFriend(await getFriendProfile(friendId));
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to load this friend profile."));
    } finally {
      setIsLoading(false);
    }
  }, [friendId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { error, friend, isLoading, reload: load };
}

export function useFriendSearch(query: string) {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<UserSearchResult[]>([]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setError(undefined);
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]{4,30}$/.test(normalizedQuery)) {
      setError("Enter at least 4 letters, numbers, or underscores.");
      setResults([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(undefined);
      void searchUsers(normalizedQuery)
        .then((page) => {
          if (!active) return;
          setResults(page.data);
        })
        .catch((requestError: unknown) => {
          if (!active) return;
          setResults([]);
          setError(messageFrom(requestError, "Unable to search users."));
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return { error, isLoading, results };
}

export function useSendFriendRequest() {
  const [error, setError] = useState<string>();
  const [pendingUsername, setPendingUsername] = useState<string>();
  const [requestedUsernames, setRequestedUsernames] = useState<string[]>([]);

  const send = useCallback(async (username: string) => {
    setError(undefined);
    setPendingUsername(username);

    try {
      await sendFriendRequest(username);
      setRequestedUsernames((current) => [...current, username.toLowerCase()]);
    } catch (requestError) {
      const message = messageFrom(requestError, "Unable to send this friend request.");
      setError(message);
      throw new Error(message);
    } finally {
      setPendingUsername(undefined);
    }
  }, []);

  return { error, pendingUsername, requestedUsernames, send };
}

export function useFriendsComparison(friendId: string | undefined) {
  const [comparison, setComparison] = useState<FriendsComparison>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);
    try {
      setComparison(await getFriendsComparison());
    } catch (requestError) {
      setError(messageFrom(requestError, "Unable to compare progress."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!friendId) {
      setError("A friend profile could not be found.");
      setIsLoading(false);
      return;
    }
    void load();
  }, [friendId, load]);

  const entries = comparison?.entries ?? [];
  const currentUser = useMemo(() => entries.find((entry) => entry.isCurrentUser), [entries]);
  const friend = useMemo(
    () => entries.find((entry) => entry.profile.id === friendId),
    [entries, friendId],
  );

  return { comparison, currentUser, error, friend, isLoading, reload: load };
}
