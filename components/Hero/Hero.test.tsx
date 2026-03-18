import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import Hero from './Hero';

const component = () => (
  <LanguageContextProvider>
    <Hero />
  </LanguageContextProvider>
);

describe('Hero Component', () => {
  it('renders the section', () => {
    const { container } = render(component());
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders a heading', () => {
    render(component());
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('renders the rosary image', () => {
    render(component());
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });
});
