import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import RosaryWeapon from './RosaryWeapon';

const component = () => (
  <LanguageContextProvider>
    <RosaryWeapon />
  </LanguageContextProvider>
);

describe('RosaryWeapon Component', () => {
  it('renders the section title', () => {
    render(component());
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('renders the YouTube iframe', () => {
    const { container } = render(component());
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
  });
});
