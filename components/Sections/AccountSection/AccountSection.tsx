import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { db, supabase } from '@/class';

import { Card, Loading } from '../..';
import styles from './accountSection.module.scss';

const AccountSection = () => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('delete-user');
      if (error) throw new Error(error);
      if (data) {
        toast.success('Your account was successfully deleted.');
        await db.logOut();
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete your account.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Container className={`container-box ${styles.container}`} maxWidth="sm">
      <Card>
        <Typography fontSize="2em">My Account</Typography>
        <Box display="flex" my={2} flexDirection="column">
          <Typography my={2}>Do you want to delete your account?</Typography>
          <Button
            sx={{ textAlign: 'right' }}
            onClick={onDelete}
            variant="contained"
            color="error"
          >
            Delete Account
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default AccountSection;
