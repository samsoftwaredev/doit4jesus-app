import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@/context/UserContext';

import AdminDashboard from './index';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn().mockReturnValue({
    t: {
      dashboard: 'Dashboard',
      achievements: 'Achievements',
      community: 'Community',
    },
    lang: 'en',
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
  usePathname: jest.fn().mockReturnValue('/app/admin'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

jest.mock('@/classes/SupabaseDB', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
  db: {
    getProfiles: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
  },
}));

jest.mock('@/components/Admin', () => ({
  AlertsList: () => null,
  ChartCard: () => null,
  CohortHeatmap: () => null,
  FilterBar: () => null,
  InsightsList: () => null,
  KpiCard: () => null,
}));

jest.mock('@/components/AppWrapper/AppWrapper', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/Templates', () => ({
  AppLayout: ({ children }: any) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

jest.mock('@/components', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/lib/admin/csvExport', () => ({
  downloadCsv: jest.fn(),
}));

jest.mock('recharts', () => ({
  Area: () => null,
  AreaChart: () => null,
  Bar: () => null,
  BarChart: () => null,
  CartesianGrid: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

describe('Admin page route guard', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('redirects non-admin users to /app', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: '1', role: 'user', stats: {} },
    });

    render(<AdminDashboard />);

    expect(mockPush).toHaveBeenCalledWith('/app');
  });

  it('shows loading state while user is undefined', () => {
    (useUserContext as jest.Mock).mockReturnValue({ user: undefined });

    render(<AdminDashboard />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not redirect admin users', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: '1', role: 'admin', stats: {} },
    });

    render(<AdminDashboard />);

    expect(mockPush).not.toHaveBeenCalled();
  });
});
