import type { NextPage } from "next";
import { AppLayout } from "@/components/Templates";
import { Meta } from "@/components";
import { Container } from "@mui/material";
import AppWrapper from "@/components/AppWrapper";

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
