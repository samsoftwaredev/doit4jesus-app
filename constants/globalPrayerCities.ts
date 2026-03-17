export interface GlobalPrayerCityOption {
  city: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
}

export const GLOBAL_PRAYER_CITY_OPTIONS: GlobalPrayerCityOption[] = [
  {
    city: 'Dallas',
    countryCode: 'US',
    countryName: 'United States',
    latitude: 32.7767,
    longitude: -96.797,
  },
  {
    city: 'Sao Paulo',
    countryCode: 'BR',
    countryName: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    city: 'Manila',
    countryCode: 'PH',
    countryName: 'Philippines',
    latitude: 14.5995,
    longitude: 120.9842,
  },
  {
    city: 'Mexico City',
    countryCode: 'MX',
    countryName: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
  },
  {
    city: 'Lagos',
    countryCode: 'NG',
    countryName: 'Nigeria',
    latitude: 6.5244,
    longitude: 3.3792,
  },
  {
    city: 'Madrid',
    countryCode: 'ES',
    countryName: 'Spain',
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    city: 'Rome',
    countryCode: 'IT',
    countryName: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    city: 'Nairobi',
    countryCode: 'KE',
    countryName: 'Kenya',
    latitude: -1.2921,
    longitude: 36.8219,
  },
  {
    city: 'Mumbai',
    countryCode: 'IN',
    countryName: 'India',
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    city: 'Sydney',
    countryCode: 'AU',
    countryName: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
  },
  {
    city: 'Seoul',
    countryCode: 'KR',
    countryName: 'South Korea',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    city: 'London',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
  },
];
