import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { supabase } from '@/classes/index';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import Loading from '../Loading';

const RosaryStreak = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [streakNum, setStreakNum] = useState<number | null>(0);
  const hasStreak = streakNum !== null && streakNum === 1;
  const hasLongStreak = streakNum !== null && streakNum > 2;
  const hasFlame = streakNum !== null && streakNum > 4;

  const getRosaryStreak = async () => {
    const { data, error } = await supabase.functions.invoke(
      'get_rosary_streak',
      {
        body: { user_id: user?.userId },
      },
    );
    setIsLoading(false);
    if (error) {
      console.error(error);
    } else {
      setStreakNum(data.streak);
    }
  };

  useEffect(() => {
    getRosaryStreak();
  }, []);

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={9}>
        <Typography textAlign="center" fontWeight="bold">
          Your Rosary Streak
        </Typography>
        <Typography fontSize="small" textAlign="center">
          Can you pray one rosary daily?
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
          {isLoading ? (
            <Loading isFeature />
          ) : (
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
          )}
        </Box>
        {hasLongStreak && (
          <Typography fontSize="small" textAlign="center">
            🔥{streakNum} days in a row!
          </Typography>
        )}
        {hasStreak && (
          <Typography fontSize="small" textAlign="center">
            Keep the streak going!
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default RosaryStreak;
