import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import Features from './Features';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const component = () => (
  <LanguageContextProvider>
    <Features />
  </LanguageContextProvider>
);

describe('Features Component', () => {
  it('renders the section', () => {
    const { container } = render(component());
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('renders feature heading', () => {
    render(component());
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders three feature images', () => {
    render(component());
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });
});
