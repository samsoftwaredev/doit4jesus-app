import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import MilestoneModal from './MilestoneModal';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

const theme = getTheme('dark');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MilestoneModal Component', () => {
  const mockMilestone = {
    id: 'milestone-1',
    threshold: 10,
    count: 10,
    label: '10 Rosaries!',
    message: 'You prayed 10 rosaries. Keep going!',
  };

  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({
      t: {
        shareAchievement: 'Share this achievement',
        later: 'Later',
        shareNow: 'Share Now',
      },
    });
  });

  it('renders nothing when milestone is null', () => {
    const { container } = renderWithTheme(
      <MilestoneModal milestone={null} open={true} onClose={jest.fn()} />,
    );
    expect(container.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
  });

  it('renders milestone label and message when open', () => {
    renderWithTheme(
      <MilestoneModal
        milestone={mockMilestone}
        open={true}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('10 Rosaries!')).toBeInTheDocument();
    expect(
      screen.getByText('You prayed 10 rosaries. Keep going!'),
    ).toBeInTheDocument();
  });

  it('renders Later and Share Now buttons', () => {
    renderWithTheme(
      <MilestoneModal
        milestone={mockMilestone}
        open={true}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText('Later')).toBeInTheDocument();
    expect(screen.getByText('Share Now')).toBeInTheDocument();
  });

  it('calls onClose when Later button is clicked', () => {
    const mockOnClose = jest.fn();
    renderWithTheme(
      <MilestoneModal
        milestone={mockMilestone}
        open={true}
        onClose={mockOnClose}
      />,
    );
    screen.getByText('Later').click();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
