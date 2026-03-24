import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces';
import { FriendRequestsDB } from '@/interfaces/databaseTable';
import {
  approveFriendRequest,
  declineFriendRequest,
  fetchFriendRequests,
  fetchProfilesByIds,
} from '@/services/friendsApi';

import UserBubble from '../UserBubble';

type FriendRequests = {
  friendId: string;
} & FriendRequestsDB;

const FriendApproval = () => {
  const { t } = useLanguageContext();
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [friendsIds, setFriendsIds] = useState<FriendRequests[]>([]);
  const { user } = useUserContext();

  const getFriendsProfiles = async (userIds: string[]) => {
    try {
      const data = await fetchProfilesByIds(userIds);
      setFriends(data);
    } catch (error) {
      console.error('Error in FriendApproval (getFriendsProfiles):', error);
      toast.error(t.unableToRetrieveFriendProfile);
    }
  };

  const onDecline = async (id: string) => {
    try {
      await declineFriendRequest(id);
      setFriendsIds((prevState) => prevState.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Error in FriendApproval (onDecline):', error);
      toast.error(t.unableToDeclineFriendRequest);
    }
  };

  const onApprove = async (data: FriendRequests) => {
    try {
      await approveFriendRequest(data.id);
      setFriendsIds((prevState) => prevState.filter((f) => f.id !== data.id));
    } catch (error) {
      console.error('Error in FriendApproval (onApprove):', error);
      toast.error(t.unableToConfirmFriendRequest);
    }
  };

  const getFriendsApproval = async () => {
    try {
      const data = await fetchFriendRequests();
      if (data) {
        const friends = data.map((u) => {
          const uid = u.uuid1 !== user?.userId ? u.uuid1 : u.uuid2;
          return { ...u, friendId: uid! };
        });
        const friendUserIds = friends.map(({ friendId }) => friendId);
        setFriendsIds(friends);
        getFriendsProfiles(friendUserIds);
      }
    } catch (error) {
      console.error('Error in FriendApproval (getFriendsApproval):', error);
    }
  };

  useEffect(() => {
    getFriendsApproval();
  }, []);

  return (
    <>
      <Typography fontWeight="bold" fontSize="large">
        {t.friendRequest}
      </Typography>
      <Box ml={4}>
        {friendsIds.length === 0 && <>{t.none}</>}
        {friendsIds.map((data) => {
          const uuidKey = data.uuid1 === data.friendId ? 'uuid1' : 'uuid2';
          const accepted = data[`${uuidKey}_accepted`];
          const friend = friends.find(({ userId }) => userId === data.friendId);
          return (
            <Box
              my={2}
              alignItems="center"
              key={friend?.userId}
              display="flex"
              gap={1}
            >
              <UserBubble
                userName={friend?.fullName}
                userPicture={friend?.pictureUrl ?? ''}
              />
              {friend?.fullName}
              {accepted === true ? (
                <Box>
                  <Button
                    onClick={() => onDecline(data.id)}
                    variant="text"
                    color="success"
                  >
                    {t.declineFriendRequest}
                  </Button>
                  <Button
                    onClick={() => onApprove(data)}
                    variant="contained"
                    color="success"
                  >
                    {t.approveFriendRequest}
                  </Button>
                </Box>
              ) : (
                <Box>({t.waitingForApproval})</Box>
              )}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default FriendApproval;
