import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { MainLayout, Meta } from '@/components';
import { NAV_APP_LINKS, pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

/**
 * DO NOT REMOVE PAGE!
 * This register page is needed for email sent to confirm account.
 */

const Register: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const navigate = useRouter();
  const { user } = useUserContext();
  const isAuth = !!user;
  const pageLanguage = useMemo(() => pageView[lang], [lang]);

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
          {pageLanguage.signUp.title}
        </Typography>
        <Typography variant="body1" component="p">
          {pageLanguage.signUp.header}
        </Typography>
        <Box my={2}>{pageLanguage.signUp?.component}</Box>
        <Typography textAlign="center" variant="body1" component="p">
          {pageLanguage.signUp.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
