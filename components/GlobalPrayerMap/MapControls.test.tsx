import { fireEvent, render, screen } from '@testing-library/react';

import MapControls from './MapControls';

const T = { prayerMapCityView: 'City', prayerMapCountryView: 'Country' };

describe('MapControls', () => {
  it('renders City and Country toggle buttons', () => {
    render(<MapControls view="city" onChange={jest.fn()} translations={T} />);
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('calls onChange when a toggle is clicked', () => {
    const onChange = jest.fn();
    render(<MapControls view="city" onChange={onChange} translations={T} />);
    fireEvent.click(screen.getByText('Country'));
    expect(onChange).toHaveBeenCalledWith('country');
  });

  it('reflects the active view', () => {
    const { rerender } = render(
      <MapControls view="city" onChange={jest.fn()} translations={T} />,
    );
    expect(screen.getByText('City').closest('button')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    rerender(
      <MapControls view="country" onChange={jest.fn()} translations={T} />,
    );
    expect(screen.getByText('Country').closest('button')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
