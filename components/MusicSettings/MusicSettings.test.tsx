import { render } from '@testing-library/react';

import MusicSettings from './MusicSettings';

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
