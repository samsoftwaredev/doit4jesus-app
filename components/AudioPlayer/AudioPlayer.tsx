import { AudioContextProvider } from "context/AudioContext";
import React from "react";
import { AudioNext, AudioPrevious, AudioPlay } from "../AudioControllers";

interface Props {
  children: JSX.Element[] | JSX.Element;
  audio: string;
}

const AudioPlayer = ({ children, audio }: Props) => {
  return <AudioContextProvider audio={audio}>{children}</AudioContextProvider>;
};

AudioPlayer.AudioNext = AudioNext;
AudioPlayer.AudioPrevious = AudioPrevious;
AudioPlayer.AudioPlay = AudioPlay;

export { AudioPlayer };
