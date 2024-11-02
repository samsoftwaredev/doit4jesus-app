import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/class/index';
import {
  Card,
  CreateFriendGroup,
  Loading,
  RosaryLevel,
  RosaryLevelInfo,
} from '@/components';
import FriendGroup from '@/components/FriendGroup';
import FriendSearchGroup from '@/components/FriendSearchGroup';
import { sessionFriendsKey } from '@/constants/global';
import { useUserContext } from '@/context/UserContext';
import { FriendsGroupItem, GroupItem } from '@/interfaces/index';
import { getCurrentLevel } from '@/utils/levels';
import {
  normalizeFriendProfile,
  normalizeFriendsGroups,
  normalizeGroups,
} from '@/utils/normalizers';

import styles from './FriendsSection.module.scss';

const FriendsSection = () => {
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<GroupItem[]>();
  const [friendGroups, setFriendGroups] = useState<FriendsGroupItem[]>();
  const numRosariesCompleted = user?.stats.rosaryTotalCount ?? 0;
  const currentLevel = getCurrentLevel(numRosariesCompleted);

  const getMyGroups = async () => {
    let { data, error } = await db.getGroups().select('*');
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve groups');
    }
    if (data) {
      const groupsNormalized = normalizeGroups(data);
      setGroups(groupsNormalized);
    }
  };

  const getFriendsProfiles = async (userIds: string[]) => {
    let { data, error } = await supabase.rpc('get_profiles_by_user_ids', {
      user_ids: userIds,
    });
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    } else {
      const friendData = normalizeFriendProfile(data ?? []);
      sessionStorage.setItem(sessionFriendsKey, JSON.stringify(friendData));
    }
  };

  const getFriendsByGroups = async () => {
    await getMyGroups();
    let { data, error } = await db.getFriends().select('*');
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve group of friends');
    }
    if (data) {
      const groupsFriendNormalized = normalizeFriendsGroups(data);
      const friendIds = groupsFriendNormalized.map(({ friendId }) => friendId);
      await getFriendsProfiles(friendIds);
      setFriendGroups(groupsFriendNormalized);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getFriendsByGroups();
  }, []);

  return (
    <Container className="container-box" maxWidth="md">
      <Box className={styles.container}>
        <div className={styles.SearchFriend}>
          <Card>
            {isLoading ? (
              <Loading isFeature />
            ) : (
              <FriendSearchGroup groups={groups} />
            )}
          </Card>
        </div>
        <div className={styles.TodaysChallenge}>
          <Card>
            <Box display="flex" flexDirection="column" textAlign="center">
              <Typography fontWeight="bold">Today&apos;s Challenge</Typography>
              <Typography
                fontSize="4.1em"
                fontWeight="900"
                className={styles.stats}
              >
                <span>{user?.stats.todaysRosaryCompleted ? 1 : 0}</span>{' '}
                <span>/</span> <span>1</span>
              </Typography>
              <Typography fontSize="small">Pray One Rosary</Typography>
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
        {isLoading ? (
          <Loading isFeature />
        ) : (
          groups?.map((group) => {
            return (
              <div key={group.id}>
                <Card>
                  <FriendGroup group={group} friendGroups={friendGroups} />
                </Card>
              </div>
            );
          })
        )}
        <div className={styles.CreateGroups}>
          <Card>
            <CreateFriendGroup />
          </Card>
        </div>
      </Box>
    </Container>
  );
};

export default FriendsSection;
