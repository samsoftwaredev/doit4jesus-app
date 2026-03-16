import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import AppIntroduction from './AppIntroduction';

const component = () => (
  <LanguageContextProvider>
    <AppIntroduction />
  </LanguageContextProvider>
);

describe('AppIntroduction Component', () => {
  it('renders without crashing', () => {
    const { container } = render(component());
    expect(container.firstChild).toBeInTheDocument();
  });
});
