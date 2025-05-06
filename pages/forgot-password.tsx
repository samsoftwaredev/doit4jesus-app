import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Meta } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_APP_LINKS } from '@/constants';
import { pageView } from '@/constants/register';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const ForgotPassword: NextPage = () => {
  const { t } = useLanguageContext();
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
      <Meta pageTitle="ForgotPassword" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {pageView.forgotPassword.title}
        </Typography>
        <Typography variant="body1" component="p">
          {pageView.forgotPassword.header}
        </Typography>
        <Box my={2}>{pageView.forgotPassword?.component}</Box>
        <Typography textAlign="center" variant="body1" component="p">
          {pageView.forgotPassword.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default ForgotPassword;
