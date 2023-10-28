import { MainLayout } from "@/layouts";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/sections";

const Confession: NextPage = () => {
  return (
    <MainLayout>
      <ConfessionGuide />
    </MainLayout>
  );
};

export default Confession;
