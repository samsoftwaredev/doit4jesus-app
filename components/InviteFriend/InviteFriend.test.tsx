import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import InviteFriend from './InviteFriend';

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
    }),
  },
}));

jest.mock('@/services', () => ({
  getUserProfileAPI: jest.fn().mockResolvedValue([[], null]),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,test'),
}));

jest.mock('../Dialog', () => ({
  __esModule: true,
  default: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
}));

jest.mock('../CopyLinkButton/CopyLinkButton', () => ({
  __esModule: true,
  default: () => <div data-testid="copy-link" />,
}));

jest.mock('../HorizontalDivider', () => ({
  __esModule: true,
  default: () => <hr />,
}));

const mockTranslations = {
  numberOfFriends: 'Number of Friends',
  inviteFriends: 'Invite Friends',
  inviteFriendsDescription: 'Invite your friends',
  scanQRCode: 'Scan QR Code',
  shareLink: 'Share Link',
};

describe('InviteFriend Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
  });

  it('renders the number of friends label', () => {
    render(<InviteFriend />);
    expect(screen.getByText('Number of Friends')).toBeInTheDocument();
  });

  it('renders invite button', () => {
    render(<InviteFriend />);
    expect(
      screen.getByRole('button', { name: /invite friends/i }),
    ).toBeInTheDocument();
  });

  it('shows zero friend count initially', () => {
    render(<InviteFriend />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
