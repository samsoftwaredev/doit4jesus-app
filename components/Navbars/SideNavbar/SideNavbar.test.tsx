import { render, screen } from '@testing-library/react';

import SideNavbar from './SideNavbar';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('../../Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

describe('SideNavbar Component', () => {
  const menuItems = [
    { url: '/dashboard', label: 'Dashboard', icon: <span>D</span> },
    { url: '/friends', label: 'Friends', icon: <span>F</span> },
  ];

  it('renders menu items', () => {
    render(<SideNavbar handleDrawerClose={jest.fn()} menuItems={menuItems} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(<SideNavbar handleDrawerClose={jest.fn()} menuItems={menuItems} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
