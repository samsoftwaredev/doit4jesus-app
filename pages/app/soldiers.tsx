import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import { FriendsSection } from '@/components/Sections';
import { AppLayout } from '@/components/Templates';

const Friends: NextPage = () => {
  return (
    <AppLayout>
      <FriendsSection />
    </AppLayout>
  );
};

const FriendsWrapper = () => {
  return (
    <AppWrapper>
      <Friends />
    </AppWrapper>
  );
};

export default FriendsWrapper;
