import { fireEvent, render, screen } from '@testing-library/react';

import type { SelectedLocationDetail } from '@/interfaces/globalPrayerMap';

import LocationDetailPanel from './LocationDetailPanel';

const T = {
  prayerMapSelectLocation: 'Click a marker to view details',
  prayerMapTotalPrayers: 'Total Prayers',
  prayerMapActiveUsers: 'Active Users',
  prayerMapLiveSessions: 'live sessions',
  joinSession: 'Join Session',
};

const LOCATION: SelectedLocationDetail = {
  id: 'rome',
  name: 'Rome',
  countryName: 'Italy',
  prayerCount: 5600,
  activeUsers: 42,
  liveSessions: 3,
};

describe('LocationDetailPanel', () => {
  it('shows empty state when no location is selected', () => {
    render(<LocationDetailPanel location={null} translations={T} />);
    expect(
      screen.getByText('Click a marker to view details'),
    ).toBeInTheDocument();
  });

  it('renders location name and country', () => {
    render(<LocationDetailPanel location={LOCATION} translations={T} />);
    expect(screen.getByText('Rome')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
  });

  it('shows prayer count and active users', () => {
    render(<LocationDetailPanel location={LOCATION} translations={T} />);
    expect(screen.getByText('5,600')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows live sessions badge', () => {
    render(<LocationDetailPanel location={LOCATION} translations={T} />);
    expect(screen.getByText('3 live sessions')).toBeInTheDocument();
  });

  it('renders Join Session button when onJoinSession provided and liveSessions > 0', () => {
    const onJoin = jest.fn();
    render(
      <LocationDetailPanel
        location={LOCATION}
        translations={T}
        onJoinSession={onJoin}
      />,
    );
    const btn = screen.getByText('Join Session');
    fireEvent.click(btn);
    expect(onJoin).toHaveBeenCalledTimes(1);
  });

  it('hides Join Session button when liveSessions is 0', () => {
    render(
      <LocationDetailPanel
        location={{ ...LOCATION, liveSessions: 0 }}
        translations={T}
        onJoinSession={jest.fn()}
      />,
    );
    expect(screen.queryByText('Join Session')).not.toBeInTheDocument();
  });
});
