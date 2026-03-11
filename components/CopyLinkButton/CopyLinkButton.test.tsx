import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

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
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('should change button text to "Copied!" when clicked', () => {
    render(<CopyLinkButton link={testLink} />);
    const button = screen.getByRole('button', { name: 'Copy' });

    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Copy' }),
    ).not.toBeInTheDocument();
  });

  it('should reset button text back to "Copy" after 1.5 seconds', async () => {
    render(<CopyLinkButton link={testLink} />);
    const button = screen.getByRole('button', { name: 'Copy' });

    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();

    // Fast-forward time by 1.5 seconds
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Copied!' }),
      ).not.toBeInTheDocument();
    });
  });

  it('should handle multiple clicks correctly', () => {
    render(<CopyLinkButton link={testLink} />);
    const button = screen.getByRole('button', { name: 'Copy' });

    // First click
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Second click
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('should render with proper MUI components', () => {
    const { container } = render(<CopyLinkButton link={testLink} />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
