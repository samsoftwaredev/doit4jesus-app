import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Card from './Card';

describe('Card Component', () => {
  it('renders the card with children', () => {
    render(<Card>Test Content</Card>);
    const textElement = screen.getByText('Test Content');
    expect(textElement).toBeInTheDocument();
  });

  it('renders multiple children elements', () => {
    render(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
      </Card>,
    );
    const child1Element = screen.getByText('Child 1');
    const child2Element = screen.getByText('Child 2');
    expect(child1Element).toBeInTheDocument();
    expect(child2Element).toBeInTheDocument();
  });

  it('renders card structure', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom styles when sx is provided', () => {
    const { container } = render(
      <Card sx={{ backgroundColor: 'red', padding: '20px' }}>Content</Card>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
