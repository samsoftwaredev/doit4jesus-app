import { INTERFACE_AUDIO_TYPE } from "@/constants/interfaces";
import { AudioContextProvider } from "context/AudioContext";
import React from "react";
import { AudioNext, AudioPrevious, AudioPlay } from "../AudioControllers";

interface Props {
  children: JSX.Element[] | JSX.Element;
  audio: string;
  type: INTERFACE_AUDIO_TYPE;
}

const AudioPlayer = ({ children, audio, type }: Props) => {
  return (
    <AudioContextProvider audio={audio} type={type}>
      {children}
    </AudioContextProvider>
  );
};

AudioPlayer.AudioNext = AudioNext;
AudioPlayer.AudioPrevious = AudioPrevious;
AudioPlayer.AudioPlay = AudioPlay;

export { AudioPlayer };
