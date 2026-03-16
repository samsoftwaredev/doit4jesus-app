import { render, screen } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import FriendRequestSection from './FriendRequestSection';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
    query: { slug: 'friend-user-id' },
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} data-testid="next-image" />,
}));

jest.mock('@/classes', () => ({
  db: {
    getFriendRequests: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  },
  supabase: {
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/utils', () => ({
  normalizeFriendProfile: jest.fn().mockReturnValue([]),
  orderUUIDs: jest.fn().mockReturnValue(['a', 'b']),
}));

jest.mock('@/components', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../..', () => ({
  ErrorPage: ({ text }: any) => <div>{text}</div>,
  Card: ({ children }: any) => <div>{children}</div>,
}));

describe('FriendRequestSection Component', () => {
  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        userId: 'my-user-id',
        fullName: 'John Doe',
        pictureUrl: '',
      },
    });
  });

  it('renders the Friend Request heading', () => {
    render(<FriendRequestSection />);
    expect(screen.getByText('Friend Request')).toBeInTheDocument();
  });

  it('renders cancel and send buttons', () => {
    render(<FriendRequestSection />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Send Friend Request')).toBeInTheDocument();
  });
});
