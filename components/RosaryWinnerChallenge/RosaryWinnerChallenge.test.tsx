import { render, screen } from '@testing-library/react';

import { useUserContext } from '@/context/UserContext';

import RosaryWinnerChallenge from './RosaryWinnerChallenge';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn().mockReturnValue({ t: {} }),
}));

jest.mock('@/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

describe('RosaryWinnerChallenge Component', () => {
  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { stats: { rosaryTotalCount: 42 } },
    });
  });

  it('renders the challenge title', () => {
    render(<RosaryWinnerChallenge />);
    expect(
      screen.getByText('Your Rosary Awaits — Enter to Win!'),
    ).toBeInTheDocument();
  });

  it('renders the join button', () => {
    render(<RosaryWinnerChallenge />);
    expect(
      screen.getByRole('button', { name: /join the challenge/i }),
    ).toBeInTheDocument();
  });

  it('renders the rosary image', () => {
    render(<RosaryWinnerChallenge />);
    expect(screen.getByAltText('A Rosary with blue beads')).toBeInTheDocument();
  });
});
