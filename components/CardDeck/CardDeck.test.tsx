import { fireEvent, render, screen } from '@testing-library/react';

import CardDeck from './CardDeck';

jest.mock('../StarButton', () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    <button data-testid="star-button" onClick={() => onClick(true)} />
  ),
}));

describe('CardDeck Component', () => {
  const mockSteps = [
    { title: 'Step 1', question: 'Q1', description: 'D1', img: '/img1.jpg' },
    { title: 'Step 2', question: 'Q2', description: 'D2', img: '/img2.jpg' },
  ];
  const mockSetActiveStep = jest.fn();

  it('renders the first card', () => {
    render(
      <CardDeck
        steps={mockSteps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />,
    );
    expect(screen.getByText('Q1')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    const { container } = render(
      <CardDeck
        steps={mockSteps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />,
    );
    // Back, Yes, No icon buttons
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});
