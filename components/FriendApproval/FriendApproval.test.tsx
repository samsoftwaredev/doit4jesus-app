import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import FriendApproval from './FriendApproval';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/classes', () => ({
  db: {
    getFriendRequests: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    }),
  },
}));

jest.mock('@/services', () => ({
  getUserProfileAPI: jest.fn().mockResolvedValue([[], null]),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('../UserBubble', () => ({
  __esModule: true,
  default: ({ userName }: any) => <span>{userName}</span>,
}));

const mockTranslations = {
  friendRequest: 'Friend Requests',
  none: 'None',
  declineFriendRequest: 'Decline',
  approveFriendRequest: 'Approve',
  waitingForApproval: 'Waiting for approval',
};

describe('FriendApproval Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
  });

  it('renders the friend request title', () => {
    render(<FriendApproval />);
    expect(screen.getByText('Friend Requests')).toBeInTheDocument();
  });

  it('shows "None" when no requests', () => {
    render(<FriendApproval />);
    expect(screen.getByText('None')).toBeInTheDocument();
  });
});
