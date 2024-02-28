import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { Meta } from "@/components";
import { Container } from "@mui/material";
import AppWrapper from "@/components/AppWrapper";

const LiveEventWrapper = () => {
  return (
    <AppWrapper>
      <LiveEvent />
    </AppWrapper>
  );
};

const LiveEvent: NextPage = () => {
  return (
    <AppWrapper>
      <AppLayout>
        <Meta pageTitle="Resources" />
        <Container maxWidth="lg">
          <p>No event</p>
        </Container>
      </AppLayout>
    </AppWrapper>
  );
};

export default LiveEventWrapper;
