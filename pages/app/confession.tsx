import { AppLayout } from "@/layouts";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/sections";
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
