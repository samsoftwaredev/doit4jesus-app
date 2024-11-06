import { Box, Button, Container, Typography } from '@mui/material';

import { Card, Leaderboards, TodaysRosary } from '@/components';
import InviteFriend from '@/components/InviteFriend';
import RosaryStats from '@/components/RosaryStats';

import ProgressLevelsSection from '../ProgressLevelsSection';
import styles from './dashboardSection.module.scss';

const DashboardSection = () => {
  return (
    <Container className="container-box" maxWidth="md">
      <Box className={styles.container}>
        <div className={styles.TodayRosary}>
          <Card style={{ padding: 0 }}>
            <TodaysRosary />
          </Card>
        </div>

        <div className={styles.RosariesCompleted}>
          <Card>
            <RosaryStats />
          </Card>
        </div>

        <div className={styles.Friends}>
          <Card>
            <InviteFriend />
          </Card>
        </div>

        <div className={styles.Donations}>
          <Card>
            <Typography fontSize="small" fontWeight="light">
              Help share the love for the Holy Rosary
            </Typography>
            <Typography my={2} component="h1" variant="h4">
              Wanna become a contributor?
            </Typography>
            <Button disabled color="success" variant="outlined">
              Donate Today
            </Button>
          </Card>
        </div>

        <div className={styles.Levels}>
          <Card>
            <ProgressLevelsSection />
          </Card>
        </div>

        <div className={styles.Leaderboards}>
          <Card>
            <Leaderboards />
          </Card>
        </div>
      </Box>
    </Container>
  );
};

export default DashboardSection;
