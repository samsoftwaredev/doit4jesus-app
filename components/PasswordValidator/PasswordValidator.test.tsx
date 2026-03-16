import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import PasswordValidator from './PasswordValidator';

const component = (props: any) => (
  <LanguageContextProvider>
    <PasswordValidator {...props} />
  </LanguageContextProvider>
);

describe('PasswordValidator Component', () => {
  it('renders validation items for password', () => {
    render(component({ password: '' }));
    // Should render validation checks (at least 3 items)
    const closeIcons = document.querySelectorAll('[data-testid="CloseIcon"]');
    expect(closeIcons.length).toBeGreaterThanOrEqual(3);
  });

  it('shows check icons for valid password', () => {
    render(component({ password: 'Test@1234' }));
    const checkIcons = document.querySelectorAll('[data-testid="CheckIcon"]');
    expect(checkIcons.length).toBeGreaterThanOrEqual(3);
  });

  it('shows password match validation when comparePasswords is true', () => {
    render(
      component({
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        comparePasswords: true,
      }),
    );
    const checkIcons = document.querySelectorAll('[data-testid="CheckIcon"]');
    expect(checkIcons.length).toBeGreaterThanOrEqual(4);
  });

  it('shows mismatch for different passwords', () => {
    render(
      component({
        password: 'Test@1234',
        confirmPassword: 'Different@1',
        comparePasswords: true,
      }),
    );
    const closeIcons = document.querySelectorAll('[data-testid="CloseIcon"]');
    expect(closeIcons.length).toBeGreaterThanOrEqual(1);
  });
});
