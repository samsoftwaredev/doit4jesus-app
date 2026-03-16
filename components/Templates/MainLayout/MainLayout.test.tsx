import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import MainLayout from './MainLayout';

jest.mock('@/components', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
  HomeNavbar: () => <div data-testid="home-navbar">HomeNavbar</div>,
}));

const component = (children?: React.ReactNode) => (
  <LanguageContextProvider>
    <MainLayout>{children}</MainLayout>
  </LanguageContextProvider>
);

describe('MainLayout Component', () => {
  it('renders footer', () => {
    render(component());
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders home navbar', () => {
    render(component());
    expect(screen.getByTestId('home-navbar')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(component(<div>Page Content</div>));
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('accepts custom top navbar', () => {
    render(
      <LanguageContextProvider>
        <MainLayout topNavbar={<nav data-testid="custom-nav">Custom</nav>}>
          <div>Content</div>
        </MainLayout>
      </LanguageContextProvider>,
    );
    expect(screen.getByTestId('custom-nav')).toBeInTheDocument();
  });
});
