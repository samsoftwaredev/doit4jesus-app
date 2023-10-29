import { AppLayout } from "@/layouts";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/sections";

const Confession: NextPage = () => {
  return (
    <AppLayout>
      <ConfessionGuide />
    </AppLayout>
  );
};

export default Confession;
