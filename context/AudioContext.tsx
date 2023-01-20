import { createContext, MouseEventHandler, useContext, useState } from "react";
import { YouTubeVideo } from "@/components";
import { INTERFACE_AUDIO_TYPE, INTERFACE_AUDIO_STATE } from "@/constants";

interface AudioContextType {
  /** Unique id of the item */
  audioState: INTERFACE_AUDIO_STATE;
  setAudioState: Function;
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
  const [audioState, setAudioState] = useState(INTERFACE_AUDIO_STATE.UNSTARTED);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [volume, setVolume] = useState(1);

  const toggleIsAudioMute = () => {
    setIsAudioMute((prevState) => !prevState);
  };

  const forwardAudio = () => {};

  const backwardAudio = () => {};

  const value = {
    audioState,
    setAudioState,
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
        <YouTubeVideo
          id={audio}
          visible={visible}
          audioState={audioState}
          onChange={setAudioState}
        />
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
