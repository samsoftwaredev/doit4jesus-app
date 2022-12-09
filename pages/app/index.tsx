import type { NextPage } from "next";
import { RosaryAudioPlayer } from "@/components";

const App: NextPage = () => {
  return (
    <>
      <h1>Daily Rosary</h1>
      <p>
        Meditate on the life on Jesus through the eyes of Mary with friends.
      </p>
      <RosaryAudioPlayer />
    </>
  );
};

export default App;
