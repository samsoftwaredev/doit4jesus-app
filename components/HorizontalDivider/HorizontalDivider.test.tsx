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

  it('should render translated "or" text', () => {
    renderWithContext(<HorizontalDivider />);
    const textElement = screen.getByText(/or|o/i);
    expect(textElement).toBeInTheDocument();
  });

  it('should have correct structure with bar and text', () => {
    const { container } = renderWithContext(<HorizontalDivider />);
    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.childNodes.length).toBeGreaterThanOrEqual(2);
  });
});
