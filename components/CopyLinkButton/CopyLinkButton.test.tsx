import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import CopyLinkButton from './CopyLinkButton';

// Mock clipboard functionality
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('CopyLinkButton Component', () => {
  const testLink = 'https://example.com/test-link';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the link text', () => {
    render(<CopyLinkButton link={testLink} />);
    expect(screen.getByText(testLink)).toBeInTheDocument();
  });

  it('should render Copy button initially', () => {
    render(<CopyLinkButton link={testLink} />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('should change button text to "Copied!" when clicked', () => {
    render(<CopyLinkButton link={testLink} />);
    const button = screen.getByText('Copy');

    fireEvent.click(button);

    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  it('should reset button text back to "Copy" after 1.5 seconds', async () => {
    render(<CopyLinkButton link={testLink} />);
    const button = screen.getByText('Copy');

    fireEvent.click(button);
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    // Fast-forward time by 1.5 seconds
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
  });

  it('should handle multiple clicks correctly', () => {
    render(<CopyLinkButton link={testLink} />);
    const button = screen.getByText('Copy');

    // First click
    fireEvent.click(button);
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    // Fast-forward time
    jest.advanceTimersByTime(1500);

    // Second click
    fireEvent.click(screen.getByText('Copy'));
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('should render with proper MUI components', () => {
    const { container } = render(<CopyLinkButton link={testLink} />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
