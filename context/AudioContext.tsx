import {
  createContext,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  type?: INTERFACE_AUDIO_TYPE;
  audio: string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const setAudioType = (type: INTERFACE_AUDIO_TYPE, audio: any) => {
  // switch (type) {
  //   case AudioType.YOUTUBE_LINK:
  //     const myYTAudio = new YouTubeLink(audio);
  //     return myYTAudio.audioSrc();
  // case AudioType.AUDIO_FILE:
  //   const myAudio = new AudioFile(audio);
  //   return myAudio.audioSrc();
  // }
};

const AudioContextProvider = ({
  children,
  audio,
  type = INTERFACE_AUDIO_TYPE.AUDIO_FILE,
}: Props) => {
  // const elementId = "audio-context-provider";
  // let isReadyPlayAudio = useRef(false);
  // let audioRef = useRef<HTMLIFrameElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [volume, setVolume] = useState(1);

  const toggleIsAudioMute = () => {
    setIsAudioMute((prevState) => !prevState);
  };

  const forwardAudio = () => {};

  const backwardAudio = () => {};

  useEffect(() => {
    // if (audioRef?.current) {
    //   audioRef?.current?.pause();
    //   if (isReadyPlayAudio.current) {
    //     // mute audio if audioMute was set by the user
    //     audioRef.current.volume = isAudioMute ? 0 : 1;
    //     // play the track automatically
    //     audioRef.current.play();
    //   } else {
    //     // Set the isReadyPlayAudio ref as true for the next pass
    //     if (isPlaying) isReadyPlayAudio.current = true;
    //   }
    // }
  }, [isPlaying, isAudioMute, audio]);

  useEffect(() => {
    // if (audioRef?.current) {
    //   if (isPlaying) {
    //     audioRef.current.play();
    //   } else {
    //     audioRef?.current?.pause();
    //   }
    // }
  }, [isPlaying]);

  useEffect(() => {
    // if (audioRef.current) {
    // const myYTAudio = new YouTubeLink(audio, elementId, "youtube-video-link");
    // myYTAudio.ready();
    // }
  }, []);

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
      {/* <div id={elementId} ref={audioRef} /> */}
      {type === INTERFACE_AUDIO_TYPE.YOUTUBE_LINK && (
        <YouTubeVideo id={audio} visible={false} />
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
