import { Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/classes';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { Challenge } from '@/interfaces';
import blueRosary from '@/public/assets/images/blueRosary.jpeg';

const challengeId = 'b3344247-8940-43b9-b8f4-ed1196e99d06';

const RosaryWinnerChallenge = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);
  const [challengeData, setChallengeData] = useState<Challenge | null>(null);

  const getChallengeInfo = async () => {
    let { data: challenges, error } = await db
      .getChallenges()
      .select('*')
      .eq('id', challengeId);
    if (error) {
      console.error('Error fetching challenges:', error);
      return;
    }
    if (challenges && challenges.length > 0) {
      const challenge = challenges[0];
      setChallengeData(challenge);
    }
  };

  const onAcceptChallenge = () => {
    setAcceptedChallenge(true);
    toast.success('You have joined the challenge! Good luck warrior!');
    // TODO: add user to challenge with edge function
  };

  useEffect(() => {
    getChallengeInfo();
  }, []);

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={3} md={3} textAlign="center" alignSelf="center">
        <Image
          style={{ borderRadius: '20%' }}
          width={100}
          height={100}
          src={blueRosary}
          alt="A Rosary with blue beads"
        />
      </Grid>
      <Grid item xs={12} sm={9} md={9}>
        <Typography fontWeight="bold" textAlign={{ xs: 'center', sm: 'left' }}>
          {challengeData?.title}
        </Typography>
        {acceptedChallenge ? (
          <Box display="flex" alignItems="center" justifyContent="center">
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
              /{challengeData?.goal_amount}
            </Typography>
          </Box>
        ) : (
          <Box my={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Button
              onClick={onAcceptChallenge}
              color="success"
              variant="contained"
            >
              Accept the Challenge
            </Button>
          </Box>
        )}
        <Typography fontSize="small">{challengeData?.description}</Typography>
      </Grid>
    </Grid>
  );
};

export default RosaryWinnerChallenge;
