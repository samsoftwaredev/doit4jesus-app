import { render } from '@testing-library/react';

import YouTubeVideo from './YouTubeVideo';

jest.mock('@/classes', () => ({
  YouTubeClass: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    init: jest.fn(),
    loadVideo: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    destroy: jest.fn(),
    stop: jest.fn(),
    setLoop: jest.fn(),
    setSpeed: jest.fn(),
    seekTo: jest.fn(),
    setVolume: jest.fn(),
  })),
}));

jest.mock('@/utils', () => ({
  generateRandomStringId: jest.fn().mockReturnValue('test123'),
  isClientSideRender: jest.fn().mockReturnValue(true),
}));

describe('YouTubeVideo Component', () => {
  it('renders the video container', () => {
    const { container } = render(
      <YouTubeVideo
        id="test-video"
        onChange={jest.fn()}
        setAudioTimer={jest.fn()}
        setAudioProgress={jest.fn()}
      />,
    );
    expect(
      container.querySelector('#youtube-container-test123'),
    ).toBeInTheDocument();
  });
});
