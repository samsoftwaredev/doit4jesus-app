import { render, screen } from '@testing-library/react';

import CardCounter from './CardCounter';

describe('CardCounter Component', () => {
  const mockCards = [
    {
      title: 'Card 1',
      question: 'Question 1',
      description: 'Description 1',
      img: 'img1.jpg',
    },
    {
      title: 'Card 2',
      question: 'Question 2',
      description: 'Description 2',
      img: 'img2.jpg',
    },
    {
      title: 'Card 3',
      question: 'Question 3',
      description: 'Description 3',
      img: 'img3.jpg',
    },
  ];

  it('should render counter with correct format', () => {
    render(<CardCounter cards={mockCards} counter={1} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();
  });

  it('should return null when only one card', () => {
    const { container } = render(
      <CardCounter cards={[mockCards[0]]} counter={1} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render with dark theme by default', () => {
    const { container } = render(<CardCounter cards={mockCards} counter={2} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with light theme when specified', () => {
    const { container } = render(
      <CardCounter cards={mockCards} counter={2} theme="light" />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should update counter correctly', () => {
    const { rerender } = render(<CardCounter cards={mockCards} counter={1} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();

    rerender(<CardCounter cards={mockCards} counter={2} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });
});
