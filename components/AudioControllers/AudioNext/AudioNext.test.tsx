import { fireEvent, render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { useUserContext } from '@/context/UserContext';

import AudioNext from './AudioNext';

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
}));

describe('AudioNext', () => {
  const mockForwardAudio = jest.fn();
  const mockTrack = require('@vercel/analytics').track;
  const mockUser = { userId: '123' };
  const mockAudioPlayer = { audio: {} };

  beforeEach(() => {
    (useAudioContext as jest.Mock).mockReturnValue({
      forwardAudio: mockForwardAudio,
      audioPlayer: mockAudioPlayer,
    });
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the forward button', () => {
    render(<AudioNext />);
    const buttonElement = screen.getByTestId('forward-button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls forwardAudio and tracks event when button is clicked', () => {
    render(<AudioNext />);
    const buttonElement = screen.getByTestId('forward-button');
    fireEvent.click(buttonElement);
    expect(mockForwardAudio).toHaveBeenCalled();
    expect(mockTrack).toHaveBeenCalledWith('ForwardRosaryClicked', {
      userId: mockUser.userId,
    });
  });

  it.skip('disables the button when audioPlayer is undefined', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      forwardAudio: mockForwardAudio,
      audioPlayer: undefined,
    });
    render(<AudioNext />);
    const buttonElement = screen.getByTestId('forward-button');
    expect(buttonElement).toBeDisabled();
  });
});
