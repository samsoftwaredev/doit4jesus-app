import { render, screen } from '@testing-library/react';

import Pulse from './Pulse';

describe('Pulse Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Pulse />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have the correct CSS class', () => {
    const { container } = render(<Pulse />);
    const pulseElement = container.firstChild;
    expect(pulseElement).toHaveClass('pulseLoader');
  });

  it('should render a div element', () => {
    const { container } = render(<Pulse />);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
