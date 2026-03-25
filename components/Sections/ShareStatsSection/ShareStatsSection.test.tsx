import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import ShareStatsSection from './ShareStatsSection';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: () => ({ mode: 'dark', toggleTheme: jest.fn() }),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(() => ({
    user: {
      userId: 'user-1',
      fullName: 'Test User',
      firstName: 'Test',
      stats: { rosaryTotalCount: 42 },
    },
  })),
}));

jest.mock('@/classes', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockResolvedValue({ data: { streak: 7 }, error: null }),
    },
  },
}));

jest.mock('@/components/ShareCardPreview', () => {
  return function MockShareCardPreview() {
    return <div data-testid="share-card-preview" />;
  };
});

jest.mock('@/components/SocialShareButtons', () => {
  return function MockSocialShareButtons() {
    return <div data-testid="social-share-buttons" />;
  };
});

jest.mock('@/context/LevelsContext', () => ({
  useLevelsContext: () => ({
    getCurrentLevel: jest.fn(() => ({ label: 'Prayer Warrior' })),
    levels: [],
  }),
}));

jest.mock('@/constants/milestones', () => ({
  getRandomMotivatingMessage: jest.fn(() => 'Keep going!'),
}));

const theme = getTheme('dark');
const mockTranslations = require('@/locales/en.json');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ShareStatsSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders share card preview after loading', async () => {
    renderWithTheme(<ShareStatsSection />);
    expect(await screen.findByTestId('share-card-preview')).toBeInTheDocument();
  });

  it('renders social share buttons', async () => {
    renderWithTheme(<ShareStatsSection />);
    expect(
      await screen.findByTestId('social-share-buttons'),
    ).toBeInTheDocument();
  });

  it('renders heading text', async () => {
    renderWithTheme(<ShareStatsSection />);
    expect(
      await screen.findByText(mockTranslations.yourPrayerStats),
    ).toBeInTheDocument();
  });

  it('renders share encouragement text', async () => {
    renderWithTheme(<ShareStatsSection />);
    expect(
      await screen.findByText(mockTranslations.shareYourAchievements),
    ).toBeInTheDocument();
  });
});
