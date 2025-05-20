import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { Meta } from '@/components';
import { MainLayout } from '@/components/Templates';
import { NAV_APP_LINKS } from '@/constants';
import { pageView } from '@/constants/register';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const Login: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const navigate = useRouter();
  const { user } = useUserContext();
  const isAuth = !!user;

  useEffect(() => {
    // if user is auth, navigate user to application
    if (isAuth) navigate.push(NAV_APP_LINKS.dashboard.link);
  }, []);

  const pageLanguage = useMemo(() => pageView[lang], [lang]);

  if (isAuth) return null;

  return (
    <MainLayout>
      <Meta pageTitle="Log In" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {pageLanguage.logIn.title}
        </Typography>
        <Typography component="p">{pageLanguage.logIn.header}</Typography>
        <Box my={2}>{pageLanguage.logIn?.component}</Box>
        <Typography textAlign="center" component="p">
          {pageLanguage.logIn.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Login;
