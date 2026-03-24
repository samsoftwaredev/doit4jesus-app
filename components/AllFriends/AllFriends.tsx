import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces';
import { FriendsDB } from '@/interfaces/databaseTable';
import {
  endFriendship,
  fetchFriends,
  fetchProfilesByIds,
} from '@/services/friendsApi';

import Dialog from '../Dialog';
import UserBubble from '../UserBubble';

const AllFriends = () => {
  const { t } = useLanguageContext();
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
    try {
      const data = await fetchProfilesByIds(userIds);
      setFriendProfiles(data);
    } catch (error) {
      console.error('Error in AllFriends (getFriendsProfiles):', error);
      toast.error(t.unableToRetrieveFriendProfile);
    }
  };

  const onEndFriendship = async () => {
    const relationship = friends.find(
      (u) =>
        u.uuid1 === friendSelected?.userId ||
        u.uuid2 === friendSelected?.userId,
    );
    if (relationship !== undefined) {
      try {
        await endFriendship(relationship.id);
        onClose();
        setFriendProfiles((prevState) =>
          prevState.filter((f) => f.userId !== friendSelected?.userId),
        );
      } catch (error) {
        console.error('Error in AllFriends (onEndFriendship):', error);
        toast.error(t.unableToDeclineFriendRequest);
      }
    }
  };

  const getFriends = async () => {
    try {
      const data = await fetchFriends();
      if (data) {
        setFriends(data);
        const friendUserIds = data.map((u) => {
          const uid = u.uuid1 !== user?.userId ? u.uuid1 : u.uuid2;
          return uid!;
        });
        getFriendsProfiles(friendUserIds);
      }
    } catch (error) {
      console.error('Error in AllFriends (getFriends):', error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <>
      <Typography fontWeight="bold" fontSize="large">
        {t.community}
      </Typography>
      <Box ml={4}>
        {friendsProfiles.length === 0 && <>{t.none}</>}
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
              {friend?.fullName} - {friend?.rosaryCount}{' '}
              {friend?.rosaryCount === 1 ? t.rosary : t.rosaries}
              <Box display="flex" flexGrow={1} />
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
        modalTitle={t.removeFriend}
      >
        <Typography my={5}>
          {t.removeFriendDescription.replace(
            '{{name}}',
            friendSelected?.fullName || '',
          )}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button variant="outlined" color="error" onClick={onEndFriendship}>
            {t.delete}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AllFriends;
