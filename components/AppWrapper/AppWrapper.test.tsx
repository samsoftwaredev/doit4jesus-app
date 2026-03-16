import { render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { useUserContext } from '@/context/UserContext';

import AppWrapper from './AppWrapper';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue(null),
  }),
}));

jest.mock('../Meta', () => ({
  __esModule: true,
  default: () => <div data-testid="meta" />,
}));

jest.mock('../ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../components/Sections/AccountSetup', () => ({
  __esModule: true,
  default: () => <div data-testid="account-setup" />,
}));

describe('AppWrapper Component', () => {
  const mockSetHideMusicPlayer = jest.fn();

  beforeEach(() => {
    (useAudioContext as jest.Mock).mockReturnValue({
      setHideMusicPlayer: mockSetHideMusicPlayer,
    });
  });

  it('renders children when user exists', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
    render(
      <AppWrapper>
        <div>App Content</div>
      </AppWrapper>,
    );
    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('renders when user is null', () => {
    (useUserContext as jest.Mock).mockReturnValue({ user: null });
    const { container } = render(
      <AppWrapper>
        <div>Content</div>
      </AppWrapper>,
    );
    expect(container).toBeTruthy();
  });
});
