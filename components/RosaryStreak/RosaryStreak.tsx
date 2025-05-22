import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { supabase } from '@/classes/index';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const FlameAnimation = () => {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 24,
        height: 56,
        position: 'relative',
        marginLeft: 8,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: 38,
          height: 58,
          borderRadius: '50% 50% 40% 40%',
          background:
            'radial-gradient(ellipse at center, #ffecb3 0%, #ff9800 60%, #e65100 100%)',
          boxShadow: '0 0 12px 4px #ff9800',
          animation: 'flameFlicker 2.5s infinite ease-in-out',
          zIndex: 1,
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 6,
          transform: 'translateX(-50%) scale(0.7)',
          width: 12,
          height: 18,
          borderRadius: '50% 50% 40% 40%',
          background:
            'radial-gradient(ellipse at center, #fffde7 0%, #ffd54f 70%, #ff9800 100%)',
          opacity: 0.8,
          animation: 'flameFlickerSmall 2.2s infinite ease-in-out',
          zIndex: 2,
        }}
      />
      <style>
        {`
          @keyframes flameFlicker {
            0% { transform: translateX(-50%) scaleY(1) scaleX(1); opacity: 1; }
            20% { transform: translateX(-48%) scaleY(1.05) scaleX(0.98); opacity: 0.95; }
            40% { transform: translateX(-52%) scaleY(0.98) scaleX(1.02); opacity: 0.98; }
            60% { transform: translateX(-50%) scaleY(1.04) scaleX(0.97); opacity: 1; }
            80% { transform: translateX(-51%) scaleY(1.01) scaleX(1.01); opacity: 0.97; }
            100% { transform: translateX(-50%) scaleY(1) scaleX(1); opacity: 1; }
          }
          @keyframes flameFlickerSmall {
            0% { transform: translateX(-50%) scale(0.7); opacity: 0.8; }
            25% { transform: translateX(-51%) scale(0.75); opacity: 0.85; }
            50% { transform: translateX(-49%) scale(0.68); opacity: 0.8; }
            75% { transform: translateX(-50%) scale(0.73); opacity: 0.83; }
            100% { transform: translateX(-50%) scale(0.7); opacity: 0.8; }
          }
              `}
      </style>
    </span>
  );
};

const RosaryStreak = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [streakNum, setStreakNum] = useState<number | null>(0);
  const hasStreak = streakNum && streakNum > 0;
  const hasLongStreak = hasStreak && streakNum > 2;

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
        <Typography fontSize="small" textAlign="center">
          Can you pray one rosary daily?
        </Typography>
        <Box
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box position="absolute">{hasLongStreak && <FlameAnimation />}</Box>
          <Typography
            sx={{
              zIndex: 300,
              fontWeight: '900',
              fontSize: '3em',
              textShadow: '0 0 10px rgb(98, 61, 4)',
              pl: 1,
              pb: 1,
            }}
          >
            {streakNum}
          </Typography>
        </Box>
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
