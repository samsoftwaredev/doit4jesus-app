import { fireEvent, render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import AudioPrevious from './AudioPrevious';

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
}));

describe('AudioPrevious', () => {
  const mockBackwardAudio = jest.fn();
  const mockTrack = require('@vercel/analytics').track;
  const mockUser = { userId: '123' };
  const mockAudioPlayer = { audio: {} };

  beforeEach(() => {
    (useAudioContext as jest.Mock).mockReturnValue({
      backwardAudio: mockBackwardAudio,
      audioPlayer: mockAudioPlayer,
    });
    (useLanguageContext as jest.Mock).mockReturnValue({
      t: { backward: 'Backward' },
    });
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders the backward button', () => {
    render(<AudioPrevious />);
    const buttonElement = screen.getByTestId('backward-button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls backwardAudio and tracks event when button is clicked', () => {
    render(<AudioPrevious />);
    const buttonElement = screen.getByTestId('backward-button');
    fireEvent.click(buttonElement);
    expect(mockBackwardAudio).toHaveBeenCalled();
    expect(mockTrack).toHaveBeenCalledWith('BackwardRosaryClicked', {
      userId: mockUser.userId,
    });
  });

  it.skip('disables the button when audioPlayer is undefined', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      backwardAudio: mockBackwardAudio,
      audioPlayer: undefined,
    });
    render(<AudioPrevious />);
    const buttonElement = screen.getByTestId('backward-button');
    expect(buttonElement).toBeDisabled();
  });
});
