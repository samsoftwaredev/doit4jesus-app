import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import GlobalPrayerMapSection from './GlobalPrayerMapSection';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(() => ({
    user: { userId: 'user-1', fullName: 'Test User' },
  })),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  },
}));

jest.mock('@/services/prayerMapApi', () => ({
  getPrayerMapCities: jest.fn().mockResolvedValue([]),
  joinPrayerSession: jest.fn().mockResolvedValue(null),
  startPrayerSession: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/services/prayerCityApi', () => ({
  getPrayerCityOptions: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/services/prayerSessionsApi', () => ({
  getActiveGlobalPrayerSessions: jest.fn().mockResolvedValue([]),
}));

jest.mock('next/dynamic', () => () => {
  return function MockGoogleMap() {
    return <div data-testid="google-map" />;
  };
});

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const theme = getTheme('dark');
const mockTranslations = require('@/locales/en.json');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('GlobalPrayerMapSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders the hero panel heading', async () => {
    renderWithTheme(<GlobalPrayerMapSection />);
    expect(
      await screen.findByText(mockTranslations.globalPrayerMap),
    ).toBeInTheDocument();
  });

  it('renders map controls and does not render start prayer button', async () => {
    renderWithTheme(<GlobalPrayerMapSection />);
    expect(
      await screen.findByRole('button', { name: /^city$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^country$/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /start.*prayer/i }),
    ).not.toBeInTheDocument();
  });
});
