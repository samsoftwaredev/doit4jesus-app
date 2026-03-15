import { render, screen } from '@testing-library/react';

import { LanguageContextProvider } from '@/context/LanguageContext';

import HorizontalDivider from './HorizontalDivider';

// Helper to render with context
const renderWithContext = (component: React.ReactElement<any>) => {
  return render(<LanguageContextProvider>{component}</LanguageContextProvider>);
};

describe('HorizontalDivider Component', () => {
  it('should render without crashing', () => {
    const { container } = renderWithContext(<HorizontalDivider />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render the divider bar', () => {
    const { container } = renderWithContext(<HorizontalDivider />);
    const bar = container.querySelector('.bar');
    expect(bar).toBeInTheDocument();
  });

  it('should render translated "or" text', () => {
    renderWithContext(<HorizontalDivider />);
    // The component should render some text (either "or" in English or Spanish)
    const container = screen.getByText(/or|o/i);
    expect(container).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = renderWithContext(<HorizontalDivider />);
    const dividerContainer = container.querySelector('.container');
    expect(dividerContainer).toBeInTheDocument();
    expect(dividerContainer?.children).toHaveLength(2); // bar + text
  });

  it('should have text element with correct class', () => {
    const { container } = renderWithContext(<HorizontalDivider />);
    const textElement = container.querySelector('.text');
    expect(textElement).toBeInTheDocument();
  });
});
