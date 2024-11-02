import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { YouTubeVideo } from '@/components';
import {
  INTERFACE_AUDIO_PROPS,
  INTERFACE_AUDIO_SEEK,
  INTERFACE_AUDIO_STATE,
} from '@/interfaces';

import { NAV_APP_LINKS } from '../constants';

type FunctionCallback = undefined | Function;

interface AudioContext {
  audioProgress: number;
  audioState: INTERFACE_AUDIO_STATE;
  setAudioState: Function;
  isAudioMute: boolean;
  toggleIsAudioMute: Function;
  forwardAudio: MouseEventHandler<HTMLAnchorElement>;
  backwardAudio: MouseEventHandler<HTMLAnchorElement>;
  audioPlayer?: INTERFACE_AUDIO_PROPS;
  setAudioPlayer: Dispatch<SetStateAction<INTERFACE_AUDIO_PROPS | undefined>>;
  goToEvent: () => void;
  hideMusicPlayer: boolean;
  setHideMusicPlayer: React.Dispatch<SetStateAction<boolean>>;
  setCallbackOnCompleteVideo: (func: () => void) => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  hideMusicPlayer: boolean;
  setHideMusicPlayer: React.Dispatch<SetStateAction<boolean>>;
}

const AudioContext = createContext<AudioContext | undefined>(undefined);

const AudioContextProvider = ({
  children,
  hideMusicPlayer,
  setHideMusicPlayer,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  let onCompletedCallback: FunctionCallback;
  const [audioPlayer, setAudioPlayer] = useState<
    INTERFACE_AUDIO_PROPS | undefined
  >();
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
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
    router.push(`${NAV_APP_LINKS.event.link}/${audioPlayer?.id}`);
  };

  const onResetAudio = () => {
    onCompletedCallback = undefined;
  };

  const setCallbackOnCompleteVideo = (func: () => void) => {
    onCompletedCallback = func;
  };

  useEffect(() => {
    const videoNearCompletion = audioProgress > 85;
    if (videoNearCompletion && typeof onCompletedCallback === 'function') {
      onCompletedCallback();
      onResetAudio();
    }
  }, [audioState, audioProgress]);

  useEffect(() => {
    return () => {
      onResetAudio();
    };
  }, []);

  const value = {
    audioProgress,
    audioState,
    setAudioState,
    isAudioMute,
    toggleIsAudioMute,
    forwardAudio,
    backwardAudio,
    goToEvent,
    audioPlayer,
    setAudioPlayer,
    hideMusicPlayer,
    setHideMusicPlayer,
    setCallbackOnCompleteVideo,
  };

  return (
    <AudioContext.Provider value={value}>
      {!hideMusicPlayer && audioPlayer?.audio && (
        <YouTubeVideo
          showVideo={
            pathname.includes(NAV_APP_LINKS.liveEvent.link) ||
            pathname.includes(NAV_APP_LINKS.event.link)
          }
          id={audioPlayer?.audio}
          onChange={setAudioState}
          setAudioTimer={setAudioTimer}
          setAudioProgress={setAudioProgress}
          volume={audioPlayer?.audioVolume}
          audioSpeed={audioPlayer?.audioSpeed}
          audioLoop={audioPlayer?.audioLoop}
          audioSeek={audioTimer}
          audioState={audioState}
        />
      )}
      {children}
    </AudioContext.Provider>
  );
};

const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within a ContextProvider');
  }
  return context;
};

export { AudioContextProvider, useAudioContext };
