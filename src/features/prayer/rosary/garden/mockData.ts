import type { RosaryCompletionApiResponse, RosaryStreakApiResponse } from "@/features/prayer/rosary/garden/types";

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getLocalDateParts(timezone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric",
  }).formatToParts(new Date());
  const valueFor = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "01";

  return {
    day: Number(valueFor("day")),
    month: Number(valueFor("month")),
    year: Number(valueFor("year")),
  };
}

/** A local-only fallback used when the authenticated garden endpoints are unavailable. */
export function createRosaryGardenMockData(
  year: number,
  month: number,
  timezone?: string,
): { completion: RosaryCompletionApiResponse; streak: RosaryStreakApiResponse; userCreatedAt: string } {
  const today = getLocalDateParts(timezone);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const isCurrentMonth = year === today.year && month === today.month;
  const latestCompletedDay = isCurrentMonth
    ? Math.max(0, today.day - 1)
    : year < today.year || month < today.month
      ? daysInMonth
      : 0;
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const isFuture = year > today.year || (year === today.year && month === today.month && day > today.day);
    const completed = !isFuture && day <= latestCompletedDay && day >= Math.max(1, latestCompletedDay - 5);
    return { completed: isFuture ? null : completed, date: toIsoDate(year, month, day), day };
  });
  const completedDays = days.filter((entry) => entry.completed).length;
  const eligibleDays = days.filter((entry) => entry.completed !== null).length;

  return {
    completion: {
      completedDays,
      days,
      eligibleDays,
      selectedMonth: month,
      year,
      yearToDatePercentage: eligibleDays ? Number(((completedDays / eligibleDays) * 100).toFixed(2)) : 0,
    },
    streak: {
      asOfDate: toIsoDate(today.year, today.month, today.day),
      currentStreak: Math.min(6, completedDays),
      longestStreak: Math.min(6, completedDays),
      timezone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    userCreatedAt: toIsoDate(year, 1, 1),
  };
}
