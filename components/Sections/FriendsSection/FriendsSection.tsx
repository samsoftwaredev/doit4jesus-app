import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import {
  Box,
  Chip,
  Container,
  LinearProgress,
  Typography,
  alpha,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { AllFriends, Card, RosaryLevel, RosaryLevelInfo } from '@/components';
import FriendApproval from '@/components/FriendApproval';
import InviteFriend from '@/components/InviteFriend';
import { useLanguageContext } from '@/context/LanguageContext';
import { useLevelsContext } from '@/context/LevelsContext';
import { useUserContext } from '@/context/UserContext';

const FriendsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr',
  gridAutoColumns: '1fr',
  gridAutoRows: 'auto',
  gap: '10px',
  gridAutoFlow: 'row',
  gridTemplateAreas: `
    'CommunityHero'
    'FriendRequests'
    'TodaysChallenge'
    'UserLevel'
    'InviteFriend'
    'Friends'`,
  '@media (min-width: 768px)': {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
      'CommunityHero CommunityHero'
      'FriendRequests FriendRequests'
      'TodaysChallenge UserLevel'
      'InviteFriend InviteFriend'
      'Friends Friends'`,
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `
    'CommunityHero CommunityHero CommunityHero'
    'InviteFriend TodaysChallenge UserLevel'
    'Friends Friends FriendRequests'
     `,
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
  const { getCurrentLevel } = useLevelsContext();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);
  const levelProgress = Math.min(
    100,
    (numRosariesCompleted / currentLevel.requirement) * 100,
  );

  return (
    <Container className="container-box" maxWidth="md">
      <FriendsGrid>
        <div style={{ gridArea: 'CommunityHero' }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.dark,
                0.92,
              )}, ${alpha(theme.palette.primary.main, 0.88)} 60%, ${alpha(
                theme.palette.warning.main,
                0.8,
              )})`,
              color: theme.palette.common.white,
            }}
          >
            <Chip
              icon={<GroupIcon sx={{ color: theme.palette.common.white }} />}
              label={t.community}
              sx={{
                mb: 1.5,
                bgcolor: alpha(theme.palette.common.white, 0.16),
                color: theme.palette.common.white,
              }}
            />
            <Typography variant="h4" fontWeight={700} mb={1}>
              {t.prayTogetherGrowTogether}
            </Typography>
            <Typography sx={{ color: alpha(theme.palette.common.white, 0.86) }}>
              {t.buildPrayerCircle}
            </Typography>
          </Box>
        </div>

        <div style={{ gridArea: 'TodaysChallenge' }}>
          <Card>
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography fontWeight="bold">{t.todaysChallenge}</Typography>
              <Chip
                icon={<ShieldMoonIcon />}
                label={t.daily}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.info.main, 0.12),
                  color: theme.palette.info.main,
                }}
              />
            </Box>
            <Typography fontWeight="100" textAlign="center">
              {t.todaysChallengeDescription2}
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              height="100%"
              fontWeight="900"
              rowGap="20px"
            >
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
            </Box>
          </Card>
        </div>
        <div style={{ gridArea: 'InviteFriend' }}>
          <Card>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography fontWeight={700}>{t.actionBar}</Typography>
              <Chip
                icon={<FavoriteIcon />}
                label={t.invite}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.12),
                  color: theme.palette.success.main,
                }}
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              rowGap="20px"
            >
              <InviteFriend />
            </Box>
          </Card>
        </div>
        <div style={{ gridArea: 'UserLevel' }}>
          <Card>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography textAlign="center" fontWeight="bold" fontSize="large">
                {t.currentLevel}
              </Typography>
              <Chip
                icon={<EmojiEventsIcon />}
                label={`Lvl ${currentLevel.levelNum}`}
                size="small"
              />
            </Box>
            <Box display="flex" flexDirection="column" textAlign="center">
              <RosaryLevel levelNum={currentLevel.levelNum} />
              <RosaryLevelInfo
                requirement={currentLevel.requirement}
                value={currentLevel.value}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={levelProgress}
              sx={{
                mt: 2,
                height: 10,
                borderRadius: 999,
                bgcolor: alpha(theme.palette.text.primary, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.warning.main})`,
                },
              }}
            />
          </Card>
        </div>
        <div style={{ gridArea: 'Friends' }}>
          <Card>
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography fontWeight={700}>{t.myCircle}</Typography>
              <Chip
                icon={<GroupIcon />}
                label={t.community}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
            <AllFriends />
          </Card>
        </div>
        <div style={{ gridArea: 'FriendRequests' }}>
          <Card>
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography fontWeight={700}>{t.requests}</Typography>
              <Chip
                icon={<GroupIcon />}
                label={t.incomingOutgoing}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.14),
                  color: theme.palette.warning.main,
                }}
              />
            </Box>
            <FriendApproval />
          </Card>
        </div>
      </FriendsGrid>
    </Container>
  );
};

export default FriendsSection;
