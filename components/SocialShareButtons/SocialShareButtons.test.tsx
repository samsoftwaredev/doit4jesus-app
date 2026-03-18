import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';

import { useLanguageContext } from '@/context/LanguageContext';
import { getTheme } from '@/styles/mui-overwrite';

import SocialShareButtons from './SocialShareButtons';

jest.mock('@/context/LanguageContext', () => ({
  useLanguageContext: jest.fn(),
}));

jest.mock('@/utils/shareCardGenerator', () => ({
  generateShareCard: jest.fn(),
  canvasToBlob: jest
    .fn()
    .mockResolvedValue(new Blob(['img'], { type: 'image/png' })),
}));

const theme = getTheme('dark');

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockTranslations = {
  twitterX: 'Twitter / X',
  facebook: 'Facebook',
  whatsApp: 'WhatsApp',
  instagramDownloadShare: 'Instagram (download & share)',
  copyLink: 'Copy Link',
  saveImage: 'Save Image',
  saving: 'Saving...',
  share: 'Share',
  copied: 'Copied!',
};

const defaultProps = {
  shareUrl: 'https://doit4jesus.com/share/123',
  shareText: 'Check out my prayer stats!',
  cardData: {
    userName: 'Test User',
    rosariesPrayed: 42,
    prayerStreak: 7,
    levelName: 'Prayer Warrior',
    motivatingMessage: 'Keep going!',
    siteUrl: 'https://doit4jesus.com',
  },
};

describe('SocialShareButtons Component', () => {
  beforeEach(() => {
    (useLanguageContext as jest.Mock).mockReturnValue({ t: mockTranslations });
  });

  it('renders social platform icons', () => {
    renderWithTheme(<SocialShareButtons {...defaultProps} />);
    expect(screen.getByRole('link', { name: /x/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('renders instagram download button', () => {
    renderWithTheme(<SocialShareButtons {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /instagram/i }),
    ).toBeInTheDocument();
  });

  it('renders copy link button', () => {
    renderWithTheme(<SocialShareButtons {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /copy link/i }),
    ).toBeInTheDocument();
  });

  it('renders the save image button', () => {
    renderWithTheme(<SocialShareButtons {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /save image/i }),
    ).toBeInTheDocument();
  });

  it('copies link to clipboard on copy button click', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
    renderWithTheme(<SocialShareButtons {...defaultProps} />);
    const copyBtn = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      defaultProps.shareUrl,
    );
  });

  it('generates correct social share URLs', () => {
    renderWithTheme(<SocialShareButtons {...defaultProps} />);
    const twitterLink = screen.getByRole('link', { name: /x/i });
    expect(twitterLink).toHaveAttribute(
      'href',
      expect.stringContaining('twitter.com/intent/tweet'),
    );

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    expect(facebookLink).toHaveAttribute(
      'href',
      expect.stringContaining('facebook.com/sharer'),
    );

    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });
    expect(whatsappLink).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me'),
    );
  });
});
