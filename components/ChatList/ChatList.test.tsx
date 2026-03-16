import { render } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import ChatList from './ChatList';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('../ChatMessage', () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="chat-message">{children}</div>
  ),
}));

jest.mock('../ChatTextbox', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-textbox" />,
}));

jest.mock('./ActionMenu', () => ({
  __esModule: true,
  default: () => <div data-testid="action-menu" />,
}));

describe('ChatList Component', () => {
  const mockMessage = {
    id: 'msg-1',
    userId: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    message: 'Hello world',
    createdAt: '2024-01-01',
    updatedAt: null,
    deletedAt: null,
    likes: [],
    donationAmount: 0,
  } as any;

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
  });

  it('renders the chat message', () => {
    const { getByTestId } = render(
      <ChatList
        message={mockMessage}
        handleDelete={jest.fn()}
        handleEdit={jest.fn()}
        handleReport={jest.fn()}
        handleLike={jest.fn()}
      />,
    );
    expect(getByTestId('chat-message')).toBeInTheDocument();
  });
});
