import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import AchievementsSection from '@/components/Sections/AchievementsSection';
import SpiritualProgressSection from '@/components/Sections/SpiritualProgressSection';
import { AppLayout } from '@/components/Templates';

const Achievements: NextPage = () => {
  return (
    <AppLayout>
      <SpiritualProgressSection />
      <AchievementsSection />
    </AppLayout>
  );
};

const AchievementsPageWrapper = () => {
  return (
    <AppWrapper>
      <Achievements />
    </AppWrapper>
  );
};

export default AchievementsPageWrapper;
