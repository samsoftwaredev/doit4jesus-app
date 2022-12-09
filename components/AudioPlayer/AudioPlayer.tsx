import { RosaryContextProvider } from "context/RosaryContext";
import React from "react";
import { AudioNext, AudioPrevious, AudioPlay } from "../AudioControllers";

interface Props {
  children: JSX.Element[] | JSX.Element;
  audioFile: string;
}

const AudioPlayer = ({ children, audioFile }: Props) => {
  return (
    <RosaryContextProvider audioFile={audioFile}>
      {children}
    </RosaryContextProvider>
  );
};

AudioPlayer.AudioNext = AudioNext;
AudioPlayer.AudioPrevious = AudioPrevious;
AudioPlayer.AudioPlay = AudioPlay;

export { AudioPlayer };
