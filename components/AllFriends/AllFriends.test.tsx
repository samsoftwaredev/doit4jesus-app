import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import AllFriends from './AllFriends';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/classes', () => ({
  db: {
    getFriends: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
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

jest.mock('../Dialog', () => ({
  __esModule: true,
  default: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
}));

jest.mock('../UserBubble', () => ({
  __esModule: true,
  default: ({ userName }: any) => <span>{userName}</span>,
}));

const mockTranslations = {
  community: 'Community',
  none: 'None',
  removeFriend: 'Remove Friend',
  removeFriendDescription: 'Remove {{name}}?',
  cancel: 'Cancel',
  delete: 'Delete',
  rosary: 'rosary',
  rosaries: 'rosaries',
};

describe('AllFriends Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
  });

  it('renders the friends title', () => {
    render(<AllFriends />);
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('shows "None" when no friends', () => {
    render(<AllFriends />);
    expect(screen.getByText('None')).toBeInTheDocument();
  });
});
