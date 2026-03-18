import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import SignUp from './SignUp';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn().mockReturnValue({
    getProfile: jest.fn(),
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  default: jest.fn(),
  db: { signUp: jest.fn().mockResolvedValue(undefined) },
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

jest.mock('@/components/FormErrorText', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/constants', () => ({
  passwordValidationRules: {
    minLength: 8,
    maxLength: 100,
  },
  NEW_USER_REDIRECT: '/app/dashboard?newUser=true',
}));

jest.mock('../..', () => ({
  FormErrorText: () => null,
  GoogleAuth: () => <div data-testid="google-auth" />,
  HorizontalDivider: () => <hr />,
  Loading: () => <div data-testid="loading" />,
  PasswordValidator: () => <div data-testid="password-validator" />,
}));

jest.mock('@/utils', () => ({
  emailRegEx: /.+/,
  nameRegEx: /.+/,
}));

const mockTranslations = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  password: 'Password',
  signUp: 'Sign Up',
  male: 'Male',
  female: 'Female',
  gender: 'Gender',
  alreadyHaveAccount: 'Already have an account?',
  logIn: 'Log In',
};

describe('SignUp Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders the form fields', () => {
    render(<SignUp />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the Sign Up button', () => {
    render(<SignUp />);
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('renders Google auth', () => {
    render(<SignUp />);
    expect(screen.getByTestId('google-auth')).toBeInTheDocument();
  });
});
