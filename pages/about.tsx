import type { NextPage } from 'next';

import { Meta } from '@/components';
import AboutSection from '@/components/Sections/AboutSection';
import { MainLayout } from '@/components/Templates';

const About: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="About" />
      <AboutSection />
    </MainLayout>
  );
};

export default About;
