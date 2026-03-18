import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  Card,
  Leaderboards,
  MilestoneModal,
  RosaryStreak,
  RosaryWinnerChallenge,
  ShareStatsButton,
  TodaysRosary,
  TotalRosariesPrayed,
} from '@/components';
import InviteFriend from '@/components/InviteFriend';
import RosaryStats from '@/components/RosaryStats';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { useMilestones } from '@/hooks/useMilestones';

import ProgressLevelsSection from '../ProgressLevelsSection';

const DashboardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr',
  gridAutoColumns: '1fr',
  gap: '10px',
  gridAutoFlow: 'row',
  gridTemplateAreas: `
    'TodayRosary'
    'ShareStats'
    'RosariesCompleted'
    'Friends'
    'RosaryStreak'
    'TotalRosaries'
    'RosaryWinnerChallenge'
    'Donations'
    'Levels'
    'Leaderboards'`,
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: `
      'TodayRosary TodayRosary'
      'RosariesCompleted Friends'
      'ShareStats ShareStats'
      'TotalRosaries RosaryStreak'
      'RosaryWinnerChallenge RosaryWinnerChallenge'
      'Donations Donations'
      'Levels Levels'
      'Leaderboards Leaderboards'`,
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      'TodayRosary TodayRosary RosariesCompleted'
      'TodayRosary TodayRosary Friends'
      'ShareStats ShareStats ShareStats'
      'TotalRosaries RosaryStreak RosaryStreak'
      'Levels Levels Levels'
      'Donations Donations Donations'
      'Leaderboards Leaderboards Leaderboards'`,
  },
});

const DashboardSection = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const rosaryCount = user?.stats?.rosaryTotalCount ?? 0;
  const { currentMilestone, showMilestone, dismissMilestone } = useMilestones(
    rosaryCount,
    0,
    user?.userId,
  );

  return (
    <Container className="container-box" maxWidth="md">
      <DashboardGrid>
        <div style={{ gridArea: 'TodayRosary' }}>
          <Card style={{ padding: 0 }}>
            <TodaysRosary />
          </Card>
        </div>

        <div style={{ gridArea: 'RosariesCompleted' }}>
          <Card>
            <RosaryStats />
          </Card>
        </div>

        <div style={{ gridArea: 'Friends' }}>
          <Card>
            <InviteFriend />
          </Card>
        </div>

        <div style={{ gridArea: 'ShareStats' }}>
          <Card>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontWeight="bold">{t.sharePrayerJourney}</Typography>
              <ShareStatsButton />
            </Box>
          </Card>
        </div>

        <div style={{ gridArea: 'Levels' }}>
          <Card>
            <ProgressLevelsSection />
          </Card>
        </div>

        <div style={{ gridArea: 'TotalRosaries' }}>
          <Card>
            <TotalRosariesPrayed />
          </Card>
        </div>

        {/* <div style={{ gridArea: 'RosaryWinnerChallenge' }}>
          <Card>
            <RosaryWinnerChallenge />
          </Card>
        </div> */}

        <div style={{ gridArea: 'RosaryStreak' }}>
          <Card>
            <RosaryStreak />
          </Card>
        </div>

        <div style={{ gridArea: 'Leaderboards' }}>
          <Card>
            <Leaderboards />
          </Card>
        </div>
      </DashboardGrid>

      <MilestoneModal
        milestone={currentMilestone}
        open={showMilestone}
        onClose={dismissMilestone}
      />
    </Container>
  );
};

export default DashboardSection;
