import { fireEvent, render, screen } from '@testing-library/react';

import { useThemeContext } from '@/context/ThemeContext';

import ThemeToggle from './ThemeToggle';

jest.mock('@/context/ThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

describe('ThemeToggle Component', () => {
  const mockToggleTheme = jest.fn();

  it('renders light mode icon when in dark mode', () => {
    (useThemeContext as jest.Mock).mockReturnValue({
      mode: 'dark',
      toggleTheme: mockToggleTheme,
    });
    render(<ThemeToggle />);
    const button = screen.getByLabelText('toggle theme');
    expect(button).toBeInTheDocument();
  });

  it('renders dark mode icon when in light mode', () => {
    (useThemeContext as jest.Mock).mockReturnValue({
      mode: 'light',
      toggleTheme: mockToggleTheme,
    });
    render(<ThemeToggle />);
    const button = screen.getByLabelText('toggle theme');
    expect(button).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    (useThemeContext as jest.Mock).mockReturnValue({
      mode: 'dark',
      toggleTheme: mockToggleTheme,
    });
    render(<ThemeToggle />);
    const button = screen.getByLabelText('toggle theme');
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
