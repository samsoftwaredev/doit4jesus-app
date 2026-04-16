import { Container } from '@mui/material';
import type { NextPage } from 'next';

import { Meta } from '@/components';
import AppWrapper from '@/components/AppWrapper';
import { NoDataAvailable } from '@/components/NoDataAvailable';
import { AppLayout } from '@/components/Templates';

const LiveEvent: NextPage = () => {
  return (
    <AppLayout>
      <Meta pageTitle="Resources" />
      <Container maxWidth="lg">
        <NoDataAvailable />
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
