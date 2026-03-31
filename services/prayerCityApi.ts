import type { GlobalPrayerCityOption } from '@/constants/globalPrayerCities';
import { apiFetch } from '@/lib/api/client';

// /api/prayer-cities returns snake_case DB columns
interface PrayerCityRow {
  city: string;
  country_code: string;
  country_name: string;
  latitude: number | string;
  longitude: number | string;
}

/**
 * Fetch the canonical list of prayer cities from the backend.
 */
export const getPrayerCityOptions = async (): Promise<
  GlobalPrayerCityOption[]
> => {
  try {
    const { data } = await apiFetch<{ data: PrayerCityRow[] }>(
      '/api/prayer-cities',
    );
    return (data ?? []).map((row) => ({
      city: row.city,
      countryCode: row.country_code,
      countryName: row.country_name,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
    }));
  } catch (err) {
    console.error('getPrayerCityOptions error:', err);
    return [];
  }
};
