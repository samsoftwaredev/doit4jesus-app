import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import { ConfessionGuide } from '@/components/Sections';
import { AppLayout } from '@/components/Templates';

const Confession: NextPage = () => {
  return (
    <AppLayout>
      <ConfessionGuide />
    </AppLayout>
  );
};

const ConfessionWrapper = () => {
  return (
    <AppWrapper>
      <Confession />
    </AppWrapper>
  );
};

export default ConfessionWrapper;
