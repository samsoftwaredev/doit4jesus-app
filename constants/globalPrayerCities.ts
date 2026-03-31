/**
 * City data is backend-driven via /api/prayer-cities.
 * This file exports only the shared type used by services/prayerCityApi.ts
 * and a deprecated empty constant kept for backwards-compatible imports.
 */

export interface GlobalPrayerCityOption {
  city: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
}

/**
 * @deprecated Use getPrayerCityOptions() from services/prayerCityApi.ts.
 * Kept here so existing imports compile; the array is always empty at runtime.
 */
export const GLOBAL_PRAYER_CITY_OPTIONS: GlobalPrayerCityOption[] = [];
