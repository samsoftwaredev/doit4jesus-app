import type { FlowerVariant, RosaryGardenDay, RosaryGardenMonth } from "@/types/rosaryGarden";

const flowerVariants: FlowerVariant[] = ["redRose", "pinkRose", "whiteLily", "blueFlower", "mixedFlowers"];

export function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isValidIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime());
}

export function datePartsFromIso(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return { day, month, year };
}

export function isMonthBefore(year: number, month: number, comparedYear: number, comparedMonth: number) {
  return year < comparedYear || (year === comparedYear && month < comparedMonth);
}

export function isMonthAfter(year: number, month: number, comparedYear: number, comparedMonth: number) {
  return year > comparedYear || (year === comparedYear && month > comparedMonth);
}

export function getFlowerVariant(date: string): FlowerVariant {
  const hash = [...date].reduce((total, character) => total + character.charCodeAt(0), 0);
  return flowerVariants[hash % flowerVariants.length];
}

export function buildRosaryGardenMonth({
  completionDates,
  month,
  today,
  userCreatedAt,
  year,
}: {
  completionDates: ReadonlySet<string>;
  month: number;
  today: string;
  userCreatedAt: string;
  year: number;
}): RosaryGardenMonth {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const createdDate = isValidIsoDate(userCreatedAt) ? userCreatedAt.slice(0, 10) : toIsoDate(year, 1, 1);
  return {
    days: Array.from({ length: daysInMonth }, (_, index): RosaryGardenDay => {
      const day = index + 1;
      const date = toIsoDate(year, month, day);
      const isFuture = date > today;
      const isEligible = date >= createdDate && !isFuture;
      const completed = isEligible && completionDates.has(date);
      return { completed, date, day, flowerVariant: completed ? getFlowerVariant(date) : undefined, isEligible, isFuture, isToday: date === today };
    }),
    month,
    year,
  };
}

export function calculateStreaks(completedDates: ReadonlySet<string>, today: string) {
  const validDates = [...completedDates].filter((date) => isValidIsoDate(date) && date <= today).sort();
  const dateSet = new Set(validDates);
  const decrement = (date: string) => {
    const parts = datePartsFromIso(date);
    const previous = new Date(Date.UTC(parts.year, parts.month - 1, parts.day - 1));
    return toIsoDate(previous.getUTCFullYear(), previous.getUTCMonth() + 1, previous.getUTCDate());
  };
  let currentStreak = 0;
  let cursor = dateSet.has(today) ? today : decrement(today);
  while (dateSet.has(cursor)) {
    currentStreak += 1;
    cursor = decrement(cursor);
  }
  let longestStreak = 0;
  let run = 0;
  let previousDate: string | undefined;
  validDates.forEach((date) => {
    run = previousDate === decrement(date) ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    previousDate = date;
  });
  return { currentStreak, longestStreak };
}
