import { render } from '@testing-library/react';

import ConfettiCelebration from './ConfettiCelebration';

jest.mock('react-confetti', () => ({
  __esModule: true,
  default: () => <div data-testid="confetti" />,
}));

describe('ConfettiCelebration Component', () => {
  it('renders confetti', () => {
    const { getByTestId } = render(<ConfettiCelebration />);
    expect(getByTestId('confetti')).toBeInTheDocument();
  });
});
