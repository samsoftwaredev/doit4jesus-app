import { render, screen } from '@testing-library/react';
import { useFormState } from 'react-hook-form';

import FormErrorText from './FormErrorText';

jest.mock('react-hook-form', () => ({
  useFormState: jest.fn(),
}));

const mockControl = {} as any;

describe('FormErrorText Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when form is valid', () => {
    (useFormState as jest.Mock).mockReturnValue({
      touchedFields: {},
      errors: {},
      isSubmitted: false,
      isValid: true,
    });
    const { container } = render(
      <FormErrorText control={mockControl} name="email" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('returns null when field is not touched and not submitted', () => {
    (useFormState as jest.Mock).mockReturnValue({
      touchedFields: {},
      errors: { email: { type: 'required', message: 'Required' } },
      isSubmitted: false,
      isValid: false,
    });
    const { container } = render(
      <FormErrorText control={mockControl} name="email" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows required error when field is touched', () => {
    (useFormState as jest.Mock).mockReturnValue({
      touchedFields: { email: true },
      errors: { email: { type: 'required', message: '' } },
      isSubmitted: false,
      isValid: false,
    });
    render(<FormErrorText control={mockControl} name="email" />);
    expect(screen.getByText('Email required')).toBeInTheDocument();
  });

  it('uses fieldName when provided', () => {
    (useFormState as jest.Mock).mockReturnValue({
      touchedFields: { email: true },
      errors: { email: { type: 'required', message: '' } },
      isSubmitted: false,
      isValid: false,
    });
    render(
      <FormErrorText
        control={mockControl}
        name="email"
        fieldName="Email Address"
      />,
    );
    expect(screen.getByText('Email address required')).toBeInTheDocument();
  });

  it('shows custom error message', () => {
    (useFormState as jest.Mock).mockReturnValue({
      touchedFields: { email: true },
      errors: { email: { type: 'pattern', message: 'Invalid email format' } },
      isSubmitted: true,
      isValid: false,
    });
    render(<FormErrorText control={mockControl} name="email" />);
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });
});
