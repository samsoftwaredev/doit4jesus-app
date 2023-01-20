import React from "react";
import { INTERFACE_AUDIO_TYPE } from "@/constants/interfaces";
import { AudioContextProvider } from "@/context/AudioContext";
import { AudioNext, AudioPrevious, AudioPlay } from "../AudioControllers";

interface Props {
  children: JSX.Element[] | JSX.Element;
  audio: string;
  visible?: boolean;
  type?: INTERFACE_AUDIO_TYPE;
}

const AudioPlayer = ({ children, audio, type, visible }: Props) => {
  return (
    <AudioContextProvider audio={audio} type={type} visible={visible}>
      {children}
    </AudioContextProvider>
  );
};

AudioPlayer.AudioNext = AudioNext;
AudioPlayer.AudioPrevious = AudioPrevious;
AudioPlayer.AudioPlay = AudioPlay;

export { AudioPlayer };
