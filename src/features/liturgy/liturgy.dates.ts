function formatIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getLocalIsoDate(now = new Date()) {
  return formatIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function addDaysToIsoDate(date: string, amount: number) {
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + amount));

  return formatIsoDate(nextDate.getUTCFullYear(), nextDate.getUTCMonth() + 1, nextDate.getUTCDate());
}

export function canNavigateToNextLiturgyDate(selectedDate: string, today = getLocalIsoDate()) {
  return selectedDate < addDaysToIsoDate(today, 1);
}
