import {
  createContext,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { YouTubeVideo } from "@/components";
import {
  INTERFACE_AUDIO_STATE,
  INTERFACE_AUDIO_PROPS,
  INTERFACE_AUDIO_SEEK,
  INTERFACE_LANGUAGES,
} from "@/interfaces";
import { AppLayout } from "../layouts";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { NAV_APP_LINKS } from "../constants";
import { myRosary } from "@/class";

interface AudioContext {
  audioState: INTERFACE_AUDIO_STATE;
  setAudioState: Function;
  isAudioMute: boolean;
  toggleIsAudioMute: Function;
  forwardAudio: MouseEventHandler<HTMLAnchorElement>;
  backwardAudio: MouseEventHandler<HTMLAnchorElement>;
  audioPlayer: INTERFACE_AUDIO_PROPS;
  setAudioPlayer: Dispatch<SetStateAction<INTERFACE_AUDIO_PROPS>>;
  goToEvent: () => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AudioContext = createContext<AudioContext | undefined>(undefined);

const AudioContextProvider = ({ children }: Props) => {
  const rosary = myRosary;
  const rosaryState = rosary.getRosaryState();
  const pathname = usePathname();
  const router = useRouter();
  const [audioPlayer, setAudioPlayer] = useState<INTERFACE_AUDIO_PROPS>({
    audio: rosary.getAudio(INTERFACE_LANGUAGES.en),
    audioTitle: `Today's Rosary: ${rosaryState.mystery}   `,
  });
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [audioState, setAudioState] = useState(INTERFACE_AUDIO_STATE.PAUSED);
  const [audioTimer, setAudioTimer] = useState<INTERFACE_AUDIO_SEEK>(
    INTERFACE_AUDIO_SEEK.NEUTRAL
  );

  const toggleIsAudioMute = () => {
    setIsAudioMute((prevState) => !prevState);
  };

  const forwardAudio = () => {
    setAudioTimer(INTERFACE_AUDIO_SEEK.FORWARDS);
  };

  const backwardAudio = () => {
    setAudioTimer(INTERFACE_AUDIO_SEEK.BACKWARDS);
  };

  const goToEvent = () => {
    router.push(NAV_APP_LINKS.liveEvent.link);
  };

  const value = {
    audioState,
    setAudioState,
    isAudioMute,
    toggleIsAudioMute,
    forwardAudio,
    backwardAudio,
    goToEvent,
    audioPlayer,
    setAudioPlayer,
  };

  return (
    <AudioContext.Provider value={value}>
      <YouTubeVideo
        showVideo={
          pathname.includes(NAV_APP_LINKS.liveEvent.link) ||
          pathname.includes(NAV_APP_LINKS.event.link)
        }
        id={audioPlayer.audio}
        onChange={setAudioState}
        setAudioTimer={setAudioTimer}
        volume={audioPlayer.audioVolume}
        audioSpeed={audioPlayer.audioSpeed}
        audioLoop={audioPlayer.audioLoop}
        audioSeek={audioTimer}
        audioState={audioState}
      />
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
