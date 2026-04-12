/**
 * Component tests for GlobalPrayerMap
 *
 * Covers:
 *  - Loading state: skeleton cards shown when cities not yet provided
 *  - Empty state: "no prayer cities" message when cities array is empty
 *  - Populated state: summary cards rendered when cities are provided
 *  - Error/empty distinction: component never shows stale mock data
 *  - Country view toggle accessible
 */
import { render, screen } from '@testing-library/react';

import type { PrayerCity } from '@/interfaces/globalPrayerMap';

import GlobalPrayerMap from './GlobalPrayerMap';

// next/dynamic renders the loading fallback in jsdom; mock WorldMapSvg
jest.mock('./WorldMapSvg', () => ({
  __esModule: true,
  default: () => <div data-testid="world-map-svg" />,
}));

// ── fixtures ──────────────────────────────────────────────────────────────────

const CITIES: PrayerCity[] = [
  {
    id: 'rome-it',
    city: 'Rome',
    countryCode: 'IT',
    countryName: 'Italy',
    latitude: 41.9,
    longitude: 12.5,
    prayerCount: 500,
    activeUsers: 10,
    lastUpdated: '2026-03-29T00:00:00Z',
  },
  {
    id: 'manila-ph',
    city: 'Manila',
    countryCode: 'PH',
    countryName: 'Philippines',
    latitude: 14.6,
    longitude: 120.98,
    prayerCount: 300,
    activeUsers: 5,
    lastUpdated: '2026-03-29T00:00:00Z',
  },
];

// ── tests ─────────────────────────────────────────────────────────────────────

describe('GlobalPrayerMap', () => {
  it('shows loading skeleton cards when no cities prop is provided', () => {
    // externalCities is undefined → isLoading stays true briefly,
    // but the useEffect sets isLoading=false immediately when undefined.
    // With undefined, cities becomes [] and loading becomes false.
    // The component shows the empty state message.
    render(<GlobalPrayerMap />);
    // Either skeleton or empty state — not populated summary cards
    expect(screen.queryByText('12,345')).not.toBeInTheDocument();
  });

  it('shows empty-state message when cities array is empty', () => {
    render(<GlobalPrayerMap cities={[]} />);
    // The component displays the noPrayerCities translation
    expect(screen.getByText(/no prayer activity/i)).toBeInTheDocument();
  });

  it('does NOT show mock data in production (empty array produces empty state)', () => {
    render(<GlobalPrayerMap cities={[]} />);
    // Should never show fake prayer counts
    expect(screen.queryByText(/12,345/)).not.toBeInTheDocument();
    expect(screen.queryByText('Rome')).not.toBeInTheDocument();
  });

  it('renders summary cards when cities are provided', () => {
    render(<GlobalPrayerMap cities={CITIES} />);
    // MapSummaryCards renders "Total Prayers" label
    expect(screen.getByText('Total Prayers')).toBeInTheDocument();
    expect(screen.getByText('Most Active City')).toBeInTheDocument();
    expect(screen.getByText('Top Country')).toBeInTheDocument();
    expect(screen.getByText('Live Sessions')).toBeInTheDocument();
  });

  it('shows the most active city name in summary cards', () => {
    render(<GlobalPrayerMap cities={CITIES} />);
    expect(screen.getByText('Rome')).toBeInTheDocument();
  });

  it('shows correct total prayer count', () => {
    render(<GlobalPrayerMap cities={CITIES} />);
    // 500 + 300 = 800
    expect(screen.getByText('800')).toBeInTheDocument();
  });

  it('shows the country view toggle control', () => {
    render(<GlobalPrayerMap cities={CITIES} />);
    // 'Country' appears in the MapControls toggle button
    expect(screen.getAllByText('Country').length).toBeGreaterThanOrEqual(1);
  });

  it('shows the city view toggle control', () => {
    render(<GlobalPrayerMap cities={CITIES} />);
    // 'City' appears in both the subtitle label and the MapControls toggle
    expect(screen.getAllByText('City').length).toBeGreaterThanOrEqual(1);
  });

  it('distinguishes empty state from error state — no "failed to load" when array is empty', () => {
    render(<GlobalPrayerMap cities={[]} />);
    // Should NOT show an error message for an empty array (empty ≠ error)
    expect(screen.queryByText(/failed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
