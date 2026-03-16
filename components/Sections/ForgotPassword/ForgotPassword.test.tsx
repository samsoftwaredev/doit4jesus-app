import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import ForgotPassword from './ForgotPassword';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  default: jest.fn(),
  db: { resetPassword: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('../../FormErrorText', () => ({
  __esModule: true,
  default: () => null,
}));

const mockTranslations = {
  resetPassword: 'Reset Password',
  email: 'Email',
};

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders the email field', () => {
    render(<ForgotPassword />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders the reset password button', () => {
    render(<ForgotPassword />);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });
});
