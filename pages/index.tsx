import type { NextPage } from 'next';

import {
  AppIntroduction,
  CallToAction,
  Community,
  Features,
  Hero,
  HowItWorks,
  Meta,
  WhyPrayRosary,
} from '@/components';
import RosaryWeapon from '@/components/RosaryWeapon';
import { MainLayout } from '@/components/Templates';

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Meta pageTitle="Pray the Rosary" />
      <Hero />
      <AppIntroduction />
      <HowItWorks />
      <Features />
      <RosaryWeapon />
      <Community />
      <WhyPrayRosary />
      <CallToAction />
    </MainLayout>
  );
};

export default Home;
