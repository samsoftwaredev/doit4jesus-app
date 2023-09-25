import React from "react";
import { INTERFACE_AUDIO_PROPS, INTERFACE_AUDIO_TYPE } from "@/interfaces";
import { AudioContextProvider } from "@/context/AudioContext";
import { AudioNext, AudioPrevious, AudioPlay } from "../AudioControllers";

interface Props {
  children: JSX.Element[] | JSX.Element;
  audioPlayer: INTERFACE_AUDIO_PROPS;
  type?: INTERFACE_AUDIO_TYPE;
}

const AudioPlayer = ({ children, audioPlayer, type }: Props) => {
  return (
    <AudioContextProvider type={type} audioPlayer={audioPlayer}>
      {children}
    </AudioContextProvider>
  );
};

AudioPlayer.AudioNext = AudioNext;
AudioPlayer.AudioPrevious = AudioPrevious;
AudioPlayer.AudioPlay = AudioPlay;

export { AudioPlayer };
