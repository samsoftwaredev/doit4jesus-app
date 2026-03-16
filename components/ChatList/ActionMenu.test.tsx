import { render, screen } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import ActionMenu from './ActionMenu';

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

describe('ActionMenu Component', () => {
  const mockMessage = {
    id: 'msg-1',
    userId: 'user-1',
    message: 'Hello',
  } as any;

  it('renders the menu button', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { userId: 'user-1' },
    });
    render(
      <ActionMenu
        message={mockMessage}
        onClickDelete={jest.fn()}
        onClickEdit={jest.fn()}
        handleReport={jest.fn()}
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
