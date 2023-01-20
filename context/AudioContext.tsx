import { createContext, MouseEventHandler, useContext, useState } from "react";
import { YouTubeVideo } from "@/components";
import { INTERFACE_AUDIO_TYPE } from "@/constants";

interface AudioContextType {
  /** Unique id of the item */
  isPlaying: boolean;
  setIsPlaying: Function;
  isAudioMute: boolean;
  toggleIsAudioMute: Function;
  volume: number;
  setVolume: Function;
  forwardAudio: MouseEventHandler<HTMLAnchorElement>;
  backwardAudio: MouseEventHandler<HTMLAnchorElement>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  audio: string;
  visible?: boolean;
  type?: INTERFACE_AUDIO_TYPE;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const AudioContextProvider = ({
  children,
  audio,
  visible = false,
  type = INTERFACE_AUDIO_TYPE.YOUTUBE_LINK,
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [volume, setVolume] = useState(1);

  const toggleIsAudioMute = () => {
    setIsAudioMute((prevState) => !prevState);
  };

  const forwardAudio = () => {};

  const backwardAudio = () => {};

  const value = {
    isPlaying,
    setIsPlaying,
    isAudioMute,
    toggleIsAudioMute,
    volume,
    setVolume,
    forwardAudio,
    backwardAudio,
  };

  return (
    <AudioContext.Provider value={value}>
      {type === INTERFACE_AUDIO_TYPE.YOUTUBE_LINK && (
        <YouTubeVideo id={audio} visible={visible} />
      )}
      {children}
    </AudioContext.Provider>
  );
};

const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within a ContextProvider");
  }
  return context;
};

export { AudioContextProvider, useAudioContext };
