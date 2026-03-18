import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { AuthLayout } from '@/components/Templates';
import { NAV_APP_LINKS, pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

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
