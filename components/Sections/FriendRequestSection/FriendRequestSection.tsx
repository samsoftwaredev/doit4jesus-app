import { AccountCircle } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Card } from '@/components';
import { NAV_APP_LINKS } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces';
import { fetchProfilesByIds, sendFriendRequest } from '@/services/friendsApi';
import { awardXP } from '@/services/spiritualXp';
import { orderUUIDs } from '@/utils';

import { ErrorPage } from '../..';

const ProfileImage = styled(Image)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  '@media (min-width: 1024px)': {
    width: '120px',
    height: '120px',
  },
});

const ProfileIcon = styled(AccountCircle)({
  fontSize: '5em',
  '@media (min-width: 1024px)': {
    fontSize: '8em',
  },
});

interface UserProfileProps {
  name?: string;
  pictureUrl?: string | null;
  uid?: string;
}

const UserProfile = ({ name, pictureUrl, uid }: UserProfileProps) => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      {pictureUrl ? (
        <ProfileImage
          width="100"
          height="100"
          src={pictureUrl}
          alt={name || 'User Name'}
        />
      ) : (
        <ProfileIcon />
      )}
      <Typography textAlign="center" component={'h3'}>
        {name}
      </Typography>
    </Box>
  );
};

const FriendRequestSection = () => {
  const { t } = useLanguageContext();
  const router = useRouter();
  const params = useParams();
  const paramsUserId = params.slug;
  const [errorPage, setErrorPage] = useState<string>();
  const [friend, setFriend] = useState<FriendProfile>();
  const { user } = useUserContext();

  const onCancel = () => {
    router.back();
  };

  const onConfirm = async () => {
    if (!user?.userId || !friend?.userId) return;
    const [uuid1, uuid2] = orderUUIDs(user?.userId, friend?.userId);
    try {
      await sendFriendRequest({
        uuid1_accepted: uuid1 === user?.userId,
        uuid2_accepted: uuid2 === user?.userId,
        uuid1: uuid1,
        uuid2: uuid2,
      });
      await awardXP(
        user.userId,
        'friend_invite',
        {
          invited_user_id: friend.userId,
        },
        {
          idempotencyKey: `friend_invite:${uuid1}:${uuid2}`,
        },
      );
      toast.success(t.friendRequestSent);
      router.push(NAV_APP_LINKS.community.link);
    } catch (error) {
      console.error('Error in FriendRequestSection (onConfirm):', error);
      toast.error(t.unableToSendFriendRequest);
    }
  };

  const getUserProfile = async () => {
    if (typeof paramsUserId === 'string' && user?.userId !== paramsUserId) {
      try {
        const friendsData = await fetchProfilesByIds([paramsUserId]);
        setFriend(friendsData[0]);
      } catch (error) {
        console.error('Error in FriendRequestSection (getUserProfile):', error);
        toast.error(t.unableToRetrieveFriendProfile);
      }
    }
  };

  useEffect(() => {
    if (user?.userId === paramsUserId) {
      // cover edge case when user enters his own uuid. Show exception page.
      setErrorPage(t.cantAddYourselfAsFriend);
    } else {
      getUserProfile();
      setErrorPage(undefined);
    }
  }, []);

  if (errorPage) {
    return <ErrorPage text={errorPage} />;
  }

  return (
    <Container className="container-box" maxWidth="sm">
      <Card>
        <Typography textAlign="center" my={2} component="h1" variant="h4">
          Friend Request
        </Typography>
        <Typography textAlign="center">
          {t.addFriendText.replace('{{name}}', friend?.fullName || '')}
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          my={5}
        >
          <UserProfile name={user?.fullName} pictureUrl={user?.pictureUrl} />
          <UserProfile
            name={friend?.fullName}
            pictureUrl={friend?.pictureUrl}
          />
        </Box>
        <Typography>{t.friendRequestSharingInfo}</Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button color="success" onClick={onCancel}>
            {t.cancel}
          </Button>
          <Button color="success" variant="contained" onClick={onConfirm}>
            {t.sendFriendRequest}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default FriendRequestSection;
