import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserProfileAPI } from 'services';

import { db, supabase } from '@/class/index';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces/index';
import {
  getUserProfileLocally,
  storeUserProfileLocally,
} from '@/utils/helpers';
import { normalizeFriendProfile } from '@/utils/normalizers';

import UserBubble from '../UserBubble';

type FriendRequests = {
  id: string;
  friendId: string;
  uuid1: string;
  uuid2: string;
};

const FriendApproval = () => {
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [friendsIds, setFriendsIds] = useState<FriendRequests[]>([]);
  const { user } = useUserContext();

  const getFriendsProfiles = async (userIds: string[]) => {
    const [data, error] = await getUserProfileAPI(userIds);
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    }
    if (data) setFriends(data);
  };

  const onDecline = async (id: string) => {
    const { error } = await db.getFriendRequests().delete().eq('id', id);
    if (error) {
      toast.error('Unable to decline friend request');
    } else {
      setFriendsIds((prevState) => prevState.filter((f) => f.id === id));
    }
  };

  const onApprove = async (data: FriendRequests) => {
    const uuidKey = data.uuid1 === data.friendId ? 'uuid1' : 'uuid2';
    const { data: friendData, error } = await db
      .getFriendRequests()
      .update({ [uuidKey]: 'TRUE' })
      .eq('id', data.id)
      .select();
    if (error) {
      toast.error('Unable to confirm friend request');
    }
    if (friendData) {
      setFriendsIds((prevState) => prevState.filter((f) => f.id === data.id));
    }
  };

  const getFriendsApproval = async () => {
    let { data, error } = await db
      .getFriendRequests()
      .select('*')
      .or(`uuid1.eq.${user?.userId!},uuid2.eq.${user?.userId!}`);
    if (data) {
      const friends = data.map((u) => {
        const uid = u.uuid1 !== user?.userId ? u.uuid1 : u.uuid2;
        return { id: u.id, friendId: uid!, uuid1: u.uuid1!, uuid2: u.uuid2! };
      });
      const friendUserIds = friends.map(({ friendId }) => friendId);
      setFriendsIds(friends);
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
        Friend Requests
      </Typography>
      <Box ml={4}>
        {friendsIds.length === 0 && <>None</>}
        {friendsIds.map((data) => {
          const friend = friends.find(({ userId }) => userId === data.friendId);
          return (
            <Box
              alignItems="center"
              key={friend?.userId}
              display="flex"
              gap={1}
            >
              <UserBubble
                userName={friend?.fullName}
                userPicture={friend?.pictureUrl ?? ''}
              />
              {friend?.fullName} - {friend?.rosaryCount}
              <Button
                onClick={() => onDecline(data.id)}
                variant="text"
                color="success"
              >
                Decline
              </Button>
              <Button
                onClick={() => onApprove(data)}
                variant="contained"
                color="success"
              >
                Approve
              </Button>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default FriendApproval;
