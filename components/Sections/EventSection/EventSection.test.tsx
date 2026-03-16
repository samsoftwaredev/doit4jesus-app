import { render, screen, waitFor } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import EventSection from './EventSection';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('@/classes', () => ({
  db: {
    getEventMessages: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    }),
    insertEventMessage: jest.fn().mockResolvedValue({ error: null }),
    deleteEventMessage: jest.fn().mockResolvedValue({ error: null }),
    updateEventMessage: jest.fn().mockResolvedValue({ error: null }),
  },
  supabase: {
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn(),
      untrack: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('moment', () => {
  const m = () => ({ fromNow: () => '5 minutes ago', format: () => '12:00' });
  m.duration = () => ({ humanize: () => '5 minutes' });
  return m;
});

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components', () => ({
  ChatList: () => <div data-testid="chat-list" />,
  ChatTextbox: () => <div data-testid="chat-textbox" />,
}));

jest.mock('@/utils', () => ({
  normalizeEventMessages: jest.fn().mockReturnValue([]),
}));

jest.mock('./DeleteMessageDialog', () => ({
  __esModule: true,
  default: () => <div data-testid="delete-dialog" />,
}));

const mockEvent = {
  video_url: 'https://example.com/video',
  title: 'Test Event',
  description: 'Test description',
  date: '2025-01-01',
  id: 1,
  slug: 'test',
  image_url: '',
  event_source: 'yt-1',
  picture_url: '',
};

describe('EventSection Component', () => {
  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1', firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders the event title', async () => {
    render(<EventSection videoEvent={mockEvent as any} />);
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });
});
