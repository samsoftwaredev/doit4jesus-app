import type { NextPage } from 'next';
import { useMemo } from 'react';

import { AuthLayout } from '@/components/Templates';
import { pageView } from '@/constants';
import { useLanguageContext } from '@/context/LanguageContext';

const Register: NextPage = () => {
  const { lang } = useLanguageContext() as { lang: keyof typeof pageView };
  const pageLanguage = useMemo(() => pageView[lang], [lang]);

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
