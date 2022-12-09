import {
  createContext,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface RosaryContextType {
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

const RosaryContext = createContext<RosaryContextType | undefined>(undefined);

interface Props {
  children: JSX.Element | JSX.Element[];
  audioFile: string;
}

const RosaryContextProvider = ({ children, audioFile }: Props) => {
  let isReadyPlayAudio = useRef(false);
  let audioRef = useRef(typeof Audio !== "undefined" && new Audio(audioFile));

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [volume, setVolume] = useState(1);

  const toggleIsAudioMute = () => {
    setIsAudioMute((prevState) => !prevState);
  };

  const forwardAudio = () => {};

  const backwardAudio = () => {};

  useEffect(() => {
    if (audioRef?.current) {
      audioRef?.current?.pause();
      if (isReadyPlayAudio.current) {
        // mute audio if audioMute was set by the user
        audioRef.current.volume = isAudioMute ? 0 : 1;
        // play the track automatically
        audioRef.current.play();
      } else {
        // Set the isReadyPlayAudio ref as true for the next pass
        if (isPlaying) isReadyPlayAudio.current = true;
      }
    }
  }, [isPlaying, isAudioMute, audioFile]);

  useEffect(() => {
    if (audioRef?.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef?.current?.pause();
      }
    }
  }, [isPlaying]);

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
    <RosaryContext.Provider value={value}>{children}</RosaryContext.Provider>
  );
};

const useRosaryContext = () => {
  const context = useContext(RosaryContext);
  if (context === undefined) {
    throw new Error("useRosaryContext must be used within a ContextProvider");
  }
  return context;
};

export { RosaryContextProvider, useRosaryContext };
