import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/class';
import { Card, Dialog, Loading } from '@/components';
import { useAudioContext } from '@/context/AudioContext';
import { INTERFACE_AUDIO_STATE } from '@/interfaces/index';

import styles from './accountSection.module.scss';

const AccountSection = () => {
  const { setAudioState } = useAudioContext();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('delete-user');
      if (error) throw new Error(error);
      if (data) {
        setAudioState(INTERFACE_AUDIO_STATE.PAUSED);
        toast.success('Your account was successfully deleted.');
        await db.logOut();
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete your account.');
    } finally {
      onClose();
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Container className={`container-box ${styles.container}`} maxWidth="sm">
        <Card>
          <Typography fontSize="2em">My Account</Typography>
          <Box display="flex" my={2} flexDirection="column">
            <Typography my={2}>Do you want to delete your account?</Typography>
            <Button
              sx={{ textAlign: 'right' }}
              onClick={openDialog}
              variant="contained"
              color="error"
            >
              Delete Account
            </Button>
          </Box>
        </Card>
      </Container>
      <Dialog
        maxWidth="sm"
        open={isOpen}
        handleClose={onClose}
        modalTitle="Delete Account"
      >
        <Typography my={5}>
          Are you sure you want to delete your account? Once you do, you won't
          be able to undo this action, and all your data will be permanently
          deleted.
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>
            Delete Account
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AccountSection;
