import { render, screen } from '@testing-library/react';

import UserBubble from './UserBubble';

jest.mock('../SafeImage', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('UserBubble Component', () => {
  it('renders default icon when no picture provided', () => {
    const { container } = render(<UserBubble userName="John" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders user picture when provided', () => {
    render(
      <UserBubble userName="John" userPicture="https://example.com/pic.jpg" />,
    );
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });

  it('renders with online tooltip message', () => {
    render(<UserBubble userName="John" isOnline />);
    const element = screen.getByLabelText('John is online.');
    expect(element).toBeInTheDocument();
  });
});
