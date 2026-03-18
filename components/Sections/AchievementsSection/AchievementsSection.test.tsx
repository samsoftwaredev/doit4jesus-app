import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import AchievementsSection from './AchievementsSection';

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

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@/services/achievements', () => {
  const dashboard = {
    summary: {
      totalBadgesEarned: 3,
      totalBadgesAvailable: 10,
      currentPrayerStreak: 7,
      nextMilestoneName: 'Prayer Master',
      nextMilestoneCount: 2,
    },
    featuredBadge: {
      badgeKey: 'first_rosary',
      name: 'First Rosary',
      description: 'Prayed your first rosary',
      iconName: 'favorite',
      category: 'prayer',
      requirementType: 'count',
      requirementValue: 1,
      requirementLabel: '1 rosary',
      progressCurrent: 1,
      progressPercent: 100,
      remainingCount: 0,
      isEarned: true,
      earnedAt: '2025-01-01T00:00:00Z',
      shareMessage: 'First Rosary!',
      verseText: 'Verse text',
      verseReference: 'Reference',
    },
    earnedBadges: [
      {
        badgeKey: 'first_rosary',
        name: 'First Rosary',
        description: 'Prayed your first rosary',
        iconName: 'favorite',
        category: 'prayer',
        requirementType: 'count',
        requirementValue: 1,
        requirementLabel: '1 rosary',
        progressCurrent: 1,
        progressPercent: 100,
        remainingCount: 0,
        isEarned: true,
        earnedAt: '2025-01-01T00:00:00Z',
        shareMessage: 'First Rosary!',
        verseText: 'Verse text',
        verseReference: 'Reference',
      },
    ],
    lockedBadges: [
      {
        badgeKey: 'rosary_warrior',
        name: 'Rosary Warrior',
        description: 'Pray 100 rosaries',
        iconName: 'military_tech',
        category: 'prayer',
        requirementType: 'count',
        requirementValue: 100,
        requirementLabel: '100 rosaries',
        progressCurrent: 5,
        progressPercent: 5,
        remainingCount: 95,
        isEarned: false,
        earnedAt: null,
        shareMessage: 'Rosary Warrior!',
        verseText: 'Verse text',
        verseReference: 'Reference',
      },
    ],
    progress: [],
    shareBaseUrl: 'https://doit4jesus.com',
  };
  return {
    getAchievementDashboard: jest.fn().mockResolvedValue(dashboard),
    localizeAchievementDashboard: jest.fn().mockImplementation((d) => d),
    getAchievementBadgeShareUrl: jest
      .fn()
      .mockReturnValue('https://doit4jesus.com/badge/first_rosary'),
  };
});

jest.mock('@/components/AchievementShareModal', () => {
  return function MockShareModal() {
    return <div data-testid="achievement-share-modal" />;
  };
});

const theme = getTheme('dark');
const mockTranslations = require('@/locales/en.json');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AchievementsSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('shows loading skeletons initially', () => {
    const { container } = renderWithTheme(<AchievementsSection />);
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });

  it('renders dashboard content after loading', async () => {
    renderWithTheme(<AchievementsSection />);
    expect(
      await screen.findByText(mockTranslations.achievementHeroTitle),
    ).toBeInTheDocument();
  });

  it('renders earned badges section', async () => {
    renderWithTheme(<AchievementsSection />);
    expect(
      await screen.findByText(mockTranslations.achievementEarnedBadges),
    ).toBeInTheDocument();
    const elements = screen.getAllByText('First Rosary');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders locked badges section', async () => {
    renderWithTheme(<AchievementsSection />);
    expect(
      await screen.findByText(mockTranslations.achievementLockedBadges),
    ).toBeInTheDocument();
    expect(screen.getByText('Rosary Warrior')).toBeInTheDocument();
  });
});
