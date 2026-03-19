import { render, screen } from '@testing-library/react';

import type { PrayerMapSummary } from '@/interfaces/globalPrayerMap';

import MapSummaryCards from './MapSummaryCards';

const T = {
  prayerMapTotalPrayers: 'Total Prayers',
  prayerMapMostActiveCity: 'Most Active City',
  prayerMapMostActiveCountry: 'Top Country',
  prayerMapLiveSessions: 'Live Sessions',
};

const SUMMARY: PrayerMapSummary = {
  totalPrayers: 12345,
  mostActiveCity: 'Rome',
  mostActiveCountry: 'Italy',
  totalLiveSessions: 7,
};

describe('MapSummaryCards', () => {
  it('renders all four stat labels', () => {
    render(<MapSummaryCards summary={SUMMARY} translations={T} />);
    expect(screen.getByText('Total Prayers')).toBeInTheDocument();
    expect(screen.getByText('Most Active City')).toBeInTheDocument();
    expect(screen.getByText('Top Country')).toBeInTheDocument();
    expect(screen.getByText('Live Sessions')).toBeInTheDocument();
  });

  it('shows the total prayer count formatted with commas', () => {
    render(<MapSummaryCards summary={SUMMARY} translations={T} />);
    expect(screen.getByText('12,345')).toBeInTheDocument();
  });

  it('shows the most active city name', () => {
    render(<MapSummaryCards summary={SUMMARY} translations={T} />);
    expect(screen.getByText('Rome')).toBeInTheDocument();
  });

  it('shows the most active country name', () => {
    render(<MapSummaryCards summary={SUMMARY} translations={T} />);
    expect(screen.getByText('Italy')).toBeInTheDocument();
  });

  it('shows the live sessions count', () => {
    render(<MapSummaryCards summary={SUMMARY} translations={T} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
