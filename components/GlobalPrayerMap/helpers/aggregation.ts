import type {
  PrayerCity,
  PrayerCountry,
  PrayerMapSummary,
} from '@/interfaces/globalPrayerMap';

/**
 * Aggregate city-level data into country-level totals.
 */
export const aggregateByCountry = (cities: PrayerCity[]): PrayerCountry[] => {
  const map = new Map<string, PrayerCountry>();

  for (const c of cities) {
    const existing = map.get(c.countryCode);
    if (existing) {
      existing.prayerCount += c.prayerCount;
      existing.activeUsers += c.activeUsers;
    } else {
      map.set(c.countryCode, {
        countryCode: c.countryCode,
        countryName: c.countryName,
        prayerCount: c.prayerCount,
        activeUsers: c.activeUsers,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.prayerCount - a.prayerCount);
};

/**
 * Compute high-level summary stats from the city data.
 */
export const computeSummary = (
  cities: PrayerCity[],
  activeUsers: number,
): PrayerMapSummary => {
  const countries = aggregateByCountry(cities);

  const topCity = cities.reduce(
    (best, c) => (c.prayerCount > best.prayerCount ? c : best),
    cities[0],
  );

  const topCountry = countries[0];

  return {
    totalPrayers: cities.reduce((sum, c) => sum + c.prayerCount, 0),
    mostActiveCity: topCity?.city ?? '',
    mostActiveCountry: topCountry?.countryName ?? '',
    totalLiveSessions: activeUsers,
  };
};
