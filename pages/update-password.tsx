import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';

import { Meta } from '@/components';
import { UpdatePassword } from '@/components/Sections';
import { MainLayout } from '@/components/Templates';
import { useLanguageContext } from '@/context/LanguageContext';

const Register: NextPage = () => {
  const { t } = useLanguageContext();
  return (
    <MainLayout>
      <Meta pageTitle="Register" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {t.updatePassword}
        </Typography>
        <Typography variant="body1" component="p">
          {t.updatePasswordDescription}
        </Typography>
        <Box my={2}>
          <UpdatePassword />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Register;
