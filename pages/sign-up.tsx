import { Box, Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useMemo } from 'react';

import { MainLayout, Meta } from '@/components';
import { pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const Register: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const { user } = useUserContext();
  const isAuth = !!user;
  const pageLanguage = useMemo(() => pageView[lang], [lang]);

  if (isAuth) return null;

  return (
    <MainLayout>
      <Meta pageTitle="Sign Up" />
      <Container maxWidth="xs">
        <Typography mt={3} variant="h4" component="h1">
          {pageLanguage.signUp.title}
        </Typography>
        <Typography component="p">{pageLanguage.signUp.header}</Typography>
        <Box my={2}>{pageLanguage.signUp?.component}</Box>
        <Typography textAlign="center" component="p">
          {pageLanguage.signUp.footer}
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default Register;
