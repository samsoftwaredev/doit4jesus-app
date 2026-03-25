import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import Leaderboards from './Leaderboards';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/classes', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockResolvedValue({
        data: { data: { data: [] } },
        error: null,
      }),
    },
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('@/context/LevelsContext', () => ({
  useLevelsContext: () => ({
    getCurrentLevel: jest.fn().mockReturnValue({ levelNum: 0 }),
    levels: [],
  }),
}));

jest.mock('../Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading</div>,
}));

jest.mock('../RosaryLevel', () => ({
  __esModule: true,
  default: () => <div data-testid="rosary-level" />,
}));

const mockTranslations = {
  top10warriors: 'Top 10 Warriors',
  leaderboard: 'Leaderboard',
  rosaries: 'rosaries',
  rosary: 'rosary',
};

describe('Leaderboards Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
  });

  it('renders the leaderboards title', async () => {
    render(<Leaderboards />);
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });
});
