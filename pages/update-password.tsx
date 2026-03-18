import type { NextPage } from 'next';

import { UpdatePassword } from '@/components/Sections';
import { AuthLayout } from '@/components/Templates';
import { useLanguageContext } from '@/context/LanguageContext';

const Register: NextPage = () => {
  const { t } = useLanguageContext();
  return (
    <AuthLayout
      pageTitle="Register"
      title={t.updatePassword}
      header={t.updatePasswordDescription}
    >
      <UpdatePassword />
    </AuthLayout>
  );
};

export default Register;
