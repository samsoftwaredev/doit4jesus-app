import { render } from '@testing-library/react';

import MusicSettings from './MusicSettings';

jest.mock('next/router', () => ({
  useRouter: jest
    .fn()
    .mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      query: {},
      pathname: '/',
    }),
}));

describe('MusicSettings Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<MusicSettings />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the settings button', () => {
    const { getByRole } = render(<MusicSettings />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
