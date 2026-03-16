import { render, screen } from '@testing-library/react';

import ErrorPage from './ErrorPage';

jest.mock('../Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

describe('ErrorPage Component', () => {
  it('renders error text in card mode by default', () => {
    render(<ErrorPage text="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders full screen mode when isPage is true', () => {
    render(<ErrorPage text="Page error" isPage />);
    expect(screen.getByText('Page error')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('does not render logo in card mode', () => {
    render(<ErrorPage text="Card error" />);
    expect(screen.queryByTestId('logo')).not.toBeInTheDocument();
  });
});
