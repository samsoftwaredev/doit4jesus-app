import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import StarButton from './StarButton';

describe('StarButton Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders the star button', () => {
    render(<StarButton onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders unclicked star icon by default', () => {
    const { container } = render(<StarButton onClick={mockOnClick} />);
    const starBorderIcon = container.querySelector(
      '[data-testid="StarBorderIcon"]',
    );
    expect(starBorderIcon).toBeInTheDocument();
  });

  it('calls onClick with true when clicked from unclicked state', () => {
    render(<StarButton onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');

    fireEvent.click(buttonElement);

    expect(mockOnClick).toHaveBeenCalledWith(true);
  });

  it('toggles to filled star icon when clicked', () => {
    const { container } = render(<StarButton onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');

    fireEvent.click(buttonElement);

    const starIcon = container.querySelector('[data-testid="StarIcon"]');
    expect(starIcon).toBeInTheDocument();
  });

  it('calls onClick with false when clicked from clicked state', () => {
    render(<StarButton onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button');

    fireEvent.click(buttonElement); // First click
    mockOnClick.mockClear();
    fireEvent.click(buttonElement); // Second click

    expect(mockOnClick).toHaveBeenCalledWith(false);
  });
});
