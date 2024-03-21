import { AppLayout } from "@/components/Layouts";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/components/Sections";
import AppWrapper from "@/components/AppWrapper";

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
