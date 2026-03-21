import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import CallToAction from './CallToAction';

const component = () => {
  return (
    <LanguageContextProvider>
      <CallToAction />
    </LanguageContextProvider>
  );
};

describe('CallToAction Component', () => {
  it('renders the call to action heading', () => {
    render(component());
    const headingElement = screen.getByText(/battle evil/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the sign up button', () => {
    render(component());
    const buttonElement = screen.getByRole('button', { name: /sign up/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders the sign up link with correct href', () => {
    render(component());
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/sign-up');
  });

  it('button has aria-label for accessibility', () => {
    render(component());
    const buttonElement = screen.getByRole('button', { name: /sign up/i });
    expect(buttonElement).toHaveAttribute(
      'aria-label',
      'Sign up for free to start praying with others',
    );
  });
});
