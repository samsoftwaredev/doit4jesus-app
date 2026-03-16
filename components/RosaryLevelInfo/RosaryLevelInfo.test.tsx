import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import RosaryLevelInfo from './RosaryLevelInfo';

const component = (props = { value: 'rosaryWarrior', requirement: 50 }) => (
  <LanguageContextProvider>
    <RosaryLevelInfo {...props} />
  </LanguageContextProvider>
);

describe('RosaryLevelInfo Component', () => {
  it('renders the requirement count', () => {
    render(component());
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('renders heading element', () => {
    render(component());
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
