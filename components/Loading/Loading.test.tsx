import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Loading from './Loading';

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: () => ({ mode: 'light', toggleTheme: jest.fn() }),
}));

describe('Loading Component', () => {
  it('renders the default loading screen with logo', () => {
    const { container } = render(<Loading />);
    const logoElement = container.querySelector('svg');
    expect(logoElement).toBeInTheDocument();
  });

  it('renders circular progress spinner', () => {
    render(<Loading />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('renders feature loading when isFeature is true', () => {
    const { container } = render(<Loading isFeature />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('does not render logo when isFeature is true', () => {
    const { container } = render(<Loading isFeature />);
    const logoElement = container.querySelector('[data-testid="logo"]');
    expect(logoElement).not.toBeInTheDocument();
  });

  it('renders default container when isFeature is false', () => {
    const { container } = render(<Loading isFeature={false} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
