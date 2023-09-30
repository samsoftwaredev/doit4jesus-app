import type { NextPage } from "next";
import { RosaryAudioPlayer } from "@/sections/index";
import { MainLayout } from "@/layouts/index";

const Rosary: NextPage = () => {
  return (
    <MainLayout>
      <RosaryAudioPlayer />
    </MainLayout>
  );
};

export default Rosary;
