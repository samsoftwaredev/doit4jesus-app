import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useUserContext } from '@/context/UserContext';

import TopNavbar from './TopNavbar';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('@react-oauth/google', () => ({
  googleLogout: jest.fn(),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  default: jest.fn(),
  db: { logOut: jest.fn() },
  supabase: {
    auth: {
      signOut: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

jest.mock('../../Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

jest.mock('../../UserBubble', () => ({
  __esModule: true,
  default: () => <div data-testid="user-bubble" />,
}));

jest.mock('../../Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading" />,
}));

const mockTranslations = {
  viewProfile: 'View Profile',
  logOut: 'Log Out',
};

describe('TopNavbar Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({
      lang: 'en',
      changeLang: jest.fn(),
      setLang: jest.fn(),
      t: mockTranslations,
    });
    (useThemeContext as jest.Mock).mockReturnValue({
      mode: 'dark',
      toggleTheme: jest.fn(),
    });
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        userId: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        pictureUrl: '',
      },
      getProfile: jest.fn(),
    });
  });

  it('renders the logo', () => {
    render(<TopNavbar handleMenu={jest.fn()} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders the user name', () => {
    render(<TopNavbar handleMenu={jest.fn()} />);
    expect(screen.getByText(/John/)).toBeInTheDocument();
  });
});
