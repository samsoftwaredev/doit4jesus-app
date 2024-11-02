import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useUserContext } from '@/context/UserContext';

interface UserProfileProps {
  name: string;
  pictureUrl?: string;
  uid?: string;
}

const UserProfile = ({ name, pictureUrl, uid }: UserProfileProps) => {
  return (
    <Box>
      {pictureUrl && (
        <Image
          width={20}
          height={20}
          src={pictureUrl}
          alt={name}
          style={{ borderRadius: '50%' }}
        />
      )}
      <Typography component={'h3'}>{name}</Typography>
    </Box>
  );
};

const FriendRequestSection = () => {
  const router = useRouter();
  const [friend, setFriend] = useState<{
    name: string;
    pictureUrl: string;
  }>({
    name: 'Samuel Ruiz',
    pictureUrl: '',
  });
  const { user } = useUserContext();

  const onCancel = () => {};

  const onConfirm = () => {};

  const getUserProfile = () => {
    const { slug } = router.query;
    if (typeof slug === 'string') {
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <Container className="container-box" maxWidth="sm">
      <Typography component="h1">Friend Requests</Typography>
      <Typography>{friend.name} wants to be your friend.</Typography>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <UserProfile
          name={`${user?.firstName} ${user?.lastName}`}
          pictureUrl={user?.pictureUrl}
        />
        <UserProfile name={friend.name} pictureUrl={friend.pictureUrl} />
      </Box>
      <Typography>
        You will be sharing info such the number of rosaries completed, profile
        info among other things.
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </Box>
    </Container>
  );
};

export default FriendRequestSection;
