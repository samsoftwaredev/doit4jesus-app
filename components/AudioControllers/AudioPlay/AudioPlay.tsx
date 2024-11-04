import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAudioContext } from '@/context/AudioContext';
import { INTERFACE_AUDIO_STATE } from '@/interfaces';
import { theme } from '@/styles/mui-overwrite';

const audioText = (isPlaying: boolean) => (isPlaying ? 'play' : 'pause');

const AudioPlay = () => {
  const { setAudioState, audioState, audioPlayer } = useAudioContext();
  const [buttonState, setButtonState] = useState<INTERFACE_AUDIO_STATE>(
    INTERFACE_AUDIO_STATE.PAUSED,
  );

  const handleToggleAudioPlaying = () => {
    const state: INTERFACE_AUDIO_STATE =
      buttonState === INTERFACE_AUDIO_STATE.PLAYING
        ? INTERFACE_AUDIO_STATE.PAUSED
        : INTERFACE_AUDIO_STATE.PLAYING;
    setAudioState(state);
  };

  const toggleText = useCallback(() => {
    if (audioState === INTERFACE_AUDIO_STATE.PLAYING) return 'Pause';
    return 'Play';
  }, [audioState]);

  useEffect(() => {
    setButtonState(audioState);
  }, [audioState]);

  const getIcon = () => {
    switch (audioState) {
      case INTERFACE_AUDIO_STATE.BUFFERING:
      case INTERFACE_AUDIO_STATE.VIDEO_CUED:
        return (
          <CircularProgress
            sx={{
              height: '10px',
              width: '10px',
              color: theme.palette.info.dark,
            }}
          />
        );
      case INTERFACE_AUDIO_STATE.PAUSED:
        return <PlayIcon fontSize="large" />;
      case INTERFACE_AUDIO_STATE.PLAYING:
      default:
        return <PauseIcon fontSize="large" />;
    }
  };

  const icon = useMemo(() => getIcon(), [audioState]);

  return (
    <Tooltip title={toggleText()}>
      <span>
        <IconButton
          color="info"
          disabled={
            audioState === INTERFACE_AUDIO_STATE.BUFFERING ||
            audioPlayer?.audio === undefined
          }
          onClick={handleToggleAudioPlaying}
          href={`#${audioText(audioState === INTERFACE_AUDIO_STATE.PLAYING)}`}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default AudioPlay;
