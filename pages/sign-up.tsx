import type { NextPage } from 'next';
import { useMemo } from 'react';

import { AuthLayout } from '@/components/Templates';
import { pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

import { Loading } from '../components';

const Register: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const { user } = useUserContext();
  const isAuth = !!user;
  const pageLanguage = useMemo(() => pageView[lang], [lang]);

  if (isAuth) return <Loading isFeature={false} />;

  return (
    <AuthLayout
      pageTitle="Sign Up"
      title={pageLanguage.signUp.title}
      header={pageLanguage.signUp.header}
      footer={pageLanguage.signUp.footer}
    >
      {pageLanguage.signUp?.component}
    </AuthLayout>
  );
};

export default Register;
