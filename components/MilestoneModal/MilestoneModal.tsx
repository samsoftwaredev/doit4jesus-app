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
import { useRouter } from 'next/navigation';

import { type Milestone } from '@/constants/milestones';
import { NAV_APP_LINKS } from '@/constants/nav';

interface Props {
  milestone: Milestone | null;
  open: boolean;
  onClose: () => void;
}

const MilestoneModal = ({ milestone, open, onClose }: Props) => {
  const router = useRouter();

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
          background: 'linear-gradient(135deg, #0a0e27, #1a237e)',
          color: '#fff',
          borderRadius: 3,
          border: '1px solid rgba(255, 215, 0, 0.3)',
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
          color: 'rgba(255,255,255,0.6)',
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
            bgcolor: 'rgba(255, 215, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 48, color: '#ffd700' }} />
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: '#ffd700', mb: 1 }}
        >
          {milestone.label}
        </Typography>

        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
          {milestone.message}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}
        >
          Share your achievement and inspire others to join the battle!
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            Later
          </Button>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{
              bgcolor: '#ffd700',
              color: '#0a0e27',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#ffed4a' },
            }}
          >
            Share Now
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneModal;
