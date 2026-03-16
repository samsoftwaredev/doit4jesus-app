import { render, screen } from '@testing-library/react';

import YouTubeSubscribe from './YouTubeSubscribe';

jest.mock('next/script', () => ({
  __esModule: true,
  default: (props: any) => <script data-testid="script" {...props} />,
}));

describe('YouTubeSubscribe Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<YouTubeSubscribe />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
