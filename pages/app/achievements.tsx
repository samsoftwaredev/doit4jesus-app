import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import AchievementsSection from '@/components/Sections/AchievementsSection';
import { AppLayout } from '@/components/Templates';

const Achievements: NextPage = () => {
  return (
    <AppLayout>
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
