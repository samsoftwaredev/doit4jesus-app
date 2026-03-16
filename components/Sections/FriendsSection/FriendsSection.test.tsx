import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import FriendsSection from './FriendsSection';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/components', () => ({
  AllFriends: () => <div data-testid="all-friends" />,
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  RosaryLevel: () => <div data-testid="rosary-level" />,
  RosaryLevelInfo: () => <div data-testid="rosary-level-info" />,
}));

jest.mock('@/components/FriendApproval', () => ({
  __esModule: true,
  default: () => <div data-testid="friend-approval" />,
}));

jest.mock('@/components/InviteFriend', () => ({
  __esModule: true,
  default: () => <div data-testid="invite-friend" />,
}));

jest.mock('@/utils/levels', () => ({
  getCurrentLevel: jest.fn().mockReturnValue({ levelNum: 1 }),
}));

const mockTranslations = {
  todaysChallenge: "Today's Challenge",
  todaysChallengeDescription2: 'Pray one rosary',
  currentLevel: 'Current Level',
};

describe('FriendsSection Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { stats: { rosaryTotalCount: 5, todaysRosaryCompleted: false } },
    });
  });

  it('renders todays challenge section', () => {
    render(<FriendsSection />);
    expect(screen.getByText("Today's Challenge")).toBeInTheDocument();
  });

  it('renders invite friend section', () => {
    render(<FriendsSection />);
    expect(screen.getByTestId('invite-friend')).toBeInTheDocument();
  });
});
