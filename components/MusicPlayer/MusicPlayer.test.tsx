import { render } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { usePresenceContext } from '@/context/PresenceContext';

import MusicPlayer from './MusicPlayer';

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('@/context/PresenceContext', () => ({
  usePresenceContext: jest.fn(),
}));

jest.mock('../AudioControllers/AudioNext', () => ({
  __esModule: true,
  default: () => <div data-testid="audio-next" />,
}));

jest.mock('../AudioControllers/AudioPlay', () => ({
  __esModule: true,
  default: () => <div data-testid="audio-play" />,
}));

jest.mock('../AudioControllers/AudioPrevious', () => ({
  __esModule: true,
  default: () => <div data-testid="audio-previous" />,
}));

jest.mock('../MovingText', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../MusicSettings', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('../MusicVideo', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('../OnlineUsers', () => ({
  __esModule: true,
  default: () => <div />,
}));

describe('MusicPlayer Component', () => {
  it('renders when not hidden', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      audioPlayer: { title: 'Test Song' },
      hideMusicPlayer: false,
    });
    (usePresenceContext as jest.Mock).mockReturnValue({ users: [] });
    const { container } = render(<MusicPlayer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('returns null when hidden', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      audioPlayer: null,
      hideMusicPlayer: true,
    });
    (usePresenceContext as jest.Mock).mockReturnValue({ users: [] });
    const { container } = render(<MusicPlayer />);
    expect(container.firstChild).toBeNull();
  });
});
