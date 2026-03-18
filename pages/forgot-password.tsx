import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { AuthLayout } from '@/components/Templates';
import { NAV_APP_LINKS, pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const ForgotPassword: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const router = useRouter();
  const { user } = useUserContext();
  const isAuth = !!user;

  const pageLanguage = useMemo(() => pageView[lang], [lang]);

  useEffect(() => {
    // if user is auth, navigate user to application
    if (isAuth) router.push(NAV_APP_LINKS.dashboard.link);
  }, []);

  if (isAuth) return null;

  return (
    <AuthLayout
      pageTitle="ForgotPassword"
      title={pageLanguage.forgotPassword.title}
      header={pageLanguage.forgotPassword.header}
      footer={pageLanguage.forgotPassword.footer}
    >
      {pageLanguage.forgotPassword?.component}
    </AuthLayout>
  );
};

export default ForgotPassword;
