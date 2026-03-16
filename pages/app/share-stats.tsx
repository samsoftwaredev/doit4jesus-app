import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import ShareStatsSection from '@/components/Sections/ShareStatsSection';
import { AppLayout } from '@/components/Templates';

const ShareStats: NextPage = () => {
  return (
    <AppLayout>
      <ShareStatsSection />
    </AppLayout>
  );
};

const ShareStatsPageWrapper = () => {
  return (
    <AppWrapper>
      <ShareStats />
    </AppWrapper>
  );
};

export default ShareStatsPageWrapper;
