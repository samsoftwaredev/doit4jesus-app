import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchRosaryCompletion, fetchRosaryStreak } from "@/features/prayer/rosary/garden/api";
import { createRosaryGardenMockData, getLocalDateParts } from "@/features/prayer/rosary/garden/mockData";
import {
  buildRosaryGardenMonth,
  calculateStreaks,
  datePartsFromIso,
  isMonthAfter,
  isMonthBefore,
  isValidIsoDate,
  toIsoDate,
} from "@/features/prayer/rosary/garden/utils";
import { fetchCurrentUserProfile } from "@/features/profile/profile.api";
import { logDevelopmentError } from "@/lib/development-logger";
import type { RosaryGardenStats, UseRosaryGardenOptions } from "@/features/prayer/rosary/garden/types";

function addMonth(year: number, month: number, amount: number) {
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return { month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
}

/** Loads and exposes Rosary Garden data for the currently displayed month. */
export function useRosaryGarden(options: UseRosaryGardenOptions = {}) {
  const fallbackTimezone = options.userTimezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const providedCompletionDates = options.rosaryCompletionDates?.filter(isValidIsoDate).join(",");
  const now = getLocalDateParts(fallbackTimezone);
  const [selected, setSelected] = useState({
    month:
      options.selectedMonth && options.selectedMonth >= 1 && options.selectedMonth <= 12
        ? options.selectedMonth
        : now.month,
    year: options.selectedYear ?? now.year,
  });
  const [timezone, setTimezone] = useState(fallbackTimezone);
  const [userCreatedAt, setUserCreatedAt] = useState(options.userCreatedAt ?? toIsoDate(now.year, 1, 1));
  const [completionDates, setCompletionDates] = useState<Set<string>>(
    () => new Set(providedCompletionDates?.split(",") ?? []),
  );
  const [remoteStreaks, setRemoteStreaks] = useState<{ currentStreak: number; longestStreak: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [hasNavigationError, setHasNavigationError] = useState(false);
  const [failedMonth, setFailedMonth] = useState<{ month: number; year: number } | null>(null);
  const lastLoadedMonth = useRef<string | null>(null);
  const monthRequestId = useRef(0);

  const localToday = toIsoDate(
    getLocalDateParts(timezone).year,
    getLocalDateParts(timezone).month,
    getLocalDateParts(timezone).day,
  );
  const createdParts = isValidIsoDate(userCreatedAt) ? datePartsFromIso(userCreatedAt) : { month: 1, year: now.year };
  const canGoPrevious = isMonthAfter(selected.year, selected.month, createdParts.year, createdParts.month);
  const canGoNext = isMonthBefore(
    selected.year,
    selected.month,
    datePartsFromIso(localToday).year,
    datePartsFromIso(localToday).month,
  );

  useEffect(() => {
    let active = true;
    const monthKey = `${selected.year}-${selected.month}`;
    if (lastLoadedMonth.current === monthKey) {
      return () => {
        active = false;
      };
    }
    setIsLoading(true);

    if (providedCompletionDates !== undefined) {
      setCompletionDates(new Set(providedCompletionDates ? providedCompletionDates.split(",") : []));
      setRemoteStreaks(null);
      setIsUsingMockData(false);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    if (
      options.initialCompletion &&
      options.initialStreak &&
      options.initialUser &&
      options.initialCompletion.year === selected.year &&
      options.initialCompletion.selectedMonth === selected.month
    ) {
      setTimezone(options.initialUser.timezone || timezone);
      setUserCreatedAt(options.initialUser.createdAt);
      setCompletionDates(
        new Set(options.initialCompletion.days.filter((day) => day.completed === true).map((day) => day.date)),
      );
      setRemoteStreaks({
        currentStreak: options.initialStreak.currentStreak,
        longestStreak: options.initialStreak.longestStreak,
      });
      setIsUsingMockData(false);
      lastLoadedMonth.current = monthKey;
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    async function loadGarden() {
      try {
        const hasInitialMetadata = Boolean(options.initialStreak && options.initialUser);
        const [profile, completion, streak] = hasInitialMetadata
          ? [null, await fetchRosaryCompletion(selected.year, selected.month), null]
          : await Promise.all([
              fetchCurrentUserProfile(),
              fetchRosaryCompletion(selected.year, selected.month),
              fetchRosaryStreak(),
            ]);
        if (!active) return;
        if (profile && streak) {
          setTimezone(profile.timezone || streak.timezone || timezone);
          setUserCreatedAt(profile.createdAt);
          setRemoteStreaks({ currentStreak: streak.currentStreak, longestStreak: streak.longestStreak });
        }
        setCompletionDates(new Set(completion.days.filter((day) => day.completed === true).map((day) => day.date)));
        lastLoadedMonth.current = monthKey;
        setIsUsingMockData(false);
      } catch (error) {
        logDevelopmentError("loading Rosary Garden data", error);
        if (!active) return;
        const mock = createRosaryGardenMockData(selected.year, selected.month, timezone);
        setCompletionDates(
          new Set(mock.completion.days.filter((day) => day.completed === true).map((day) => day.date)),
        );
        setRemoteStreaks({ currentStreak: mock.streak.currentStreak, longestStreak: mock.streak.longestStreak });
        setUserCreatedAt(options.userCreatedAt ?? mock.userCreatedAt);
        setIsUsingMockData(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadGarden();
    return () => {
      active = false;
    };
  }, [
    options.initialCompletion,
    options.initialStreak,
    options.initialUser,
    options.userCreatedAt,
    providedCompletionDates,
    selected.month,
    selected.year,
    timezone,
  ]);

  const month = useMemo(
    () =>
      buildRosaryGardenMonth({
        completionDates,
        month: selected.month,
        today: localToday,
        userCreatedAt,
        year: selected.year,
      }),
    [completionDates, localToday, selected.month, selected.year, userCreatedAt],
  );

  const stats = useMemo<RosaryGardenStats>(() => {
    const completedDays = month.days.filter((day) => day.completed).length;
    const eligibleDays = month.days.filter((day) => day.isEligible).length;
    const localStreaks = calculateStreaks(completionDates, localToday);
    return {
      completedDays,
      completionPercentage: eligibleDays ? Math.round((completedDays / eligibleDays) * 100) : 0,
      currentStreak: remoteStreaks?.currentStreak ?? localStreaks.currentStreak,
      eligibleDays,
      longestStreak: remoteStreaks?.longestStreak ?? localStreaks.longestStreak,
    };
  }, [completionDates, localToday, month.days, remoteStreaks]);

  /** Loads a target month without replacing the visible garden until the response is verified. */
  const loadNavigatedMonth = useCallback(async (target: { month: number; year: number }) => {
    const requestId = ++monthRequestId.current;
    setIsLoading(true);
    setHasNavigationError(false);
    try {
      const completion = await fetchRosaryCompletion(target.year, target.month);
      if (requestId !== monthRequestId.current) return;
      setCompletionDates(new Set(completion.days.filter((day) => day.completed === true).map((day) => day.date)));
      lastLoadedMonth.current = `${target.year}-${target.month}`;
      setSelected(target);
      setFailedMonth(null);
      setIsUsingMockData(false);
    } catch (error) {
      logDevelopmentError("loading a Rosary Garden month", error);
      if (requestId !== monthRequestId.current) return;
      setFailedMonth(target);
      setHasNavigationError(true);
    } finally {
      if (requestId === monthRequestId.current) setIsLoading(false);
    }
  }, []);

  /** Moves to the prior eligible month after its completion history has loaded. */
  const goToPreviousMonth = useCallback(() => {
    if (!canGoPrevious) return;
    void loadNavigatedMonth(addMonth(selected.year, selected.month, -1));
  }, [canGoPrevious, loadNavigatedMonth, selected.month, selected.year]);

  /** Moves to the next eligible month after its completion history has loaded. */
  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;
    void loadNavigatedMonth(addMonth(selected.year, selected.month, 1));
  }, [canGoNext, loadNavigatedMonth, selected.month, selected.year]);

  /** Retries the most recently failed month navigation while retaining the visible garden. */
  const retryMonthLoad = useCallback(() => {
    if (!failedMonth) return;
    void loadNavigatedMonth(failedMonth);
  }, [failedMonth, loadNavigatedMonth]);

  /** Marks the user's local current day as completed in the visible garden. */
  const markTodayCompleted = useCallback(() => {
    setCompletionDates((current) => new Set([...current, localToday]));
    setRemoteStreaks(null);
  }, [localToday]);

  return {
    canGoNext,
    canGoPrevious,
    days: month.days,
    goToNextMonth,
    goToPreviousMonth,
    hasNavigationError,
    isLoading,
    isUsingMockData,
    markTodayCompleted,
    retryMonthLoad,
    selectedMonth: month,
    selectedMonthNumber: selected.month,
    selectedYear: selected.year,
    stats,
    userTimezone: timezone,
  };
}
