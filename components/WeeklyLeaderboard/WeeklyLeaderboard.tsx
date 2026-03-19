import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Box, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import type {
  LeaderboardTab,
  UserLeaderboardPosition,
  WeeklyLeaderboardData,
} from '@/interfaces/weeklyLeaderboard';
import {
  getMyLeaderboardPosition,
  getWeeklyLeaderboard,
} from '@/services/weeklyLeaderboard';

import LeaderboardList from './LeaderboardList';
import LeaderboardPodium from './LeaderboardPodium';
import ResetCountdown from './ResetCountdown';
import YourPositionCard from './YourPositionCard';

const WeeklyLeaderboard = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const theme = useTheme();

  const [tab, setTab] = useState<LeaderboardTab>('this_week');
  const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboardData | null>(
    null,
  );
  const [myPosition, setMyPosition] = useState<UserLeaderboardPosition | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [boardData, positionData] = await Promise.all([
          getWeeklyLeaderboard(tab),
          user?.userId
            ? getMyLeaderboardPosition(user.userId, tab)
            : Promise.resolve(null),
        ]);
        setLeaderboard(boardData);
        setMyPosition(positionData);

        if (!boardData) {
          toast.error(t.weeklyLeaderboardError);
        }
      } catch {
        toast.error(t.weeklyLeaderboardError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tab, user?.userId]);

  const handleTabChange = (_: React.SyntheticEvent, newTab: LeaderboardTab) => {
    setTab(newTab);
  };

  const entries = leaderboard?.entries ?? [];
  const hasData = entries.length > 0;

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            <LeaderboardIcon
              sx={{
                verticalAlign: 'middle',
                mr: 1,
                color: theme.palette.gold.main,
              }}
            />
            {t.weeklyLeaderboard}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {t.weeklyLeaderboardSubtitle}
          </Typography>
        </Box>
        <ResetCountdown />
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
          '& .Mui-selected': { color: `${theme.palette.gold.main} !important` },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.gold.main,
          },
        }}
      >
        <Tab label={t.weeklyLeaderboardThisWeek} value="this_week" />
        <Tab label={t.weeklyLeaderboardLastWeek} value="last_week" />
      </Tabs>

      {/* Loading */}
      {isLoading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={48}
              sx={{ borderRadius: 3 }}
            />
          ))}
        </Stack>
      ) : !hasData ? (
        /* Empty state */
        <Stack
          alignItems="center"
          spacing={2}
          py={6}
          sx={{
            borderRadius: 4,
            bgcolor: alpha(theme.palette.action.hover, 0.04),
          }}
        >
          <LeaderboardIcon
            sx={{ fontSize: 56, color: theme.palette.gold.main, opacity: 0.4 }}
          />
          <Typography variant="h6" fontWeight={700}>
            {t.weeklyLeaderboardNoActivity}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t.weeklyLeaderboardStartPraying}
          </Typography>
        </Stack>
      ) : (
        /* Content */
        <Stack spacing={3}>
          <LeaderboardPodium entries={entries} />
          <YourPositionCard position={myPosition} />
          <LeaderboardList entries={entries} currentUserId={user?.userId} />
        </Stack>
      )}
    </Box>
  );
};

export default WeeklyLeaderboard;
