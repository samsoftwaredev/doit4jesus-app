import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { type Milestone } from '@/constants/milestones';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useLanguageContext } from '@/context/LanguageContext';

interface Props {
  milestone: Milestone | null;
  open: boolean;
  onClose: () => void;
}

const MilestoneModal = ({ milestone, open, onClose }: Props) => {
  const { t } = useLanguageContext();
  const router = useRouter();
  const theme = useTheme();

  if (!milestone) return null;

  const handleShare = () => {
    onClose();
    router.push(NAV_APP_LINKS.shareStats.link);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.primary.dark})`,
          color: theme.palette.text.primary,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.gold.main, 0.3)}`,
          overflow: 'visible',
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: alpha(theme.palette.text.primary, 0.6),
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ textAlign: 'center', py: 5 }}>
        {/* Trophy icon with glow */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.gold.main, 0.15),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: `0 0 40px ${alpha(theme.palette.gold.main, 0.3)}`,
          }}
        >
          <EmojiEventsIcon
            sx={{ fontSize: 48, color: theme.palette.gold.main }}
          />
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: theme.palette.gold.main, mb: 1 }}
        >
          {milestone.label}
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: alpha(theme.palette.text.primary, 0.9), mb: 3 }}
        >
          {milestone.message}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: alpha(theme.palette.text.primary, 0.6), mb: 4 }}
        >
          {t.shareAchievement}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: alpha(theme.palette.text.primary, 0.3),
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.text.disabled,
              },
            }}
          >
            {t.later}
          </Button>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{
              bgcolor: theme.palette.gold.main,
              color: theme.palette.gold.contrastText,
              fontWeight: 'bold',
              '&:hover': { bgcolor: theme.palette.gold.light },
            }}
          >
            {t.shareNow}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneModal;
