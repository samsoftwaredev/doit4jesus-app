import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserProfileAPI } from 'services';

import { db } from '@/class/SupabaseDB';
import { useUserContext } from '@/context/UserContext';
import { FriendsDB } from '@/interfaces/databaseTable';
import { FriendProfile } from '@/interfaces/index';

import Dialog from '../Dialog';
import UserBubble from '../UserBubble';

const AllFriends = () => {
  let friendUserId = '';
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();
  const [friendsProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [friends, setFriends] = useState<FriendsDB[]>([]);

  const onClose = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const onSelect = (id: string) => {
    openDialog();
    friendUserId = id;
  };

  const getFriendsProfiles = async (userIds: string[]) => {
    const [data, error] = await getUserProfileAPI(userIds);
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    }
    if (data) setFriendProfiles(data);
  };

  const getFriendsApproval = async () => {
    let { data, error } = await db
      .getFriends()
      .select('*')
      .or(`uuid1.eq.${user?.userId!},uuid2.eq.${user?.userId!}`);
    if (data) {
      setFriends(data);
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

  const onEndFriendship = async () => {
    const relationship = friends.find(
      (u) => u.uuid1 === friendUserId || u.uuid2 === friendUserId,
    );
    if (relationship !== undefined) {
      const { error } = await db
        .getFriends()
        .delete()
        .eq('id', relationship.id);
      if (error) {
        toast.error('Unable to decline friend request');
      } else {
        setFriendProfiles((prevState) =>
          prevState.filter((f) => f.userId !== friendUserId),
        );
      }
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
        {friendsProfiles.length === 0 && <>None</>}
        {friendsProfiles.map((friend) => {
          return (
            <Box alignItems="center" key={friend.userId} display="flex" gap={1}>
              <UserBubble
                userName={friend?.fullName}
                userPicture={friend?.pictureUrl ?? ''}
              />
              {friend?.fullName} - {friend?.rosaryCount}
              <IconButton onClick={() => onSelect(friend.userId!)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          );
        })}
      </Box>
      <Dialog
        maxWidth="sm"
        open={isOpen}
        handleClose={onClose}
        modalTitle="Create Group"
      >
        Are you sure you want to end this relationship?
        <Button onClick={onEndFriendship}>Delete</Button>
      </Dialog>
    </>
  );
};

export default AllFriends;
