import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { getTheme } from '@/styles/mui-overwrite';

import ShareStatsButton from './ShareStatsButton';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

const theme = getTheme('dark');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ShareStatsButton Component', () => {
  it('renders the share stats button', () => {
    renderWithTheme(<ShareStatsButton />);
    expect(
      screen.getByRole('button', { name: /share stats/i }),
    ).toBeInTheDocument();
  });

  it('navigates to share stats page when clicked', () => {
    const mockPush = jest.fn();
    const useRouter = require('next/navigation').useRouter;
    useRouter.mockReturnValue({ push: mockPush });

    renderWithTheme(<ShareStatsButton />);
    screen.getByRole('button', { name: /share stats/i }).click();
    expect(mockPush).toHaveBeenCalledWith('/app/share-stats');
  });
});
