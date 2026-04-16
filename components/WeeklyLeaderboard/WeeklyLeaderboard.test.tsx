import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import LeaderboardList from './LeaderboardList';
import LeaderboardPodium from './LeaderboardPodium';
import ResetCountdown from './ResetCountdown';
import WeeklyLeaderboard from './WeeklyLeaderboard';
import YourPositionCard from './YourPositionCard';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: () => ({ mode: 'dark', toggleTheme: jest.fn() }),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(() => ({
    user: { userId: 'user-1', fullName: 'Test User' },
  })),
}));

const mockLeaderboardData = {
  entries: [
    {
      userId: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      pictureUrl: null,
      totalXp: 3000,
      rosariesCount: 20,
      streakDays: 7,
      invitesCount: 2,
      rank: 1,
      isCurrentUser: false,
    },
    {
      userId: 'u2',
      firstName: 'Jane',
      lastName: 'Smith',
      pictureUrl: null,
      totalXp: 2500,
      rosariesCount: 18,
      streakDays: 5,
      invitesCount: 1,
      rank: 2,
      isCurrentUser: false,
    },
    {
      userId: 'u3',
      firstName: 'Maria',
      lastName: 'Garcia',
      pictureUrl: null,
      totalXp: 2000,
      rosariesCount: 15,
      streakDays: 4,
      invitesCount: 0,
      rank: 3,
      isCurrentUser: false,
    },
    {
      userId: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      pictureUrl: null,
      totalXp: 1500,
      rosariesCount: 10,
      streakDays: 3,
      invitesCount: 0,
      rank: 4,
      isCurrentUser: true,
    },
    {
      userId: 'u5',
      firstName: 'Paul',
      lastName: 'Adams',
      pictureUrl: null,
      totalXp: 1000,
      rosariesCount: 8,
      streakDays: 2,
      invitesCount: 0,
      rank: 5,
      isCurrentUser: false,
    },
  ],
  weekStart: '2025-03-17',
  weekEnd: '2025-03-23',
  totalParticipants: 5,
};

const mockMyPosition = {
  currentRank: 4,
  totalXp: 1500,
  xpToNextRank: 500,
  nextRankUser: 'Maria Garcia',
  neighbors: mockLeaderboardData.entries,
};

jest.mock('@/services/weeklyLeaderboard', () => ({
  getWeeklyLeaderboard: jest.fn(),
  getMyLeaderboardPosition: jest.fn(),
  getLeaderboardHistory: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/constants/leaderboardConfig', () => ({
  getMillisUntilReset: jest.fn(() => 3 * 86_400_000 + 5 * 3_600_000), // 3d 5h
  getCurrentWeekRange: jest.fn(() => ({
    weekStart: '2025-03-17',
    weekEnd: '2025-03-23',
  })),
  getLastWeekRange: jest.fn(() => ({
    weekStart: '2025-03-10',
    weekEnd: '2025-03-16',
  })),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

const theme = getTheme('dark');
const mockTranslations = require('@/locales/en.json');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('WeeklyLeaderboard', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    const {
      getWeeklyLeaderboard,
      getMyLeaderboardPosition,
    } = require('@/services/weeklyLeaderboard');
    getWeeklyLeaderboard.mockResolvedValue(mockLeaderboardData);
    getMyLeaderboardPosition.mockResolvedValue(mockMyPosition);
  });

  it('renders the title and subtitle', async () => {
    renderWithTheme(<WeeklyLeaderboard />);
    expect(
      await screen.findByText(mockTranslations.weeklyLeaderboard),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardSubtitle),
    ).toBeInTheDocument();
  });

  it('renders tab labels', async () => {
    renderWithTheme(<WeeklyLeaderboard />);
    expect(
      await screen.findByText(mockTranslations.weeklyLeaderboardThisWeek),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardLastWeek),
    ).toBeInTheDocument();
  });

  it('renders podium, position card, and list after loading', async () => {
    renderWithTheme(<WeeklyLeaderboard />);
    // Podium heading
    expect(
      await screen.findByText(mockTranslations.weeklyLeaderboardTopPerformers),
    ).toBeInTheDocument();
    // Your position heading
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardYourPosition),
    ).toBeInTheDocument();
    // Rankings heading
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardRankings),
    ).toBeInTheDocument();
  });

  it('shows empty state when no entries', async () => {
    const { getWeeklyLeaderboard } = require('@/services/weeklyLeaderboard');
    getWeeklyLeaderboard.mockResolvedValueOnce({
      entries: [],
      weekStart: '2025-03-17',
      weekEnd: '2025-03-23',
      totalParticipants: 0,
    });

    renderWithTheme(<WeeklyLeaderboard />);
    expect(
      await screen.findByText(mockTranslations.weeklyLeaderboardNoActivity),
    ).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    const { getWeeklyLeaderboard } = require('@/services/weeklyLeaderboard');
    const { toast } = require('react-toastify');
    getWeeklyLeaderboard.mockResolvedValueOnce(null);

    renderWithTheme(<WeeklyLeaderboard />);

    await screen.findByText(mockTranslations.weeklyLeaderboardNoActivity);
    expect(toast.error).toHaveBeenCalledWith(
      mockTranslations.weeklyLeaderboardError,
    );
  });
});

