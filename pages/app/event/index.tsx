import { Container } from '@mui/material';
import type { NextPage } from 'next';

import { Meta } from '@/components';
import AppWrapper from '@/components/AppWrapper';
import { AppLayout } from '@/components/Templates';

const LiveEvent: NextPage = () => {
  return (
    <AppLayout>
      <Meta pageTitle="Resources" />
      <Container maxWidth="lg">
        <p>No event</p>
      </Container>
    </AppLayout>
  );
};

const LiveEventWrapper = () => {
  return (
    <AppWrapper>
      <LiveEvent />
    </AppWrapper>
  );
};

export default LiveEventWrapper;
