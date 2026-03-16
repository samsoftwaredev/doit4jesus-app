import { render, screen } from '@testing-library/react';

import CountdownDate from './CountdownDate';

jest.mock('moment', () => {
  const moment = (date?: any) => {
    const d = date ? new Date(date) : new Date();
    return {
      diff: (other: any) => d.getTime() - new Date().getTime(),
      fromNow: () => '5 minutes ago',
      add: (n: number, unit: string) => moment(new Date(d.getTime() + 3600000)),
    };
  };
  moment.duration = (ms: number) => ({
    years: () => 0,
    months: () => 0,
    days: () => 1,
    hours: () => 2,
    minutes: () => 30,
    seconds: () => 0,
  });
  (moment as any).__esModule = true;
  (moment as any).default = moment;
  return moment;
});

describe('CountdownDate Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders countdown when event is in the future', () => {
    const futureDate = new Date(Date.now() + 86400000);
    render(<CountdownDate targetTime={futureDate} />);
    expect(screen.getByText(/Starts in/)).toBeInTheDocument();
  });
});
