import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { AuthLayout } from '@/components/Templates';
import { NAV_APP_LINKS, pageView } from '@/constants';
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
    <AuthLayout
      pageTitle="Log In"
      title={pageLanguage.logIn.title}
      header={pageLanguage.logIn.header}
      footer={pageLanguage.logIn.footer}
    >
      {pageLanguage.logIn?.component}
    </AuthLayout>
  );
};

export default Login;
