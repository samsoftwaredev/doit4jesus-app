import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/classes';
import { Card, Dialog, Loading } from '@/components';
import { useAudioContext } from '@/context/AudioContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { INTERFACE_AUDIO_STATE } from '@/interfaces';

import styles from './accountSection.module.scss';

const AccountSection = () => {
  const { t } = useLanguageContext();
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
          <Typography fontSize="2em">{t.account}</Typography>
          <Box display="flex" my={2} flexDirection="column">
            <Typography my={2}>{t.deleteAccountQuestion}</Typography>
            <Button
              sx={{ textAlign: 'right' }}
              onClick={openDialog}
              variant="contained"
              color="error"
            >
              {t.deleteAccount}
            </Button>
          </Box>
        </Card>
      </Container>
      <Dialog
        maxWidth="sm"
        open={isOpen}
        handleClose={onClose}
        modalTitle={t.deleteAccount}
      >
        <Typography my={5}>{t.deleteAccountConfirmation}</Typography>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>
            {t.deleteAccount}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AccountSection;
