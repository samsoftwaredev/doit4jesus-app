import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getUserProfileAPI } from 'services';

import { db, supabase } from '@/class/index';
import { NAV_APP_LINKS } from '@/constants/nav';
import { useUserContext } from '@/context/UserContext';
import { FriendProfile } from '@/interfaces/index';
import { emailRegEx, nameRegEx } from '@/utils/regEx';

import CopyLinkButton from '../CopyLinkButton/CopyLinkButton';
import Dialog from '../Dialog';
import FormErrorText from '../FormErrorText';
import HorizontalDivider from '../HorizontalDivider';

type FormValues = {
  friendName: string;
  friendEmail: string;
};

const InviteFriend = () => {
  const { user } = useUserContext();
  const textQR =
    window.location.origin + NAV_APP_LINKS.friendRequest.link + user?.userId;
  const [isOpen, setIsOpen] = useState(false);
  const [friendsProfiles, setFriendProfiles] = useState<FriendProfile[]>([]);
  const [imageQRBase64, setImageQRBase64] = useState('');
  const { control, reset, handleSubmit } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      friendEmail: '',
      friendName: '',
    },
  });

  const onSubmit = async ({ friendEmail, friendName }: FormValues) => {
    const { data, error } = await supabase.functions.invoke('invite-friend', {
      body: {
        fullName: `${user?.firstName} ${user?.lastName}`,
        friendName: friendName,
        friendEmail: friendEmail,
      },
    });

    if (data) {
      toast.success('An invite was sent to ' + friendName);
      setIsOpen(false);
      reset();
    }
    if (error) {
      toast.error('Unable to send invite to ' + friendName);
    }
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    reset();
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
      <Typography fontSize="small" textAlign="center" fontWeight="light">
        Friends Invited
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
        <FormControl
          fullWidth
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            <HorizontalDivider />
            <Typography>Send and invite via email:</Typography>
            <Grid
              mt={2}
              container
              component="form"
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Grid item md="auto">
                <Controller
                  name="friendName"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: nameRegEx,
                      message: 'Invalid name',
                    },
                    minLength: {
                      value: 1,
                      message: "Your friend's name is too short",
                    },
                    maxLength: {
                      value: 100,
                      message: "Your friend's name exceed max length",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      placeholder="Friend's Name"
                      {...field}
                    />
                  )}
                />
                <FormErrorText
                  fieldName="Friend's Name"
                  name="friendName"
                  control={control}
                />
              </Grid>
              <Grid item md="auto">
                <Controller
                  name="friendEmail"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: emailRegEx,
                      message: 'Invalid email address',
                    },
                    maxLength: {
                      value: 100,
                      message: 'The email exceed max length',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      placeholder="Friend's Email"
                      {...field}
                    />
                  )}
                />
                <FormErrorText
                  fieldName="Friend's Email"
                  name="friendEmail"
                  control={control}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button onClick={onClose}>Close</Button>
            <Button variant="contained" color="success" type="submit">
              Send Invite
            </Button>
          </Box>
        </FormControl>
      </Dialog>
    </>
  );
};

export default InviteFriend;
