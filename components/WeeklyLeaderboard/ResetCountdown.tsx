import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { getMillisUntilReset } from '@/constants/leaderboardConfig';
import { useLanguageContext } from '@/context/LanguageContext';

const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);

  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const ResetCountdown = () => {
  const { t } = useLanguageContext();
  const theme = useTheme();
  const [remaining, setRemaining] = useState(getMillisUntilReset());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getMillisUntilReset());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Chip
      icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
      label={`${t.weeklyLeaderboardResetsIn} ${formatCountdown(remaining)}`}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        borderColor: alpha(theme.palette.gold.main, 0.3),
        color: theme.palette.text.secondary,
      }}
    />
  );
};

export default ResetCountdown;
