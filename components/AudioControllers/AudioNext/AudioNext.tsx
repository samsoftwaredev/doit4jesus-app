import RedoIcon from '@mui/icons-material/Redo';
import { IconButton, Tooltip } from '@mui/material';

import { useAudioContext } from '@/context/AudioContext';

const AudioControllers = () => {
  const { forwardAudio, audioPlayer } = useAudioContext();

  return (
    <Tooltip title="Forward">
      <span>
        <IconButton
          disabled={audioPlayer?.audio === undefined}
          color="info"
          onClick={forwardAudio}
          href="#next"
        >
          <RedoIcon fontSize="large" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default AudioControllers;
