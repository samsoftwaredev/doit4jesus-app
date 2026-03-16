import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import UpdatePassword from './UpdatePassword';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  default: jest.fn(),
  db: { updatePassword: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/components/FormErrorText', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../..', () => ({
  PasswordValidator: () => <div data-testid="password-validator" />,
}));

const mockTranslations = {
  password: 'Password',
  confirmPassword: 'Confirm Password',
  updatePassword: 'Update Password',
};

describe('UpdatePassword Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders the password fields', () => {
    render(<UpdatePassword />);
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('renders the Update Password button', () => {
    render(<UpdatePassword />);
    expect(screen.getByText('Update Password')).toBeInTheDocument();
  });
});
