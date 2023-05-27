import type { NextPage } from "next";
import { MainContent, RosaryAudioPlayer } from "@/components";

const Rosary: NextPage = () => {
  return (
    <MainContent>
      <RosaryAudioPlayer />
    </MainContent>
  );
};

export default Rosary;
