import { render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useThemeContext } from '@/context/ThemeContext';

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

jest.mock('@/classes', () => ({
  supabase: {
    functions: { invoke: jest.fn().mockResolvedValue({ error: null }) },
  },
  db: { logOut: jest.fn() },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/components', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  Loading: () => <div data-testid="loading" />,
}));

const mockTranslations = {
  account: 'Account',
  deleteAccount: 'Delete Account',
  deleteAccountConfirmation: 'Are you sure?',
  deleteAccountQuestion: 'Want to delete?',
  theme: 'Theme',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  cancel: 'Cancel',
};

describe('AccountSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useAudioContext as jest.Mock).mockReturnValue({
      setAudioState: jest.fn(),
    });
    (useThemeContext as jest.Mock).mockReturnValue({
      mode: 'dark',
      toggleTheme: jest.fn(),
    });
  });

  it('renders account heading', () => {
    render(<AccountSection />);
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('renders delete account button', () => {
    render(<AccountSection />);
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });
});
