import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import AppLayout from './AppLayout';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    pathname: '/app',
  }),
  usePathname: jest.fn().mockReturnValue('/app'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

jest.mock('../../Meta', () => ({
  __esModule: true,
  default: () => <div data-testid="meta" />,
}));

jest.mock('../../Navbars/SideNavbar', () => ({
  __esModule: true,
  default: ({ menuItems }: any) => (
    <div data-testid="side-navbar">
      {menuItems.map((item: any) => (
        <a key={item.label} href={item.url}>
          {item.label}
        </a>
      ))}
    </div>
  ),
}));

jest.mock('../../Navbars/TopNavbar', () => ({
  __esModule: true,
  default: () => <div data-testid="top-navbar" />,
}));

const mockTranslations = {
  dashboard: 'Dashboard',
  achievements: 'Achievements',
  community: 'Community',
  friends: 'Friends',
  events: 'Events',
  confessionGuide: 'Confession Guide',
  account: 'Account',
};

describe('AppLayout Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: '1', role: 'user', stats: {} },
    });
  });

  it('renders children', () => {
    render(
      <AppLayout>
        <div>Page Content</div>
      </AppLayout>,
    );
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders meta component', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByTestId('meta')).toBeInTheDocument();
  });

  it('renders top navbar', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByTestId('top-navbar')).toBeInTheDocument();
  });

  it('shows Admin nav item for admin users', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: '1', role: 'admin', stats: {} },
    });
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('hides Admin nav item for non-admin users', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: '1', role: 'user', stats: {} },
    });
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('hides Admin nav item when user has no role', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: '1', stats: {} },
    });
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
