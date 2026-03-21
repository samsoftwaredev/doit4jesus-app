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
    {
      title: 'Step 1',
      question: 'Q1',
      description: 'D1',
      img: '/img1.jpg',
      category: 'single',
      commandment: '1',
      type: 'mortal',
      counsels: ['Seek guidance from a priest.'],
      prevention: ['Daily Scripture reading.'],
      saints: ['St. Augustine'],
    },
    {
      title: 'Step 2',
      question: 'Q2',
      description: 'D2',
      img: '/img2.jpg',
      category: 'single',
      commandment: '2',
      type: 'venial',
      counsels: [],
      prevention: [],
      saints: [],
    },
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

  it('shows saints, counsels, and prevention in expanded details', () => {
    render(
      <CardDeck
        steps={mockSteps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />,
    );
    // Expand "More Details" accordion
    fireEvent.click(screen.getByText('More Details'));
    expect(screen.getByText('St. Augustine')).toBeInTheDocument();
    expect(
      screen.getByText('Seek guidance from a priest.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Daily Scripture reading.')).toBeInTheDocument();
  });
});
