import type { PrayerCity } from '@/interfaces/globalPrayerMap';

import { aggregateByCountry, computeSummary } from './aggregation';

const CITIES: PrayerCity[] = [
  {
    id: '1',
    city: 'Rome',
    countryCode: 'IT',
    countryName: 'Italy',
    latitude: 41.9,
    longitude: 12.49,
    prayerCount: 5000,
    activeUsers: 40,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    city: 'Milan',
    countryCode: 'IT',
    countryName: 'Italy',
    latitude: 45.46,
    longitude: 9.19,
    prayerCount: 2000,
    activeUsers: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    city: 'Manila',
    countryCode: 'PH',
    countryName: 'Philippines',
    latitude: 14.6,
    longitude: 120.98,
    prayerCount: 4500,
    activeUsers: 55,
    lastUpdated: new Date().toISOString(),
  },
];

describe('aggregateByCountry', () => {
  it('groups cities by countryCode and sums stats', () => {
    const countries = aggregateByCountry(CITIES);
    expect(countries).toHaveLength(2);

    const italy = countries.find((c) => c.countryCode === 'IT');
    expect(italy).toBeDefined();
    expect(italy!.prayerCount).toBe(7000);
    expect(italy!.activeUsers).toBe(50);
  });

  it('sorts countries by prayerCount descending', () => {
    const countries = aggregateByCountry(CITIES);
    expect(countries[0].countryCode).toBe('IT');
    expect(countries[1].countryCode).toBe('PH');
  });

  it('returns empty array for empty input', () => {
    expect(aggregateByCountry([])).toEqual([]);
  });
});

describe('computeSummary', () => {
  it('computes total prayers', () => {
    const summary = computeSummary(CITIES, 95);
    expect(summary.totalPrayers).toBe(11500);
  });

  it('identifies most active city', () => {
    const summary = computeSummary(CITIES, 95);
    expect(summary.mostActiveCity).toBe('Rome');
  });

  it('identifies most active country', () => {
    const summary = computeSummary(CITIES, 95);
    expect(summary.mostActiveCountry).toBe('Italy');
  });

  it('uses activeUsers param for totalLiveSessions', () => {
    const summary = computeSummary(CITIES, 95);
    expect(summary.totalLiveSessions).toBe(95);
  });

  it('handles empty array gracefully', () => {
    const summary = computeSummary([], 95);
    expect(summary.totalPrayers).toBe(0);
    expect(summary.mostActiveCity).toBe('');
    expect(summary.mostActiveCountry).toBe('');
    expect(summary.totalLiveSessions).toBe(95);
  });
});