describe('LeaderboardPodium', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders top 3 names', () => {
    renderWithTheme(
      <LeaderboardPodium entries={mockLeaderboardData.entries} />,
    );
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('renders XP values for top 3', () => {
    renderWithTheme(
      <LeaderboardPodium entries={mockLeaderboardData.entries} />,
    );
    expect(screen.getByText('3,000 XP')).toBeInTheDocument();
    expect(screen.getByText('2,500 XP')).toBeInTheDocument();
    expect(screen.getByText('2,000 XP')).toBeInTheDocument();
  });

  it('renders rank badges', () => {
    renderWithTheme(
      <LeaderboardPodium entries={mockLeaderboardData.entries} />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('returns null when no entries', () => {
    const { container } = renderWithTheme(<LeaderboardPodium entries={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('LeaderboardList', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders entries beyond rank 3', () => {
    renderWithTheme(
      <LeaderboardList
        entries={mockLeaderboardData.entries}
        currentUserId="user-1"
      />,
    );
    expect(screen.getAllByText(/Test User/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Paul Adams/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows "(You)" label for current user', () => {
    renderWithTheme(
      <LeaderboardList
        entries={mockLeaderboardData.entries}
        currentUserId="user-1"
      />,
    );
    expect(
      screen.getByText(`(${mockTranslations.weeklyLeaderboardYou})`),
    ).toBeInTheDocument();
  });

  it('renders rankings heading', () => {
    renderWithTheme(
      <LeaderboardList
        entries={mockLeaderboardData.entries}
        currentUserId="user-1"
      />,
    );
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardRankings),
    ).toBeInTheDocument();
  });

  it('returns null when 3 or fewer entries all in top 3', () => {
    const top3Only = mockLeaderboardData.entries.slice(0, 3);
    const { container } = renderWithTheme(
      <LeaderboardList entries={top3Only} currentUserId="user-1" />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('YourPositionCard', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders rank and XP', () => {
    renderWithTheme(<YourPositionCard position={mockMyPosition} />);
    expect(screen.getByText('#4')).toBeInTheDocument();
    expect(screen.getByText('1,500 XP')).toBeInTheDocument();
  });

  it('renders XP to next rank chip', () => {
    renderWithTheme(<YourPositionCard position={mockMyPosition} />);
    expect(screen.getByText('+500 XP to reach #3')).toBeInTheDocument();
  });

  it('renders "Your Position" heading', () => {
    renderWithTheme(<YourPositionCard position={mockMyPosition} />);
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardYourPosition),
    ).toBeInTheDocument();
  });

  it('shows encouragement when position is null', () => {
    renderWithTheme(<YourPositionCard position={null} />);
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardStartPraying),
    ).toBeInTheDocument();
  });

  it('shows encouragement when rank is 0', () => {
    renderWithTheme(
      <YourPositionCard
        position={{
          currentRank: 0,
          totalXp: 0,
          xpToNextRank: 0,
          nextRankUser: null,
          neighbors: [],
        }}
      />,
    );
    expect(
      screen.getByText(mockTranslations.weeklyLeaderboardStartPraying),
    ).toBeInTheDocument();
  });
});

describe('ResetCountdown', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders countdown text', () => {
    renderWithTheme(<ResetCountdown />);
    expect(screen.getByText(/Resets in 3d 5h/)).toBeInTheDocument();
  });
});
