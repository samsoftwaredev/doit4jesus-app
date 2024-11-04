import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserProfileAPI } from 'services';

import { db } from '@/class/SupabaseDB';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces/index';

import UserBubble from '../UserBubble';

const AllFriends = () => {
  const { user } = useUserContext();
  const [friends, setFriends] = useState<FriendProfile[]>([]);

  const getFriendsProfiles = async (userIds: string[]) => {
    const [data, error] = await getUserProfileAPI(userIds);
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    }
    if (data) setFriends(data);
  };

  const getFriendsApproval = async () => {
    let { data, error } = await db
      .getFriends()
      .select('*')
      .or(`uuid1.eq.${user?.userId!},uuid2.eq.${user?.userId!}`);
    if (data) {
      const friends = data.map((u) => {
        const uid = u.uuid1 !== user?.userId ? u.uuid1 : u.uuid2;
        return { id: u.id, friendId: uid!, uuid1: u.uuid1!, uuid2: u.uuid2! };
      });
      const friendUserIds = friends.map(({ friendId }) => friendId);
      getFriendsProfiles(friendUserIds);
    }
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFriendsApproval();
  }, []);

  return (
    <>
      <Typography fontWeight="bold" fontSize="large">
        Friends
      </Typography>
      <Box ml={4}>
        {friends.length === 0 && <>None</>}
        {friends.map((friend) => {
          return (
            <Box alignItems="center" key={friend.userId} display="flex" gap={1}>
              <UserBubble
                userName={friend?.fullName}
                userPicture={friend?.pictureUrl ?? ''}
              />
              {friend?.fullName} - {friend?.rosaryCount}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default AllFriends;
