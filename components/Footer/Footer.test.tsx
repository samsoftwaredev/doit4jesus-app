import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Footer from './Footer';

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: () => ({ mode: 'light', toggleTheme: jest.fn() }),
}));

describe('Footer', () => {
  it('renders the logo', () => {
    render(<Footer />);
    const logoElement = screen.getByTestId('logo');
    expect(logoElement).toBeInTheDocument();
  });

  it('renders the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const yearElement = screen.getByText(
      new RegExp(currentYear.toString(), 'i'),
    );
    expect(yearElement).toBeInTheDocument();
  });

  it('renders social media icons', () => {
    render(<Footer />);
    const facebookIcon = screen.getByLabelText('Facebook');
    const youtubeIcon = screen.getByLabelText('YouTube');
    const instagramIcon = screen.getByLabelText('Instagram');
    expect(facebookIcon).toBeInTheDocument();
    expect(youtubeIcon).toBeInTheDocument();
    expect(instagramIcon).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<Footer />);
    const aboutLink = screen.getByText(/about/i);
    const resourcesLink = screen.getByText(/resources/i);
    const contactLink = screen.getByText(/contact/i);
    const termsOfServiceLink = screen.getByText(/terms of service/i);
    const privacyPolicyLink = screen.getByText(/privacy policy/i);
    const loginLink = screen.getByText(/login/i);
    expect(aboutLink).toBeInTheDocument();
    expect(resourcesLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(termsOfServiceLink).toBeInTheDocument();
    expect(privacyPolicyLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});
