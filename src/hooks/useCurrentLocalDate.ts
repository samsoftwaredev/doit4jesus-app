import { useEffect, useState } from "react";

/** Formats a Date as an ISO calendar date using the device's local timezone. */
function formatLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns the delay to the next device-local midnight, recalculated for daylight-saving changes. */
function millisecondsUntilNextLocalMidnight(now: Date) {
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return Math.max(0, nextMidnight.getTime() - now.getTime());
}

/**
 * Provides the device-local calendar date and updates it at each local midnight.
 * The hook intentionally has no foreground or navigation-focus refresh behavior.
 */
export function useCurrentLocalDate() {
  const [currentLocalDate, setCurrentLocalDate] = useState(() => formatLocalIsoDate(new Date()));

  useEffect(() => {
    const now = new Date();
    const midnightTimer = setTimeout(() => {
      setCurrentLocalDate(formatLocalIsoDate(new Date()));
    }, millisecondsUntilNextLocalMidnight(now));

    return () => clearTimeout(midnightTimer);
  }, [currentLocalDate]);

  return currentLocalDate;
}
