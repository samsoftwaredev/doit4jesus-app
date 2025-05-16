import type { NextPage } from 'next';

import {
  CallToAction, // RosaryWeapon,
  Community,
  Features,
  Hero,
  HowItWorks,
  Meta,
  WhyPrayRosary,
} from '@/components';
import { MainLayout } from '@/components/Templates';

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Meta />
      <Hero />
      <HowItWorks />
      <Features />
      {/* <RosaryWeapon /> */}
      <Community />
      <WhyPrayRosary />
      <CallToAction />
    </MainLayout>
  );
};

export default Home;
