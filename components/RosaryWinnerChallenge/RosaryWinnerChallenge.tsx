import { Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import blueRosary from '@/public/assets/images/blueRosary.jpeg';

const RosaryWinnerChallenge = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState(false);

  const onClick = () => {};

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={9} md={9}>
        <Typography textAlign="center" fontWeight="bold">
          Your Rosary Awaits — Enter to Win!
        </Typography>
        <Box
          textAlign="center"
          display={'flex'}
          alignItems="center"
          justifyContent="center"
        >
          {hasJoinedChallenge ? (
            <>
              <Typography
                sx={{ fontWeight: '900', color: 'error.main', fontSize: '3em' }}
              >
                {user?.stats.rosaryTotalCount}
              </Typography>
              <Typography
                sx={{
                  fontWeight: '900',
                  color: 'success.main',
                  fontSize: '3em',
                }}
              >
                /100
              </Typography>
            </>
          ) : (
            <Box my={2}>
              <Button
                onClick={onClick}
                fullWidth
                color="success"
                variant="contained"
              >
                Join the Challenge
              </Button>
            </Box>
          )}
        </Box>
        <Typography fontSize="small" textAlign="center">
          Pray one rosary daily for 100 days, and we’ll send you a rosary.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3} md={3} textAlign="center" alignSelf="center">
        <Image
          style={{ borderRadius: '20%' }}
          width={100}
          height={100}
          src={blueRosary}
          alt="A Rosary with blue beads"
        />
      </Grid>
    </Grid>
  );
};

export default RosaryWinnerChallenge;
