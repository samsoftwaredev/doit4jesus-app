import { Box, Container, Typography } from '@mui/material';

import { AllFriends, Card, RosaryLevel, RosaryLevelInfo } from '@/components';
import FriendApproval from '@/components/FriendApproval';
import InviteFriend from '@/components/InviteFriend';
import { useUserContext } from '@/context/UserContext';
import { theme } from '@/styles/mui-overwrite';
import { getCurrentLevel } from '@/utils/levels';

import styles from './FriendsSection.module.scss';

const FriendsSection = () => {
  const { user } = useUserContext();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);

  return (
    <Container className="container-box" maxWidth="md">
      <Box className={styles.container}>
        <div className={styles.TodaysChallenge}>
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
                Today&apos;s Challenge
              </Typography>
              <Typography
                fontSize="4em"
                fontWeight="900"
                className={styles.stats}
                lineHeight="1"
              >
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
              </Typography>
              <Typography fontWeight="100">
                Pray the rosary to complete the today&apos;s challenge.
              </Typography>
            </Box>
          </Card>
        </div>
        <div className={styles.InviteFriend}>
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
        <div className={styles.UserLevel}>
          <Card>
            <Typography textAlign="center" fontWeight="bold" fontSize="large">
              Your Level
            </Typography>
            <Box display="flex" flexDirection="column" textAlign="center">
              <RosaryLevel levelNum={currentLevel.levelNum} />
              <RosaryLevelInfo
                requirement={currentLevel.requirement}
                label={currentLevel.label}
              />
            </Box>
          </Card>
        </div>
        <div className={styles.Friends}>
          <Card>
            <AllFriends />
          </Card>
        </div>
        <div className={styles.FriendRequests}>
          <Card>
            <FriendApproval />
          </Card>
        </div>
      </Box>
    </Container>
  );
};

export default FriendsSection;
