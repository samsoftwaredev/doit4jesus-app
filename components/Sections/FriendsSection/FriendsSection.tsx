import { Box, Container, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { AllFriends, Card, RosaryLevel, RosaryLevelInfo } from '@/components';
import FriendApproval from '@/components/FriendApproval';
import InviteFriend from '@/components/InviteFriend';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { getCurrentLevel } from '@/utils/levels';

const FriendsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr',
  gridAutoColumns: '1fr',
  gridAutoRows: 'auto',
  gap: '10px',
  gridAutoFlow: 'row',
  gridTemplateAreas: `
    'FriendRequests'
    'TodaysChallenge'
    'UserLevel'
    'InviteFriend'
    'Friends'`,
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      'FriendRequests FriendRequests'
      'TodaysChallenge UserLevel'
      'InviteFriend InviteFriend'
      'Friends Friends'`,
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      'FriendRequests FriendRequests FriendRequests'
      'InviteFriend TodaysChallenge UserLevel'
      'Friends Friends Friends'`,
  },
});

const Stats = styled(Typography)(({ theme }) => ({
  '& span:last-child': {
    color: theme.palette.success.main,
  },
}));

const FriendsSection = () => {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);

  return (
    <Container className="container-box" maxWidth="md">
      <FriendsGrid>
        <div style={{ gridArea: 'TodaysChallenge' }}>
          <Card>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              height="100%"
              fontWeight="900"
              rowGap="26px"
            >
              <Typography fontWeight="bold" mb={1}>
                {t.todaysChallenge}
              </Typography>
              <Stats fontSize="4em" fontWeight="900" lineHeight="1">
                <span
                  style={{
                    color: user?.stats.todaysRosaryCompleted
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  }}
                >
                  {user?.stats.todaysRosaryCompleted ? 1 : 0}
                </span>
                <span>/1</span>
              </Stats>
              <Typography fontWeight="100">
                {t.todaysChallengeDescription2}
              </Typography>
            </Box>
          </Card>
        </div>
        <div style={{ gridArea: 'InviteFriend' }}>
          <Card>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              rowGap="29px"
            >
              <InviteFriend />
            </Box>
          </Card>
        </div>
        <div style={{ gridArea: 'UserLevel' }}>
          <Card>
            <Typography textAlign="center" fontWeight="bold" fontSize="large">
              {t.currentLevel}
            </Typography>
            <Box display="flex" flexDirection="column" textAlign="center">
              <RosaryLevel levelNum={currentLevel.levelNum} />
              <RosaryLevelInfo
                requirement={currentLevel.requirement}
                value={currentLevel.value}
              />
            </Box>
          </Card>
        </div>
        <div style={{ gridArea: 'Friends' }}>
          <Card>
            <AllFriends />
          </Card>
        </div>
        <div style={{ gridArea: 'FriendRequests' }}>
          <Card>
            <FriendApproval />
          </Card>
        </div>
      </FriendsGrid>
    </Container>
  );
};

export default FriendsSection;
