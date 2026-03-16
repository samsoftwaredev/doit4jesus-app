import { render, screen } from '@testing-library/react';

import AllEventSection from './AllEventSection';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('../../CountdownDate', () => ({
  __esModule: true,
  default: () => <div data-testid="countdown" />,
}));

jest.mock('../../YouTubeSubscribe', () => ({
  __esModule: true,
  default: () => <div data-testid="yt-subscribe" />,
}));

describe('AllEventSection Component', () => {
  it('renders no events message when events is null', () => {
    render(<AllEventSection events={null} />);
    expect(screen.getByText('No events')).toBeInTheDocument();
  });

  it('renders event cards when events are provided', () => {
    const events = [
      {
        id: '1',
        title: 'Test Event',
        description: 'A test event',
        image_url: 'https://example.com/img.jpg',
        date: '2025-12-25',
        slug: 'test-event',
        video_url: '',
      },
    ];
    render(<AllEventSection events={events as any} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });
});
