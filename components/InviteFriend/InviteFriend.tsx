import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/classes';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces';
import { getUserProfileAPI } from '@/services';

import CopyLinkButton from '../CopyLinkButton/CopyLinkButton';
import Dialog from '../Dialog';
import HorizontalDivider from '../HorizontalDivider';

const InviteFriend = () => {
  const { user } = useUserContext();
  const textQR =
    window.location.origin + NAV_APP_LINKS.friendRequest.link + user?.userId;
  const [isOpen, setIsOpen] = useState(false);
  const [friendsProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [imageQRBase64, setImageQRBase64] = useState('');

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const generateQR = async () => {
    try {
      const base64Image = await QRCode.toDataURL(textQR);
      setImageQRBase64(base64Image);
    } catch (err) {
      console.error(err);
    }
  };

  const getFriendsProfiles = async (userIds: string[]) => {
    const [data, error] = await getUserProfileAPI(userIds);
    if (error) {
      console.error(error);
      toast.error('Unable to retrieve friends profile.');
    }
    if (data) setFriendProfiles(data);
  };

  const getFriends = async () => {
    let { data, error } = await db
      .getFriends()
      .select('*')
      .or(`uuid1.eq.${user?.userId!},uuid2.eq.${user?.userId!}`);
    if (data) {
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
    generateQR();
  }, []);

  return (
    <>
      <Typography fontWeight="bold" textAlign="center">
        Number of Friends
      </Typography>
      <Typography
        textAlign="center"
        fontWeight="bold"
        component="h3"
        variant="h2"
      >
        {friendsProfiles.length}
      </Typography>
      <Button onClick={onOpen} fullWidth color="success" variant="outlined">
        Invite Friend
      </Button>
      <Dialog open={isOpen} handleClose={onClose} modalTitle="Invite Friend">
        <Box sx={{ maxWidth: `500px` }}>
          <Typography mb={1}>
            We&apos;re gathering a bunch of cool souls to pray the rosary. Who
            knows better than you?
          </Typography>
          <Typography>Ask your friend to scan the code below:</Typography>
          <Box display="flex" justifyContent="center">
            <Image
              width="200"
              height="200"
              src={imageQRBase64}
              alt="Friend Request QR code"
            />
          </Box>
          <HorizontalDivider />
          <Typography>Share link:</Typography>
          <CopyLinkButton link={textQR} />
        </Box>
      </Dialog>
    </>
  );
};

export default InviteFriend;
