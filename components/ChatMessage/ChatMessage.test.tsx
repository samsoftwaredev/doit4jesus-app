import { render, screen } from '@testing-library/react';

import ChatMessage from './ChatMessage';

jest.mock('moment', () => {
  const momentMock = () => ({ fromNow: () => '5 minutes ago' });
  momentMock.duration = jest.fn();
  return { __esModule: true, default: momentMock };
});

jest.mock('../UserBubble', () => ({
  __esModule: true,
  default: () => <div data-testid="user-bubble" />,
}));

jest.mock('@/utils', () => ({
  dollarFormatter: (val: number) => `$${val.toFixed(2)}`,
}));

describe('ChatMessage Component', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    pictureUrl: 'https://example.com/pic.jpg',
  };

  it('renders user name', () => {
    render(<ChatMessage user={mockUser}>Hello world</ChatMessage>);
    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Doe/)).toBeInTheDocument();
  });

  it('renders message content', () => {
    render(<ChatMessage user={mockUser}>Hello world</ChatMessage>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders user bubble', () => {
    render(<ChatMessage user={mockUser}>Hello</ChatMessage>);
    expect(screen.getByTestId('user-bubble')).toBeInTheDocument();
  });

  it('shows "message deleted" when deletedAt is set', () => {
    render(
      <ChatMessage user={mockUser} deletedAt="2024-01-01">
        Original message
      </ChatMessage>,
    );
    expect(screen.getByText('The message was deleted.')).toBeInTheDocument();
  });

  it('shows "updated" text when updatedAt is set', () => {
    render(
      <ChatMessage user={mockUser} updatedAt="2024-01-01">
        Edited message
      </ChatMessage>,
    );
    expect(screen.getByText('updated')).toBeInTheDocument();
  });

  it('renders time ago', () => {
    render(<ChatMessage user={mockUser}>Test</ChatMessage>);
    expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
  });
});
