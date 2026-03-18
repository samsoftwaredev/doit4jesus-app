import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { getTheme } from '@/styles/mui-overwrite';

import ShareCardPreview from './ShareCardPreview';

jest.mock('@/utils/shareCardGenerator', () => ({
  generateShareCard: jest.fn(),
}));

const theme = getTheme('dark');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ShareCardPreview Component', () => {
  const mockData = {
    userName: 'John',
    rosariesPrayed: 42,
    prayerStreak: 7,
    levelName: 'Prayer Warrior',
    motivatingMessage: 'Keep going!',
    siteUrl: 'https://doit4jesus.com',
  };

  it('renders a canvas element', () => {
    const { container } = renderWithTheme(<ShareCardPreview data={mockData} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('calls generateShareCard with the data', () => {
    const { generateShareCard } = require('@/utils/shareCardGenerator');
    renderWithTheme(<ShareCardPreview data={mockData} />);
    expect(generateShareCard).toHaveBeenCalled();
  });
});
