import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import SpiritualProgressSection from '@/components/Sections/SpiritualProgressSection';
import { AppLayout } from '@/components/Templates';

const SpiritualProgressPage: NextPage = () => {
  return (
    <AppLayout>
      <SpiritualProgressSection />
    </AppLayout>
  );
};

const SpiritualProgressPageWrapper = () => {
  return (
    <AppWrapper>
      <SpiritualProgressPage />
    </AppWrapper>
  );
};

export default SpiritualProgressPageWrapper;
