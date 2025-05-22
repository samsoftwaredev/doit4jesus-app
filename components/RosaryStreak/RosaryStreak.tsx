import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { supabase } from '@/classes/index';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const RosaryStreak = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [streakNum, setStreakNum] = useState<number | null>(0);

  const getRosaryStreak = async () => {
    const { data, error } = await supabase.functions.invoke(
      'get_rosary_streak',
      {
        body: { user_id: user?.userId },
      },
    );
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
        <Box
          textAlign="center"
          display={'flex'}
          alignItems="center"
          justifyContent="center"
        >
          <Typography sx={{ fontWeight: '900', fontSize: '3em' }}>
            {streakNum}
          </Typography>
        </Box>
        <Typography fontSize="small" textAlign="center">
          Can you pray one rosary daily?
        </Typography>
      </Grid>
    </Grid>
  );
};

export default RosaryStreak;
