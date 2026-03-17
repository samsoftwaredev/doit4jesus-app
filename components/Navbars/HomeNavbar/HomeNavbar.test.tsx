import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import HomeNavbar from './HomeNavbar';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('../../Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

const mockTranslations = {
  about: 'About',
  resources: 'Resources',
  whyPrayRosary: 'Why Pray',
  logIn: 'Login',
  home: 'Home',
  login: 'Login',
  signup: 'Sign Up',
};

describe('HomeNavbar Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({
      lang: 'en',
      changeLang: jest.fn(),
      setLang: jest.fn(),
      t: mockTranslations,
    });
  });

  it('renders the logo', () => {
    render(<HomeNavbar />);
    const logos = screen.getAllByTestId('logo');
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });

  it('renders without crashing', () => {
    const { container } = render(<HomeNavbar />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
