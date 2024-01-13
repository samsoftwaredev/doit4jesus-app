import { createContext, MouseEventHandler, useContext, useState } from "react";
import { AudioDialog, YouTubeVideo } from "@/components";
import {
  INTERFACE_AUDIO_TYPE,
  INTERFACE_AUDIO_STATE,
  INTERFACE_AUDIO_PROPS,
  INTERFACE_AUDIO_SEEK,
} from "@/interfaces";

interface AudioContext {
  /** Unique id of the item */
  audioState: INTERFACE_AUDIO_STATE;
  setAudioState: Function;
  isAudioMute: boolean;
  toggleIsAudioMute: Function;
  forwardAudio: MouseEventHandler<HTMLAnchorElement>;
  backwardAudio: MouseEventHandler<HTMLAnchorElement>;
  toggleDialog: () => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
  audioPlayer: INTERFACE_AUDIO_PROPS;
  type?: INTERFACE_AUDIO_TYPE;
}

const AudioContext = createContext<AudioContext | undefined>(undefined);

const AudioContextProvider = ({
  children,
  audioPlayer,
  type = INTERFACE_AUDIO_TYPE.YOUTUBE_LINK,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const toggleDialog = () => {
    setIsDialogOpen((prevState) => !prevState);
  };

  const value = {
    audioState,
    setAudioState,
    isAudioMute,
    toggleIsAudioMute,
    forwardAudio,
    backwardAudio,
    toggleDialog,
  };

  return (
    <AudioContext.Provider value={value}>
      {type === INTERFACE_AUDIO_TYPE.YOUTUBE_LINK && (
        <AudioDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          title={audioPlayer.audioTitle}
        >
          <YouTubeVideo
            id={audioPlayer.audio}
            onChange={setAudioState}
            setAudioTimer={setAudioTimer}
            volume={audioPlayer.audioVolume}
            audioSpeed={audioPlayer.audioSpeed}
            audioLoop={audioPlayer.audioLoop}
            audioSeek={audioTimer}
            audioState={audioState}
          />
        </AudioDialog>
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
