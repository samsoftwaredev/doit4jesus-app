import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import WhyPrayRosary from './WhyPrayRosary';

const component = () => (
  <LanguageContextProvider>
    <WhyPrayRosary />
  </LanguageContextProvider>
);

describe('WhyPrayRosary Component', () => {
  it('renders the section', () => {
    const { container } = render(component());
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders three feature articles', () => {
    render(component());
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  it('renders the section heading', () => {
    render(component());
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
