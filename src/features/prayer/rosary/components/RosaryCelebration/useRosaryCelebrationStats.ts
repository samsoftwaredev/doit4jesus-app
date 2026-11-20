import { useCallback, useMemo, useRef, useState } from "react";

import { fetchRosaryStreak } from "@/features/prayer/rosary/garden/api";
import { fetchRosaryStats, fetchUserProgress } from "@/features/progress/progress.api";

import type { RosaryCelebrationStats } from "./types";

/**
 * Loads the numbers shown when a Rosary is completed. The personal best is captured *before* the completion is
 * recorded so the celebration can tell whether the new streak surpasses it.
 */
export function useRosaryCelebrationStats() {
  const previousLongestStreak = useRef<number | null>(null);
  const [stats, setStats] = useState<RosaryCelebrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** Remembers the best streak from before this completion; failures simply disable the record celebration. */
  const capturePrevious = useCallback(async () => {
    try {
      previousLongestStreak.current = (await fetchRosaryStreak()).longestStreak;
    } catch {
      previousLongestStreak.current = null;
    }
  }, []);

  /** Fetches streak, lifetime Rosary count, and level after the completion has been recorded. */
  const load = useCallback(async () => {
    setIsLoading(true);
    const [streak, rosaryStats, progress] = await Promise.allSettled([
      fetchRosaryStreak(),
      fetchRosaryStats(),
      fetchUserProgress(),
    ]);
    const currentStreak = streak.status === "fulfilled" ? streak.value.currentStreak : null;
    const previous = previousLongestStreak.current;
    setStats({
      currentStreak,
      isNewRecord: currentStreak !== null && previous !== null && currentStreak > previous,
      levelName: progress.status === "fulfilled" ? progress.value.currentLevel.name : null,
      levelNumber: progress.status === "fulfilled" ? progress.value.currentLevel.levelNumber : null,
      longestStreak: streak.status === "fulfilled" ? streak.value.longestStreak : null,
      rosariesPrayed: rosaryStats.status === "fulfilled" ? rosaryStats.value.rosariesPrayed : null,
    });
    setIsLoading(false);
  }, []);

  /** Clears everything so a repeated Rosary starts a fresh celebration. */
  const reset = useCallback(() => {
    previousLongestStreak.current = null;
    setStats(null);
    setIsLoading(false);
  }, []);

  return useMemo(
    () => ({ capturePrevious, isLoading, load, reset, stats }),
    [capturePrevious, isLoading, load, reset, stats],
  );
}
