import { useEffect, useState } from "react";
import { IconButton, Box } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useAudioContext } from "@/context/AudioContext";
import { INTERFACE_AUDIO_STATE } from "@/constants/interfaces";
import { Spinner } from "@/components";

const audioText = (isPlaying: boolean) => (isPlaying ? "play" : "pause");

const AudioPlay = () => {
  const { setAudioState, audioState } = useAudioContext();
  const [buttonState, setButtonState] = useState<INTERFACE_AUDIO_STATE>(
    INTERFACE_AUDIO_STATE.PAUSED
  );

  const handleToggleAudioPlaying = () => {
    const state: INTERFACE_AUDIO_STATE =
      buttonState === INTERFACE_AUDIO_STATE.PLAYING
        ? INTERFACE_AUDIO_STATE.PAUSED
        : INTERFACE_AUDIO_STATE.PLAYING;
    setAudioState(state);
  };

  useEffect(() => {
    setButtonState(audioState);
  }, [audioState]);

  const getIcon = () => {
    switch (audioState) {
      case INTERFACE_AUDIO_STATE.BUFFERING:
      case INTERFACE_AUDIO_STATE.VIDEO_CUED:
        return <Spinner />;
      case INTERFACE_AUDIO_STATE.PLAYING:
        return <PlayIcon />;
      case INTERFACE_AUDIO_STATE.PAUSED:
      default:
        return <PauseIcon />;
    }
  };

  return (
    <Box>
      <IconButton
        disabled={audioState === INTERFACE_AUDIO_STATE.BUFFERING}
        onClick={handleToggleAudioPlaying}
        href={`#${audioText(audioState === INTERFACE_AUDIO_STATE.PLAYING)}`}
      >
        {getIcon()}
      </IconButton>
    </Box>
  );
};

export default AudioPlay;
