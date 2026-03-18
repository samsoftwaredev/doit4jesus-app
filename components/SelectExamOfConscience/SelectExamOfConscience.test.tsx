import { render, screen } from '@testing-library/react';

import SelectExamOfConscience from './SelectExamOfConscience';

describe('SelectExamOfConscience Component', () => {
  const mockOnExamSelected = jest.fn();

  it('renders three exam cards', () => {
    render(<SelectExamOfConscience onExamSelected={mockOnExamSelected} />);
    expect(screen.getByText('For Kids')).toBeInTheDocument();
    expect(screen.getByText('For Teens')).toBeInTheDocument();
    expect(screen.getByText('For Adults')).toBeInTheDocument();
  });

  it('renders the selection heading', () => {
    render(<SelectExamOfConscience onExamSelected={mockOnExamSelected} />);
    expect(
      screen.getByText('Select conscience examination:'),
    ).toBeInTheDocument();
  });
});
