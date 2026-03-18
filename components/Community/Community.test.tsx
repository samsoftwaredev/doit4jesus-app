import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import Community from './Community';

const component = () => (
  <LanguageContextProvider>
    <Community />
  </LanguageContextProvider>
);

describe('Community Component', () => {
  it('renders the section', () => {
    const { container } = render(component());
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(component());
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the rosary image', () => {
    render(component());
    const img = screen.getByAltText('Illustration of a Rosary');
    expect(img).toBeInTheDocument();
  });
});
