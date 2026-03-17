import { render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useUserContext } from '@/context/UserContext';

import AccountSection from './AccountSection';

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/classes', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    },
    functions: { invoke: jest.fn().mockResolvedValue({ error: null }) },
  },
  db: {
    logOut: jest.fn(),
    updatePassword: jest.fn(),
    updateLanguage: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn(), warning: jest.fn() },
}));

jest.mock('@/components', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  Loading: () => <div data-testid="loading" />,
  PasswordValidator: () => <div data-testid="password-validator" />,
}));

const mockTranslations = {
  account: 'Account',
  accountSettings: 'Account Settings',
  deleteAccount: 'Delete Account',
  deleteAccountConfirmation: 'Are you sure?',
  deleteAccountQuestion: 'Want to delete?',
  theme: 'Theme',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  cancel: 'Cancel',
  language: 'Language',
  english: 'English',
  spanish: 'Spanish',
  changePassword: 'Change Password',
  currentPassword: 'Current Password',
  newPassword: 'New Password',
  confirmNewPassword: 'Confirm New Password',
  dangerZone: 'Danger Zone',
  hasUppercase: 'At least 1 uppercase letter',
  passwordStrength: 'Password Strength',
  weak: 'Weak',
  fair: 'Fair',
  strong: 'Strong',
  loading: 'Loading...',
  languageUpdated: 'Language preference saved.',
  passwordChangedSuccess: 'Password updated.',
  incorrectCurrentPassword: 'Current password is incorrect.',
  sessionExpired: 'Session expired.',
  errorUpdatingPassword: 'Error updating password.',
};

describe('AccountSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({
      t: mockTranslations,
      lang: 'es',
      setLang: jest.fn(),
    });
    (useAudioContext as jest.Mock).mockReturnValue({
      setAudioState: jest.fn(),
    });
    (useThemeContext as jest.Mock).mockReturnValue({
      mode: 'dark',
      toggleTheme: jest.fn(),
    });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'test-id', email: 'test@example.com' },
    });
  });

  it('renders account settings heading', () => {
    render(<AccountSection />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    render(<AccountSection />);
    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  it('renders change password section', () => {
    render(<AccountSection />);
    const elements = screen.getAllByText('Change Password');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders delete account button', () => {
    render(<AccountSection />);
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  it('renders danger zone section', () => {
    render(<AccountSection />);
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
  });
});
