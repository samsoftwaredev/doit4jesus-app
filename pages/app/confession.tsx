import { AppLayout } from "@/layouts";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/sections";
import AppWrapper from "@/components/AppWrapper";

const ConfessionWrapper = () => {
  return (
    <AppWrapper>
      <Confession />
    </AppWrapper>
  );
};

const Confession: NextPage = () => {
  return (
    <AppWrapper>
      <AppLayout>
        <ConfessionGuide />
      </AppLayout>
    </AppWrapper>
  );
};

export default ConfessionWrapper;
