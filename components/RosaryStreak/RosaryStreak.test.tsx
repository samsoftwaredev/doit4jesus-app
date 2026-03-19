import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import RosaryStreak from './RosaryStreak';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/classes/index', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockResolvedValue({ data: { streak: 5 }, error: null }),
    },
  },
}));

jest.mock('../Loading', () => ({
  __esModule: true,
  default: ({ isFeature }: any) => <div data-testid="loading">Loading</div>,
}));

describe('RosaryStreak Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({
      t: {
        yourRosaryStreak: 'Your Rosary Streak',
        canYouPrayDaily: 'Can you pray one rosary daily?',
        daysInARow: 'days in a row',
        keepStreakGoing: 'Keep your streak going!',
      },
    });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
  });

  it('renders the streak title', () => {
    render(<RosaryStreak />);
    expect(screen.getByText('Your Rosary Streak')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<RosaryStreak />);
    expect(
      screen.getByText('Can you pray one rosary daily?'),
    ).toBeInTheDocument();
  });
});
