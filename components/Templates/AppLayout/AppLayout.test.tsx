import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';

import AppLayout from './AppLayout';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
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
  default: () => <div data-testid="side-navbar" />,
}));

jest.mock('../../Navbars/TopNavbar', () => ({
  __esModule: true,
  default: () => <div data-testid="top-navbar" />,
}));

const mockTranslations = {
  dashboard: 'Dashboard',
  friends: 'Friends',
  events: 'Events',
  confessionGuide: 'Confession Guide',
  account: 'Account',
};

describe('AppLayout Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
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
});
