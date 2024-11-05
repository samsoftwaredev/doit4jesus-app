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
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();
  const [friendsProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [friends, setFriends] = useState<FriendsDB[]>([]);
  const [friendSelected, setFriendSelected] = useState<FriendProfile>();

  const onClose = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const onSelect = (friend: FriendProfile) => {
    openDialog();
    setFriendSelected(friend);
  };

  const getFriendsProfiles = async (userIds: string[]) => {
    const [data, error] = await getUserProfileAPI(userIds);
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    }
    if (data) setFriendProfiles(data);
  };

  const onEndFriendship = async () => {
    const relationship = friends.find(
      (u) =>
        u.uuid1 === friendSelected?.userId ||
        u.uuid2 === friendSelected?.userId,
    );
    if (relationship !== undefined) {
      const { error } = await db
        .getFriends()
        .delete()
        .eq('id', relationship.id);
      if (error) {
        toast.error('Unable to decline friend request');
      } else {
        onClose();
        setFriendProfiles((prevState) =>
          prevState.filter((f) => f.userId !== friendSelected?.userId),
        );
      }
    }
  };

  const getFriends = async () => {
    let { data, error } = await db
      .getFriends()
      .select('*')
      .or(`uuid1.eq.${user?.userId!},uuid2.eq.${user?.userId!}`);
    if (data) {
      setFriends(data);
      const friendUserIds = data.map((u) => {
        const uid = u.uuid1 !== user?.userId ? u.uuid1 : u.uuid2;
        return uid!;
      });
      getFriendsProfiles(friendUserIds);
    }
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFriends();
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
            <Box
              my={2}
              alignItems="center"
              key={friend.userId}
              display="flex"
              gap={1}
            >
              <UserBubble
                userName={friend?.fullName}
                userPicture={friend?.pictureUrl ?? ''}
              />
              {friend?.fullName} - {friend?.rosaryCount}
              <IconButton onClick={() => onSelect(friend)}>
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
        modalTitle="Remove Friend"
      >
        <Typography my={5}>
          Are you sure you want to remove {friendSelected?.fullName}?
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="outlined" color="error" onClick={onEndFriendship}>
            Delete
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AllFriends;
