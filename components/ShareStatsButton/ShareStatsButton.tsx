import ShareIcon from '@mui/icons-material/Share';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { NAV_APP_LINKS } from '@/constants/nav';

const ShareStatsButton = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      startIcon={<ShareIcon />}
      onClick={() => router.push(NAV_APP_LINKS.shareStats.link)}
      sx={{
        bgcolor: theme.palette.gold.main,
        color: theme.palette.gold.contrastText,
        fontWeight: 'bold',
        '&:hover': { bgcolor: theme.palette.gold.light },
      }}
    >
      Share Stats
    </Button>
  );
};

export default ShareStatsButton;
