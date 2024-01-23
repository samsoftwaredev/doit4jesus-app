import type { NextPage } from "next";
import { AppLayout } from "@/layouts";
import { Meta } from "@/components";
import { Container } from "@mui/material";

const Event: NextPage = () => {
  return (
    <AppLayout>
      <Meta pageTitle="Resources" />
      <Container maxWidth="lg">
        <p>No event</p>
      </Container>
    </AppLayout>
  );
};

export default Event;
