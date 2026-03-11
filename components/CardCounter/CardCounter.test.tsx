import { render, screen } from '@testing-library/react';

import CardCounter from './CardCounter';

describe('CardCounter Component', () => {
  const mockCards = [
    { id: '1', title: 'Card 1' },
    { id: '2', title: 'Card 2' },
    { id: '3', title: 'Card 3' },
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

  it('should return null when cards is not an array', () => {
    const { container } = render(
      <CardCounter cards={null as any} counter={1} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render with dark theme by default', () => {
    const { container } = render(<CardCounter cards={mockCards} counter={2} />);
    const counterElement = container.firstChild;
    expect(counterElement).toHaveClass('theme-dark');
  });

  it('should render with light theme when specified', () => {
    const { container } = render(
      <CardCounter cards={mockCards} counter={2} theme="light" />,
    );
    const counterElement = container.firstChild;
    expect(counterElement).toHaveClass('theme-light');
  });

  it('should update counter correctly', () => {
    const { rerender } = render(<CardCounter cards={mockCards} counter={1} />);
    expect(screen.getByText('1/3')).toBeInTheDocument();

    rerender(<CardCounter cards={mockCards} counter={2} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });
});
