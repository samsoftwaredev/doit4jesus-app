import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import LogIn from './LogIn';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/classes/SupabaseDB', () => ({
  default: jest.fn(),
  db: { logIn: jest.fn().mockResolvedValue(undefined) },
  supabase: {
    auth: {
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/components', () => ({
  GoogleAuth: () => <div data-testid="google-auth" />,
  HorizontalDivider: () => <hr />,
}));

jest.mock('@/components/FormErrorText', () => ({
  __esModule: true,
  default: () => null,
}));

const mockTranslations = {
  email: 'Email',
  password: 'Password',
  logIn: 'Log In',
  forgotPassword: 'Forgot Password?',
  dontHaveAccount: "Don't have an account?",
  signUp: 'Sign Up',
};

describe('LogIn Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({ getProfile: jest.fn() });
  });

  it('renders the email and password fields', () => {
    render(<LogIn />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the Log In button', () => {
    render(<LogIn />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders Google auth', () => {
    render(<LogIn />);
    expect(screen.getByTestId('google-auth')).toBeInTheDocument();
  });
});
