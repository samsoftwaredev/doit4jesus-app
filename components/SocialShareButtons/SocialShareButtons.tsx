import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import {
  type ShareCardData,
  canvasToBlob,
  generateShareCard,
} from '@/utils/shareCardGenerator';

interface Props {
  shareUrl: string;
  shareText: string;
  cardData: ShareCardData;
}

const SocialShareButtons = ({ shareUrl, shareText, cardData }: Props) => {
  const { t } = useLanguageContext();
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getCanvas = (): HTMLCanvasElement => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    generateShareCard(canvasRef.current, cardData);
    return canvasRef.current;
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const canvas = getCanvas();
      const blob = await canvasToBlob(canvas);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-prayer-stats.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading share card:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      const canvas = getCanvas();
      const blob = await canvasToBlob(canvas);

      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], 'prayer-stats.png', {
          type: 'image/png',
        });
        const shareData = { text: shareText, url: shareUrl, files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: share without image
      if (navigator.share) {
        await navigator.share({ text: shareText, url: shareUrl });
      }
    } catch (error) {
      // User cancelled sharing — not an error
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Social platform icons */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
        <Tooltip title="Twitter / X">
          <IconButton
            component="a"
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'common.white',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[900]
                  : theme.palette.grey[800],
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.grey[700]
                    : theme.palette.grey[700],
              },
            }}
          >
            <XIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Facebook">
          <IconButton
            component="a"
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'common.white',
              bgcolor: 'info.main',
              '&:hover': { bgcolor: 'info.dark' },
            }}
          >
            <FacebookIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="WhatsApp">
          <IconButton
            component="a"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'common.white',
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Instagram (download & share)">
          <IconButton
            onClick={handleDownloadImage}
            disabled={downloading}
            sx={{
              color: 'common.white',
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.error.dark}, ${theme.palette.secondary.dark}, ${alpha(theme.palette.secondary.main, 0.95)})`
                  : `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.error.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              '&:hover': { opacity: 0.9 },
            }}
          >
            <InstagramIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={t.shareLink ?? 'Copy Link'}>
          <IconButton
            onClick={handleCopyLink}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: theme.palette.grey[700],
              '&:hover': { bgcolor: theme.palette.grey[600] },
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Download & native share buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="outlined"
          onClick={handleDownloadImage}
          disabled={downloading}
          sx={{
            borderColor: theme.palette.gold.main,
            color: theme.palette.gold.main,
            '&:hover': {
              borderColor: theme.palette.gold.light,
              color: theme.palette.gold.light,
            },
          }}
        >
          {downloading ? 'Saving...' : 'Save Image'}
        </Button>

        {'share' in navigator && (
          <Button
            variant="contained"
            onClick={handleNativeShare}
            sx={{
              bgcolor: theme.palette.gold.main,
              color: theme.palette.gold.contrastText,
              fontWeight: 'bold',
              '&:hover': { bgcolor: theme.palette.gold.light },
            }}
          >
            Share
          </Button>
        )}
      </Stack>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Link copied!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default SocialShareButtons;
