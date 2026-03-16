import { render } from '@testing-library/react';

import Meta from './Meta';

describe('Meta Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Meta />);
    expect(container).toBeTruthy();
  });

  it('renders with custom page title without crashing', () => {
    const { container } = render(<Meta pageTitle="About" />);
    expect(container).toBeTruthy();
  });

  it('renders with default props', () => {
    expect(() => render(<Meta />)).not.toThrow();
  });
});
