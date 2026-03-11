import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import OnlineUsers from './OnlineUsers';

const mockUsers = [
  {
    userId: 'user1',
    pictureUrl: 'https://example.com/user1.jpg',
    fullName: 'John Doe',
  },
  {
    userId: 'user2',
    pictureUrl: 'https://example.com/user2.jpg',
    fullName: 'Jane Smith',
  },
];

jest.mock('../UserBubble', () => ({
  __esModule: true,
  default: ({ userName, userId }: any) => (
    <div data-testid={`user-bubble-${userId}`}>{userName}</div>
  ),
}));

describe('OnlineUsers Component', () => {
  it('renders the online users list', () => {
    render(<OnlineUsers users={mockUsers} />);
    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
  });

  it('renders all user bubbles', () => {
    render(<OnlineUsers users={mockUsers} />);
    const user1Element = screen.getByTestId('user-bubble-user1');
    const user2Element = screen.getByTestId('user-bubble-user2');
    expect(user1Element).toBeInTheDocument();
    expect(user2Element).toBeInTheDocument();
  });

  it('renders empty list when no users provided', () => {
    const { container } = render(<OnlineUsers />);
    const listElement = container.querySelector('ul');
    expect(listElement).toBeInTheDocument();
    expect(listElement?.children).toHaveLength(0);
  });

  it('renders empty list when users array is empty', () => {
    const { container } = render(<OnlineUsers users={[]} />);
    const listElement = container.querySelector('ul');
    expect(listElement?.children).toHaveLength(0);
  });
});
