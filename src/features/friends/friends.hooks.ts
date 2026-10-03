import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { i18n } from "@/localization";
import { logDevelopmentError } from "@/lib/development-logger";

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
  FriendSummary,
  FriendsComparison,
  FriendsLeaderboard,
  LeaderboardPeriodType,
  UserSearchResult,
} from "./friends.types";

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useFriends(initialPage?: {
  data: FriendSummary[];
  meta: { hasMore: boolean; nextOffset: number | null };
}) {
  const [friends, setFriends] = useState<FriendSummary[]>(initialPage?.data ?? []);
  const [error, setError] = useState<string>();
  const [hasMore, setHasMore] = useState(initialPage?.meta.hasMore ?? false);
  const [isLoading, setIsLoading] = useState(!initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(initialPage?.meta.nextOffset ?? null);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      const page = await getFriends();
      setFriends(page.data);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      logDevelopmentError("loading friends", requestError);
      setError(messageFrom(requestError, i18n.t("friends.errors.loadFriends")));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialPage) void load();
  }, [initialPage, load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const page = await getFriends({ offset: nextOffset });
      setFriends((current) => [...current, ...page.data]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      logDevelopmentError("loading more friends", requestError);
      setError(messageFrom(requestError, i18n.t("friends.errors.loadMoreFriends")));
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextOffset]);

  return { error, friends, hasMore, isLoading, isLoadingMore, loadMore, reload: load };
}

