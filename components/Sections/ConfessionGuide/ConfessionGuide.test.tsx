import { render, screen } from '@testing-library/react';

import ConfessionGuide from './ConfessionGuide';

jest.mock('@/components', () => ({
  SelectExamOfConscience: () => (
    <div data-testid="select-exam">Select Exam</div>
  ),
}));

describe('ConfessionGuide Component', () => {
  it('renders the select exam screen', () => {
    render(<ConfessionGuide />);
    expect(screen.getByTestId('select-exam')).toBeInTheDocument();
  });
});
