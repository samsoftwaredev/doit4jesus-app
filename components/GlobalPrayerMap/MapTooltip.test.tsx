import { render, screen } from '@testing-library/react';

import type { MapTooltipData } from '@/interfaces/globalPrayerMap';

import MapTooltip from './MapTooltip';

const RECT = { top: 0, left: 0, width: 960, height: 500 } as DOMRect;

const DATA: MapTooltipData = {
  x: 100,
  y: 200,
  name: 'Rome',
  countryName: 'Italy',
  prayerCount: 5600,
  activeUsers: 42,
  liveSessions: 3,
};

describe('MapTooltip', () => {
  it('renders nothing when data is null', () => {
    const { container } = render(
      <MapTooltip data={null} containerRect={RECT} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when containerRect is null', () => {
    const { container } = render(
      <MapTooltip data={DATA} containerRect={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders tooltip content when both data and rect are provided', () => {
    render(<MapTooltip data={DATA} containerRect={RECT} />);
    expect(screen.getByText('Rome')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('5,600')).toBeInTheDocument();
  });

  it('shows live sessions when present', () => {
    render(<MapTooltip data={DATA} containerRect={RECT} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
