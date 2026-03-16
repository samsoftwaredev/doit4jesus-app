import { render, screen } from '@testing-library/react';

import DashboardSection from './DashboardSection';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn().mockReturnValue({
    user: { stats: { rosaryTotalCount: 5 } },
  }),
}));

jest.mock('@/hooks/useMilestones', () => ({
  useMilestones: jest.fn().mockReturnValue({
    currentMilestone: null,
    showMilestone: false,
    dismissMilestone: jest.fn(),
  }),
}));

jest.mock('../../ShareStatsButton', () => ({
  __esModule: true,
  default: () => <div data-testid="share-stats-button" />,
}));

jest.mock('../../MilestoneModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../Card', () => ({
  __esModule: true,
  default: ({ children, title }: any) => (
    <div data-testid="card">
      <span>{title}</span>
      {children}
    </div>
  ),
}));

jest.mock('../../TodaysRosary', () => ({
  __esModule: true,
  default: () => <div data-testid="todays-rosary" />,
}));

jest.mock('../../TotalRosariesPrayed', () => ({
  __esModule: true,
  default: () => <div data-testid="total-rosaries" />,
}));

jest.mock('../../RosaryStats', () => ({
  __esModule: true,
  default: () => <div data-testid="rosary-stats" />,
}));

jest.mock('../../RosaryStreak', () => ({
  __esModule: true,
  default: () => <div data-testid="rosary-streak" />,
}));

jest.mock('../../RosaryWinnerChallenge', () => ({
  __esModule: true,
  default: () => <div data-testid="rosary-winner" />,
}));

jest.mock('../../Leaderboards', () => ({
  __esModule: true,
  default: () => <div data-testid="leaderboards" />,
}));

jest.mock('../../InviteFriend', () => ({
  __esModule: true,
  default: () => <div data-testid="invite-friend" />,
}));

jest.mock('../ProgressLevelsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="progress-levels" />,
}));

describe('DashboardSection Component', () => {
  it('renders all dashboard cards', () => {
    render(<DashboardSection />);
    expect(screen.getByTestId('todays-rosary')).toBeInTheDocument();
    expect(screen.getByTestId('total-rosaries')).toBeInTheDocument();
    expect(screen.getByTestId('leaderboards')).toBeInTheDocument();
  });

  it('renders invite friend section', () => {
    render(<DashboardSection />);
    expect(screen.getByTestId('invite-friend')).toBeInTheDocument();
  });
});
