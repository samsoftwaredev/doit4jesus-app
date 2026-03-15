import styled from '@emotion/styled';
import { Box, Button, Container, Typography } from '@mui/material';

import {
  Card,
  Leaderboards,
  RosaryStreak,
  RosaryWinnerChallenge,
  TodaysRosary,
  TotalRosariesPrayed,
} from '@/components';
import InviteFriend from '@/components/InviteFriend';
import RosaryStats from '@/components/RosaryStats';

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
      'TotalRosaries RosaryStreak RosaryStreak'
      'Levels Levels Levels'
      'Donations Donations Donations'
      'Leaderboards Leaderboards Leaderboards'`,
  },
});

const DashboardSection = () => {
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
    </Container>
  );
};

export default DashboardSection;
