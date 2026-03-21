import { Box, Grid, Typography } from '@mui/material';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const RosaryStreak = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const streakNum = user?.stats?.currentStreak ?? 0;
  const hasStreak = streakNum === 1;
  const hasLongStreak = streakNum > 2;
  const hasFlame = streakNum > 4;

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={{ xs: 12, md: 9 }}>
        <Typography textAlign="center" fontWeight="bold">
          {t.yourRosaryStreak}
        </Typography>
        <Typography fontSize="small" textAlign="center">
          {t.canYouPrayDaily}
        </Typography>
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {hasFlame && (
            <Box position="absolute">
              <Typography fontSize="4em">🔥</Typography>
            </Box>
          )}
          <Typography
            sx={{
              zIndex: 300,
              fontWeight: '900',
              fontSize: '3em',
              textShadow: '0 0 10px rgb(98, 61, 4)',
            }}
          >
            {streakNum}
          </Typography>
        </Box>
        {hasLongStreak && (
          <Typography fontSize="small" textAlign="center">
            🔥{streakNum} {t.daysInARow}
          </Typography>
        )}
        {hasStreak && (
          <Typography fontSize="small" textAlign="center">
            {t.keepStreakGoing}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default RosaryStreak;
