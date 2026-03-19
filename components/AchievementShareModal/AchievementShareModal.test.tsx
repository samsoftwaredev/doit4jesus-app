import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { BadgeRequirementType } from '@/interfaces/achievements';
import { getTheme } from '@/styles/mui-overwrite';

import AchievementShareModal from './AchievementShareModal';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/components/BadgeShareCardPreview', () => {
  return function MockBadgeShareCardPreview() {
    return <div data-testid="badge-share-card-preview" />;
  };
});

jest.mock('@/components/Dialog', () => {
  return function MockDialog({
    open,
    children,
    modalTitle,
  }: {
    open: boolean;
    children: React.ReactNode;
    modalTitle: string;
    handleClose: () => void;
    fullWidth: boolean;
  }) {
    if (!open) return null;
    return (
      <div data-testid="dialog">
        <div>{modalTitle}</div>
        {children}
      </div>
    );
  };
});

const theme = getTheme('dark');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockTranslations = {
  achievementShareModalTitle: 'Share Achievement',
  achievementPreviewModalTitle: 'Badge Preview',
  achievementEarned: 'Earned',
  achievementLocked: 'Locked',
  achievementShareWithFriends: 'Share with Friends',
  achievementCopyLink: 'Copy Link',
  achievementLockedPreviewDescription:
    'Keep going. This preview shows what you are working toward, and the share options unlock once the badge is earned.',
  achievementEarnedOn: 'Earned',
  achievementEarnedBy: 'Earned by',
  achievementShareEncouragement: 'Share this encouragement',
  achievementWhatsApp: 'WhatsApp',
  achievementEmail: 'Email',
  achievementEmailSubjectPrefix: 'Check out my badge:',
};

const earnedBadge = {
  id: 'achievement-share-modal',
  displayOrder: 1,
  badgeKey: 'first_rosary',
  name: 'First Rosary',
  description: 'Prayed your first rosary',
  iconName: 'favorite',
  category: 'prayer' as const,
  requirementType: 'count' as BadgeRequirementType,
  requirementValue: 1,
  requirementLabel: '1 rosary',
  progressCurrent: 1,
  progressPercent: 100,
  remainingCount: 0,
  isEarned: true,
  earnedAt: '2025-01-01T00:00:00Z',
  shareMessage: 'I earned First Rosary!',
  verseText: 'For God so loved the world...',
  verseReference: 'John 3:16',
};

const lockedBadge = {
  ...earnedBadge,
  badgeKey: 'rosary_warrior',
  name: 'Rosary Warrior',
  isEarned: false,
  earnedAt: undefined,
  progressCurrent: 5,
  progressPercent: 50,
  remainingCount: 5,
};

const defaultProps = {
  badge: earnedBadge,
  open: true,
  shareUrl: 'https://doit4jesus.com/share/badge/first_rosary',
  shareText: 'I earned First Rosary!',
  userName: 'Test User',
  onClose: jest.fn(),
  onShare: jest.fn().mockResolvedValue(undefined),
  onCopy: jest.fn().mockResolvedValue(undefined),
};

describe('AchievementShareModal Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('returns null when badge is null', () => {
    const { container } = renderWithTheme(
      <AchievementShareModal {...defaultProps} badge={null} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the badge name and description', () => {
    renderWithTheme(<AchievementShareModal {...defaultProps} />);
    expect(screen.getByText('First Rosary')).toBeInTheDocument();
    expect(screen.getByText('Prayed your first rosary')).toBeInTheDocument();
  });

  it('renders verse text', () => {
    renderWithTheme(<AchievementShareModal {...defaultProps} />);
    expect(screen.getByText(/For God so loved the world/)).toBeInTheDocument();
  });

  it('renders share and copy buttons for earned badges', () => {
    renderWithTheme(<AchievementShareModal {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /share with friends/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /copy link/i }),
    ).toBeInTheDocument();
  });

  it('renders locked description for locked badges', () => {
    renderWithTheme(
      <AchievementShareModal {...defaultProps} badge={lockedBadge} />,
    );
    expect(screen.getByText(/keep going/i)).toBeInTheDocument();
  });

  it('calls onShare when share button is clicked', () => {
    renderWithTheme(<AchievementShareModal {...defaultProps} />);
    fireEvent.click(
      screen.getByRole('button', { name: /share with friends/i }),
    );
    expect(defaultProps.onShare).toHaveBeenCalledWith(earnedBadge);
  });

  it('calls onCopy when copy button is clicked', () => {
    renderWithTheme(<AchievementShareModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }));
    expect(defaultProps.onCopy).toHaveBeenCalledWith(earnedBadge);
  });

  it('renders badge share card preview', () => {
    renderWithTheme(<AchievementShareModal {...defaultProps} />);
    expect(screen.getByTestId('badge-share-card-preview')).toBeInTheDocument();
  });
});
