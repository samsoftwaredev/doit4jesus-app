import ShareIcon from '@mui/icons-material/Share';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

import { NAV_APP_LINKS } from '@/constants/nav';

const ShareStatsButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      startIcon={<ShareIcon />}
      onClick={() => router.push(NAV_APP_LINKS.shareStats.link)}
      sx={{
        bgcolor: '#ffd700',
        color: '#0a0e27',
        fontWeight: 'bold',
        '&:hover': { bgcolor: '#ffed4a' },
      }}
    >
      Share Stats
    </Button>
  );
};

export default ShareStatsButton;
