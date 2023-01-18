import {
  createContext,
  LegacyRef,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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

enum AudioType {
  AUDIO_FILE = "AUDIO FILE",
  YOUTUBE_LINK = "YOUTUBE LINK",
}

interface Props {
  children: JSX.Element | JSX.Element[];
  type?: AudioType;
  audio: string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

class AudioFile {
  isReady = false;
  isPlaying = false;
  private _play = Function;
  private _pause = Function;
  private _ready = Function;
  private _audioSrc: HTMLAudioElement = new Audio();

  constructor(audio: string) {
    if (typeof Audio !== "undefined") {
      this._audioSrc = new Audio(audio);
    }
  }

  play() {
    return this._play;
  }

  pause() {
    return this._pause;
  }

  ready() {
    return this._ready;
  }

  audioSrc() {
    return this._audioSrc;
  }
}

class YouTubeLink {
  isReady = false;
  isPlaying = false;
  private _play = Function;
  private _pause = Function;
  private _element = Function;

  constructor(youtubeLink: string, elementId: string) {
    const element = document.getElementById(elementId);
    const youTubeIframe = this._appendIframe(youtubeLink);

    element?.appendChild(youTubeIframe);
  }

  private _appendIframe(youtubeLink: string) {
    const iframeElem = document.createElement("iframe");
    iframeElem!.setAttribute("src", youtubeLink);
    iframeElem!.setAttribute("height", "315");
    iframeElem!.setAttribute("width", "560");
    iframeElem!.setAttribute("title", "YouTube video player");
    iframeElem!.setAttribute("frameborder", "0");
    iframeElem!.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );
    return iframeElem;
  }

  play() {
    return this._play;
  }

  pause() {
    return this._pause;
  }

  ready() {}

  audioSrc() {
    return this._element;
  }
}

const setAudioType = (type: AudioType, audio: any) => {
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
  type = AudioType.AUDIO_FILE,
}: Props) => {
  const elementId = "audio-context-provider";
  let isReadyPlayAudio = useRef(false);
  let audioRef = useRef<HTMLIFrameElement>(null);

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
    if (audioRef.current) {
      const myYTAudio = new YouTubeLink(audio, elementId);
      myYTAudio.ready();
    }
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
      <div id={elementId} ref={audioRef} />
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
