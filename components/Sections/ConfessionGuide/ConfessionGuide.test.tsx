import { render, screen } from '@testing-library/react';

import ConfessionGuide from './ConfessionGuide';

jest.mock('@/components', () => ({
  CardDeck: () => <div data-testid="card-deck" />,
  SelectExamOfConscience: ({ onExamSelected }: any) => (
    <div data-testid="select-exam" onClick={() => onExamSelected('adult')}>
      Select Exam
    </div>
  ),
}));

jest.mock('@/data/adultExamOfConscience.json', () => [], { virtual: true });
jest.mock('@/data/childExamOfConscience.json', () => [], { virtual: true });
jest.mock('@/data/teenExamOfConscience.json', () => [], { virtual: true });

describe('ConfessionGuide Component', () => {
  it('renders the select exam screen initially', () => {
    render(<ConfessionGuide />);
    expect(screen.getByTestId('select-exam')).toBeInTheDocument();
  });

  it('renders warning alert', () => {
    render(<ConfessionGuide />);
    expect(screen.getByText(/scrupulosity/i)).toBeInTheDocument();
  });
});
