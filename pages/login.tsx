import type { NextPage } from 'next';
import { useMemo } from 'react';

import { AuthLayout } from '@/components/Templates';
import { pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';

const Login: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const pageLanguage = useMemo(() => pageView[lang], [lang]);

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
