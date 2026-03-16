import { render } from '@testing-library/react';

import HowItWorks from './HowItWorks';

describe('HowItWorks Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<HowItWorks />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the heading', () => {
    const { getByText } = render(<HowItWorks />);
    expect(getByText('How It Works')).toBeInTheDocument();
  });

  it('renders three step cards', () => {
    const { getByText } = render(<HowItWorks />);
    expect(getByText('Sign Up')).toBeInTheDocument();
    expect(getByText('Choose a Mystery')).toBeInTheDocument();
    expect(getByText('Pray Together')).toBeInTheDocument();
  });
});
