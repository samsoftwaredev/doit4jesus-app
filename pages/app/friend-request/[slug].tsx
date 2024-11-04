import type { NextPage } from 'next';

import AppWrapper from '@/components/AppWrapper';
import Meta from '@/components/Meta';
import { FriendRequestSection } from '@/components/Sections';
import { AppLayout } from '@/components/Templates';

const FriendRequest: NextPage = () => {
  return (
    <AppLayout>
      <FriendRequestSection />
    </AppLayout>
  );
};

const FriendRequestWrapper = () => {
  return (
    <AppWrapper>
      <Meta pageTitle="Friend Request" />
      <FriendRequest />
    </AppWrapper>
  );
};

export default FriendRequestWrapper;
