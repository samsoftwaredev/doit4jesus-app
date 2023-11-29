import { useEffect, useMemo, useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useAudioContext } from "@/context/AudioContext";
import { INTERFACE_AUDIO_STATE } from "@/interfaces";

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

  const toggleText = () => {
    if (audioState === INTERFACE_AUDIO_STATE.PLAYING) return "Pause";
    return "Play";
  };

  useEffect(() => {
    setButtonState(audioState);
  }, [audioState]);

  const getIcon = () => {
    switch (audioState) {
      case INTERFACE_AUDIO_STATE.BUFFERING:
      case INTERFACE_AUDIO_STATE.VIDEO_CUED:
        return <CircularProgress sx={{ color: "white" }} />;
      case INTERFACE_AUDIO_STATE.PAUSED:
        return <PlayIcon fontSize="large" sx={{ color: "white" }} />;
      case INTERFACE_AUDIO_STATE.PLAYING:
      default:
        return <PauseIcon fontSize="large" sx={{ color: "white" }} />;
    }
  };

  const icon = useMemo(() => getIcon(), [audioState]);

  return (
    <Tooltip title={toggleText()}>
      <IconButton
        disabled={audioState === INTERFACE_AUDIO_STATE.BUFFERING}
        onClick={handleToggleAudioPlaying}
        href={`#${audioText(audioState === INTERFACE_AUDIO_STATE.PLAYING)}`}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default AudioPlay;
