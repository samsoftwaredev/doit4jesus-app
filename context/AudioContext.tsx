import { createContext, MouseEventHandler, useContext, useState } from "react";
import { YouTubeVideo } from "@/components";
import {
  INTERFACE_AUDIO_TYPE,
  INTERFACE_AUDIO_STATE,
  INTERFACE_AUDIO_PROPS,
} from "@/constants";

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
  audioPlayer: INTERFACE_AUDIO_PROPS;
  type?: INTERFACE_AUDIO_TYPE;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const AudioContextProvider = ({
  children,
  audioPlayer,
  type = INTERFACE_AUDIO_TYPE.YOUTUBE_LINK,
}: Props) => {
  const [audioState, setAudioState] = useState(INTERFACE_AUDIO_STATE.PAUSED);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [volume, setVolume] = useState(audioPlayer.audioVolume);

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
          id={audioPlayer.audio}
          visible={audioPlayer.visible}
          volume={audioPlayer.audioVolume}
          audioSpeed={audioPlayer.audioSpeed}
          audioLoop={audioPlayer.audioLoop}
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
