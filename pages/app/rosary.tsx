import type { NextPage } from "next";
import { RosaryAudioPlayer } from "@/sections";
import { MainLayout } from "@/layouts";

const Rosary: NextPage = () => {
  return (
    <MainLayout>
      <RosaryAudioPlayer />
    </MainLayout>
  );
};

export default Rosary;
