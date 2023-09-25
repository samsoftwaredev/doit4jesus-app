import { MainLayout } from "@/layouts/index";
import type { NextPage } from "next";
import { ConfessionGuide } from "@/components/Sections";

const Confession: NextPage = () => {
  return (
    <MainLayout>
      <ConfessionGuide />
    </MainLayout>
  );
};

export default Confession;
