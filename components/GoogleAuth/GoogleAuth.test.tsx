import { render, screen } from '@testing-library/react';

import GoogleAuth from './GoogleAuth';

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: (props: any) => (
    <div
      data-testid="google-login"
      onClick={() => props.onSuccess({ credential: 'abc' })}
    >
      GoogleLogin
    </div>
  ),
}));

jest.mock('./GoogleAuth.tools', () => ({
  handleLoginSuccess: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/classes', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: () => ({
    getProfile: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: () => ({
    t: {
      signUpWithGoogle: 'Sign Up with Google',
      failedToSignUp: 'Failed to sign up',
      signUpSuccessful: 'Sign up successful',
      googleAuthFailed: 'Google auth failed',
    },
  }),
}));

describe('GoogleAuth Component', () => {
  it('renders Google Login when isSignUp is false', () => {
    render(<GoogleAuth isSignUp={false} />);
    expect(screen.getByTestId('google-login')).toBeInTheDocument();
  });

  it('renders Sign Up button when isSignUp is true', () => {
    render(<GoogleAuth isSignUp={true} />);
    expect(screen.getByText(/sign up with google/i)).toBeInTheDocument();
  });
});
