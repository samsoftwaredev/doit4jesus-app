import { render, screen } from '@testing-library/react';

import { useAudioContext } from '@/context/AudioContext';

import MusicVideo from './MusicVideo';

jest.mock('@/context/AudioContext', () => ({
  useAudioContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/app'),
}));

describe('MusicVideo Component', () => {
  it('renders the view video button', () => {
    (useAudioContext as jest.Mock).mockReturnValue({
      goToEvent: jest.fn(),
      audioPlayer: { audio: {} },
    });
    render(<MusicVideo />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
