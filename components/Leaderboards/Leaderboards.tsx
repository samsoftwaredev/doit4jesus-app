import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { fetchLeaderboards } from '@/services/leaderboardsApi';
import { getCurrentLevel } from '@/utils/levels';

import Loading from '../Loading';
import RosaryLevel from '../RosaryLevel';

type UserLeaderboards = {
  userId: string;
  count: number;
  firstName: string;
  lastName: string;
};

const Leaderboards = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState<UserLeaderboards[]>();

  const normalizeLeaderboards = (
    data: {
      user_id: string;
      user_count: number;
      first_name: string;
      last_name: string;
      picture_url: string;
    }[],
  ): UserLeaderboards[] => {
    return data.map((u) => ({
      userId: u.user_id,
      count: u.user_count,
      firstName: u.first_name,
      lastName: u.last_name,
      picture_url: u.picture_url,
    }));
  };

  const getTopRosaryUser = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboards();
      if (data) {
        const list = normalizeLeaderboards(data.data.data);
        setUserList(list);
      }
    } catch (error) {
      console.error('Error in Leaderboards (getTopRosaryUser):', error);
      toast.error(t.unableToDisplayLeaderboards);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTopRosaryUser();
  }, []);

  return (
    <Box>
      <Typography fontSize="small" fontWeight="light">
        {t.top10warriors}
      </Typography>
      <Typography variant="h4">{t.leaderboard}</Typography>
      {isLoading ? (
        <Loading isFeature />
      ) : (
        <>
          <Box>
            {userList?.map((u, index) => {
              const { levelNum } = getCurrentLevel(u.count);
              return (
                <Box
                  my={5}
                  key={u.userId}
                  display="flex"
                  alignItems="center"
                  p={2}
                  borderRadius={2}
                  sx={{
                    backgroundColor:
                      u.userId === user?.userId
                        ? 'rgba(0, 0, 0, 0.1)'
                        : 'transparent',
                  }}
                >
                  <Box>
                    <Typography fontSize="4em">{index + 1}</Typography>
                  </Box>

                  <Box
                    sx={{ width: '100%' }}
                    display="flex"
                    flexDirection="column"
                  >
                    <Typography
                      sx={{
                        color:
                          u.userId === user?.userId
                            ? 'primary.main'
                            : 'text.primary',
                      }}
                      fontSize="1.2em"
                      fontWeight="bold"
                      px={1}
                    >
                      {u.firstName} {u.lastName}
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          u.userId === user?.userId
                            ? 'warning.light'
                            : 'text.primary',
                      }}
                      px={1}
                    >
                      {u.count} {u.count !== 1 ? t.rosaries : t.rosary}
                    </Typography>
                  </Box>

                  <Box sx={{ width: '100%' }} textAlign="right">
                    <RosaryLevel levelNum={levelNum} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Leaderboards;
