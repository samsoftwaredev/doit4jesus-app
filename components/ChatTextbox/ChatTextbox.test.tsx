import { fireEvent, render, screen } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import ChatTextbox from './ChatTextbox';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('../UserBubble', () => ({
  __esModule: true,
  default: () => <div data-testid="user-bubble" />,
}));

describe('ChatTextbox Component', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1', firstName: 'John', pictureUrl: '' },
    });
  });

  it('renders the text input', () => {
    render(<ChatTextbox onSendMessage={mockOnSendMessage} />);
    const input = screen.getByPlaceholderText('Add your prayer...');
    expect(input).toBeInTheDocument();
  });

  it('renders send button', () => {
    render(<ChatTextbox onSendMessage={mockOnSendMessage} />);
    const sendButton = screen.getByTestId('SendIcon');
    expect(sendButton).toBeInTheDocument();
  });
});
