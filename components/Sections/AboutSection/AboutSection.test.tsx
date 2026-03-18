import { render, screen } from '@testing-library/react';

import AboutSection from './AboutSection';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AboutSection Component', () => {
  it('renders the About heading', () => {
    render(<AboutSection />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders the Sign Up Now button', () => {
    render(<AboutSection />);
    expect(screen.getByText('Sign Up Now')).toBeInTheDocument();
  });
});
