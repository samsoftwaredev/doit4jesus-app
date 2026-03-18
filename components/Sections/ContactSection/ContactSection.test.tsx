import { render, screen } from '@testing-library/react';

import ContactSection from './ContactSection';

jest.mock('@/classes', () => ({
  supabase: {
    functions: { invoke: jest.fn().mockResolvedValue({ error: null }) },
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('../../FormErrorText', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/utils', () => ({
  emailRegEx: /.+/,
  nameRegEx: /.+/,
}));

describe('ContactSection Component', () => {
  it('renders the Contact Us heading', () => {
    render(<ContactSection />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders the email and name fields', () => {
    render(<ContactSection />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });

  it('renders the Send Message button', () => {
    render(<ContactSection />);
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });
});
