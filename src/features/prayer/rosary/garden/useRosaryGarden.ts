import { useCallback, useEffect, useMemo, useState } from "react";

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
import type { RosaryGardenStats, UseRosaryGardenOptions } from "@/features/prayer/rosary/garden/types";

function addMonth(year: number, month: number, amount: number) {
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return { month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
}

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

    if (options.initialCompletion && options.initialStreak && options.initialUser) {
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
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    async function loadGarden() {
      try {
        const [profile, completion, streak] = await Promise.all([
          fetchCurrentUserProfile(),
          fetchRosaryCompletion(selected.year, selected.month),
          fetchRosaryStreak(),
        ]);
        if (!active) return;
        setTimezone(profile.timezone || streak.timezone || timezone);
        setUserCreatedAt(profile.createdAt);
        setCompletionDates(new Set(completion.days.filter((day) => day.completed === true).map((day) => day.date)));
        setRemoteStreaks({ currentStreak: streak.currentStreak, longestStreak: streak.longestStreak });
        setIsUsingMockData(false);
      } catch {
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

  const goToPreviousMonth = useCallback(() => {
    if (!canGoPrevious) return;
    setSelected((current) => addMonth(current.year, current.month, -1));
  }, [canGoPrevious]);
  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;
    setSelected((current) => addMonth(current.year, current.month, 1));
  }, [canGoNext]);
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
    isLoading,
    isUsingMockData,
    markTodayCompleted,
    selectedMonth: month,
    selectedMonthNumber: selected.month,
    selectedYear: selected.year,
    stats,
    userTimezone: timezone,
  };
}
