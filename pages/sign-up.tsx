import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Meta } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_APP_LINKS } from '@/constants';
import { pageView } from '@/constants/register';
import { useUserContext } from '@/context/UserContext';

const Register: NextPage = () => {
  const navigate = useRouter();
  const { user } = useUserContext();
  const isAuth = !!user;

  useEffect(() => {
    // if user is auth, navigate user to application
    if (isAuth) navigate.push(NAV_APP_LINKS.dashboard.link);
  }, []);

  if (isAuth) return null;

  return (
    <MainLayout>
      <Meta pageTitle="Register" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {pageView.signUp.title}
        </Typography>
        <Typography component="p">{pageView.signUp.header}</Typography>
        <Box my={2}>{pageView.signUp?.component}</Box>
        <Typography textAlign="center" component="p">
          {pageView.signUp.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
