import { AccountCircle } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes';
import { Card } from '@/components';
import { NAV_APP_LINKS } from '@/constants';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces';
import { normalizeFriendProfile, orderUUIDs } from '@/utils';

import { ErrorPage } from '../..';
import styles from './FriendRequestSection.module.scss';

interface UserProfileProps {
  name?: string;
  pictureUrl?: string | null;
  uid?: string;
}

const UserProfile = ({ name, pictureUrl, uid }: UserProfileProps) => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      {pictureUrl ? (
        <Image
          width="100"
          height="100"
          className={styles.profile}
          src={pictureUrl}
          alt={name || 'User Name'}
        />
      ) : (
        <AccountCircle className={styles.profileIcon} />
      )}
      <Typography textAlign="center" component={'h3'}>
        {name}
      </Typography>
    </Box>
  );
};

const FriendRequestSection = () => {
  const navigate = useRouter();
  const { slug: paramsUserId } = navigate.query;
  const [errorPage, setErrorPage] = useState<string>();
  const [friend, setFriend] = useState<FriendProfile>();
  const { user } = useUserContext();

  const onCancel = () => {
    navigate.back();
  };

  const onConfirm = async () => {
    if (!user?.userId || !friend?.userId) return;
    const [uuid1, uuid2] = orderUUIDs(user?.userId, friend?.userId);
    const { data, error } = await db
      .getFriendRequests()
      .insert([
        {
          uuid1_accepted: uuid1 === user?.userId,
          uuid2_accepted: uuid2 === user?.userId,
          uuid1: uuid1,
          uuid2: uuid2,
        },
      ])
      .select();
    if (data) {
      toast.success('Friend request sent');
      navigate.push(NAV_APP_LINKS.friends.link);
    }
    if (error) {
      toast.error('Unable to send friend request');
    }
  };

  const getUserProfile = async () => {
    if (typeof paramsUserId === 'string' && user?.userId !== paramsUserId) {
      let { data, error } = await supabase.rpc('get_profiles_by_user_ids', {
        user_ids: [paramsUserId],
      });
      if (error) {
        console.error(error);
        toast.error('Unable to retrieve friends profile.');
      } else {
        const friendsData = normalizeFriendProfile(data ?? []);
        setFriend(friendsData[0]);
      }
    }
  };

  useEffect(() => {
    if (user?.userId === paramsUserId) {
      // cover edge case when user enters his own uuid. Show exception page.
      setErrorPage("Oops! You can't add yourself as a friend");
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
          Add {friend?.fullName} as a friend
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
        <Typography>
          You will be sharing information, including profile details and
          relevant statistics such as the number of completed rosaries, along
          with other pertinent data.
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button color="success" onClick={onCancel}>
            Cancel
          </Button>
          <Button color="success" variant="contained" onClick={onConfirm}>
            Send Friend Request
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default FriendRequestSection;
