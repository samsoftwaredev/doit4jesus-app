import { render, screen } from '@testing-library/react';

import MovingText from './MovingText';

describe('MovingText Component', () => {
  it('renders children text', () => {
    render(<MovingText>Now Playing</MovingText>);
    expect(screen.getByText('Now Playing')).toBeInTheDocument();
  });

  it('renders children element', () => {
    render(
      <MovingText>
        <span data-testid="child">Song Title</span>
      </MovingText>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<MovingText />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
