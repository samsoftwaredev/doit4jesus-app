import type { NextPage } from 'next';

import { Meta } from '@/components';
import { ContactSection } from '@/components/Sections';
import { MainLayout } from '@/components/Templates';

const Contact: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="Contact Us" />
      <ContactSection />
    </MainLayout>
  );
};

export default Contact;
