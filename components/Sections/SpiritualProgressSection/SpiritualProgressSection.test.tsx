import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import SpiritualProgressSection from './SpiritualProgressSection';

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

jest.mock('@/services/spiritualXp', () => {
  const snapshot = {
    profile: {
      currentLevel: 3,
      currentTitle: 'Prayer Warrior',
      totalXp: 1500,
    },
    nextLevel: {
      level: 4,
      title: 'Holy Knight',
      minXp: 2000,
    },
    xpToNextLevel: 500,
    progressPercentToNext: 75,
    currentLevelBadgeKey: null,
    recentlyLeveledUp: false,
    levels: [
      { level: 3, title: 'Prayer Warrior', minXp: 1000 },
      { level: 4, title: 'Holy Knight', minXp: 2000 },
      { level: 5, title: 'Saint', minXp: 3000 },
    ],
    weeklySummary: {
      totalXp: 200,
      eventCount: 5,
      breakdown: [
        { type: 'rosary_completed', totalXp: 150, events: 3 },
        { type: 'daily_activity', totalXp: 50, events: 2 },
      ],
    },
    recentEvents: [
      {
        id: 'evt-1',
        type: 'rosary_completed',
        xpAmount: 50,
        metadata: null,
        createdAt: '2025-01-15T10:00:00Z',
      },
    ],
  };
  return {
    getSpiritualProgress: jest.fn().mockResolvedValue(snapshot),
  };
});

jest.mock('next/dynamic', () => () => {
  return function MockConfettiCelebration() {
    return <div data-testid="confetti" />;
  };
});

const theme = getTheme('dark');
const mockTranslations = require('@/locales/en.json');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SpiritualProgressSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders XP summary after loading', async () => {
    renderWithTheme(<SpiritualProgressSection />);
    expect(
      await screen.findByText(mockTranslations.xpSummary),
    ).toBeInTheDocument();
  });

  it('renders current title', async () => {
    renderWithTheme(<SpiritualProgressSection />);
    const elements = await screen.findAllByText('Prayer Warrior');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders total XP', async () => {
    renderWithTheme(<SpiritualProgressSection />);
    expect(await screen.findByText('1,500')).toBeInTheDocument();
  });

  it('renders next milestone section', async () => {
    renderWithTheme(<SpiritualProgressSection />);
    expect(
      await screen.findByText(mockTranslations.nextMilestone),
    ).toBeInTheDocument();
    const elements = await screen.findAllByText('Holy Knight');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders level path', async () => {
    renderWithTheme(<SpiritualProgressSection />);
    expect(
      await screen.findByText(mockTranslations.levelPath),
    ).toBeInTheDocument();
  });

  it('renders XP activity feed', async () => {
    renderWithTheme(<SpiritualProgressSection />);
    expect(
      await screen.findByText(mockTranslations.xpActivityFeed),
    ).toBeInTheDocument();
  });

  it('shows error alert when snapshot is null', async () => {
    const { getSpiritualProgress } = require('@/services/spiritualXp');
    getSpiritualProgress.mockResolvedValueOnce(null);
    renderWithTheme(<SpiritualProgressSection />);
    expect(
      await screen.findByText(mockTranslations.unableToLoadSpiritualProgress),
    ).toBeInTheDocument();
  });
});