export function useFriendRequests(
  direction: FriendRequestDirection,
  initialPage?: { data: FriendRequest[]; meta: { hasMore: boolean; nextOffset: number | null } },
) {
  const [error, setError] = useState<string>();
  const [hasMore, setHasMore] = useState(initialPage?.meta.hasMore ?? false);
  const [isLoading, setIsLoading] = useState(!initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMutatingId, setIsMutatingId] = useState<string>();
  const [nextOffset, setNextOffset] = useState<number | null>(initialPage?.meta.nextOffset ?? null);
  const [requests, setRequests] = useState<FriendRequest[]>(initialPage?.data ?? []);

  const load = useCallback(async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      const page = await getFriendRequests({ direction });
      setRequests(page.data);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      logDevelopmentError("loading friend requests", requestError);
      setError(messageFrom(requestError, i18n.t("friends.errors.loadRequests")));
    } finally {
      setIsLoading(false);
    }
  }, [direction]);

  useEffect(() => {
    if (!initialPage) void load();
  }, [initialPage, load]);

  const loadMore = useCallback(async () => {
    if (!hasMore || nextOffset === null || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const page = await getFriendRequests({ direction, offset: nextOffset });
      setRequests((current) => [...current, ...page.data]);
      setHasMore(page.meta.hasMore);
      setNextOffset(page.meta.nextOffset);
    } catch (requestError) {
      logDevelopmentError("loading more friend requests", requestError);
      setError(messageFrom(requestError, i18n.t("friends.errors.loadMoreRequests")));
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
      logDevelopmentError("resolving a friend request", requestError);
      const message = messageFrom(requestError, i18n.t("friends.errors.updateRequest"));
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
      logDevelopmentError("cancelling a friend request", requestError);
      const message = messageFrom(requestError, i18n.t("friends.errors.cancelRequest"));
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

/** Loads the Friends leaderboard for the selected weekly or yearly period. */
export function useRosaryLeaderboard(
  initialPeriod: LeaderboardPeriodType = "weekly",
  initialLeaderboard?: FriendsLeaderboard,
) {
  const activeRequest = useRef(0);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(!initialLeaderboard);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [leaderboard, setLeaderboard] = useState<FriendsLeaderboard | undefined>(initialLeaderboard);
  const [periodType, setPeriodType] = useState<LeaderboardPeriodType>(initialPeriod);

  const load = useCallback(async () => {
    const requestId = ++activeRequest.current;
    setError(undefined);
    setIsLoading(true);
    setIsLoadingMore(false);

    try {
      const nextLeaderboard = await getRosaryLeaderboard({ periodType });
      if (requestId !== activeRequest.current) return;
      if (nextLeaderboard.period.periodType !== periodType) {
        setPeriodType(nextLeaderboard.period.periodType);
        return;
      }
      setLeaderboard(nextLeaderboard);
    } catch (requestError) {
      logDevelopmentError("loading the Rosary leaderboard", requestError);
      if (requestId !== activeRequest.current) return;
      setError(messageFrom(requestError, i18n.t("friends.errors.loadLeaderboard")));
    } finally {
      if (requestId === activeRequest.current) setIsLoading(false);
    }
  }, [periodType]);

  useEffect(() => {
    if (!initialLeaderboard) void load();
  }, [initialLeaderboard, load]);

  const loadMore = useCallback(async () => {
    if (!leaderboard || leaderboard.entries.length >= leaderboard.total || isLoadingMore) return;

    const requestId = activeRequest.current;
    setIsLoadingMore(true);
    try {
      const next = await getRosaryLeaderboard({
        offset: leaderboard.entries.length,
        periodType,
      });
      if (requestId !== activeRequest.current) return;
      setLeaderboard((current) => {
        if (!current) return next;
        const entries = [...current.entries, ...next.entries].filter(
          (entry, index, all) => all.findIndex((candidate) => candidate.friend.id === entry.friend.id) === index,
        );
        return { ...next, entries };
      });
    } catch (requestError) {
      logDevelopmentError("loading more Rosary leaderboard entries", requestError);
      if (requestId !== activeRequest.current) return;
      setError(messageFrom(requestError, i18n.t("friends.errors.loadMoreRankings")));
    } finally {
      if (requestId === activeRequest.current) setIsLoadingMore(false);
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
      setError(i18n.t("friends.errors.friendNotFound"));
      setIsLoading(false);
      return;
    }

    setError(undefined);
    setIsLoading(true);
    try {
      setFriend(await getFriendProfile(friendId));
    } catch (requestError) {
      logDevelopmentError("loading a friend profile", requestError);
      setError(messageFrom(requestError, i18n.t("friends.errors.friendProfile")));
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
      setError(i18n.t("friends.errors.searchValidation"));
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
          logDevelopmentError("searching for friends", requestError);
          if (!active) return;
          setResults([]);
          setError(messageFrom(requestError, i18n.t("friends.errors.search")));
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
      logDevelopmentError("sending a friend request", requestError);
      const message = messageFrom(requestError, i18n.t("friends.errors.sendRequest"));
      setError(message);
      throw new Error(message);
    } finally {
      setPendingUsername(undefined);
    }
  }, []);

  return { error, pendingUsername, requestedUsernames, send };
}

/** Loads a friend comparison for the selected weekly or yearly period. */
export function useFriendsComparison(friendId: string | undefined, initialPeriod: LeaderboardPeriodType = "weekly") {
  const activeRequest = useRef(0);
  const [comparison, setComparison] = useState<FriendsComparison>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [periodType, setPeriodType] = useState<LeaderboardPeriodType>(initialPeriod);

  const load = useCallback(async () => {
    const requestId = ++activeRequest.current;
    setError(undefined);
    setIsLoading(true);
    try {
      const nextComparison = await getFriendsComparison({ periodType });
      if (requestId !== activeRequest.current) return;
      if (nextComparison.period.periodType !== periodType) {
        setPeriodType(nextComparison.period.periodType);
        return;
      }
      setComparison(nextComparison);
    } catch (requestError) {
      logDevelopmentError("loading a friend comparison", requestError);
      if (requestId !== activeRequest.current) return;
      setError(messageFrom(requestError, i18n.t("friends.errors.compare")));
    } finally {
      if (requestId === activeRequest.current) setIsLoading(false);
    }
  }, [periodType]);

  useEffect(() => {
    if (!friendId) {
      setError(i18n.t("friends.errors.friendNotFound"));
      setIsLoading(false);
      return;
    }
    void load();
  }, [friendId, load]);

  const entries = useMemo(() => comparison?.entries ?? [], [comparison?.entries]);
  const currentUser = useMemo(() => entries.find((entry) => entry.isCurrentUser), [entries]);
  const friend = useMemo(() => entries.find((entry) => entry.profile.id === friendId), [entries, friendId]);

  return { comparison, currentUser, error, friend, isLoading, periodType, reload: load, setPeriodType };
}
