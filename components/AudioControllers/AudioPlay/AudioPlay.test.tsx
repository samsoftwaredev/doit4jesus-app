import { fireEvent, render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { useUserContext } from '@/context/UserContext';
import { INTERFACE_AUDIO_STATE } from '@/interfaces/index';

import AudioPlay from './AudioPlay';

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
}));

describe('AudioPlay', () => {
  const mockSetAudioState = jest.fn();
  const mockTrack = require('@vercel/analytics').track;
  const mockUser = { userId: '123' };
  const mockAudioPlayer = { audio: {} };
  const mockAudioState = INTERFACE_AUDIO_STATE.PAUSED;

  beforeEach(() => {
    (useAudioContext as jest.Mock).mockReturnValue({
      setAudioState: mockSetAudioState,
      audioState: mockAudioState,
      audioPlayer: mockAudioPlayer,
    });
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the play button when audio is paused', () => {
    render(<AudioPlay />);
    const buttonElement = screen.getByTestId('play-button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders the pause button when audio is playing', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      setAudioState: mockSetAudioState,
      audioState: INTERFACE_AUDIO_STATE.PLAYING,
      audioPlayer: mockAudioPlayer,
    });
    render(<AudioPlay />);
    const buttonElement = screen.getByTestId('play-button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls setAudioState and tracks event when button is clicked', () => {
    render(<AudioPlay />);
    const buttonElement = screen.getByTestId('play-button');
    fireEvent.click(buttonElement);
    expect(mockSetAudioState).toHaveBeenCalledWith(
      INTERFACE_AUDIO_STATE.PLAYING,
    );
    expect(mockTrack).toHaveBeenCalledWith('PlayRosaryClicked', {
      userId: mockUser.userId,
    });
  });

  it.skip('disables the button when audioPlayer is undefined', async () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      setAudioState: mockSetAudioState,
      audioState: INTERFACE_AUDIO_STATE.BUFFERING,
      audioPlayer: undefined,
    });
    render(<AudioPlay />);
    const buttonElement = await screen.findByTestId('play-button');
    expect(buttonElement).toBeDisabled();
  });

  it('shows a loading spinner when audio is buffering', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      setAudioState: mockSetAudioState,
      audioState: INTERFACE_AUDIO_STATE.BUFFERING,
      audioPlayer: mockAudioPlayer,
    });
    render(<AudioPlay />);
    const spinnerElement = screen.getByTestId('loading-icon');
    expect(spinnerElement).toBeInTheDocument();
  });
});
