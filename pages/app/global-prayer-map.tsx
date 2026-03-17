import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import { GlobalPrayerMapSection } from '@/components/Sections';
import { AppLayout } from '@/components/Templates';

const GlobalPrayerMap: NextPage = () => {
  return (
    <AppLayout>
      <GlobalPrayerMapSection />
    </AppLayout>
  );
};

const GlobalPrayerMapPageWrapper = () => {
  return (
    <AppWrapper>
      <GlobalPrayerMap />
    </AppWrapper>
  );
};

export default GlobalPrayerMapPageWrapper;
