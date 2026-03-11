import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Loading from './Loading';

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
    const featureContainer = container.querySelector('.featureContainer');
    expect(featureContainer).toBeInTheDocument();
  });

  it('does not render logo when isFeature is true', () => {
    const { container } = render(<Loading isFeature />);
    const logoElement = container.querySelector('[data-testid="logo"]');
    expect(logoElement).not.toBeInTheDocument();
  });

  it('renders default container when isFeature is false', () => {
    const { container } = render(<Loading isFeature={false} />);
    const defaultContainer = container.querySelector('.container');
    expect(defaultContainer).toBeInTheDocument();
  });
});
