import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';
import { track } from '@vercel/analytics';
import { useAudioContext } from 'context/AudioContext';

import { useUserContext } from '@/context/UserContext';

const AudioPrevious = () => {
  const { user } = useUserContext();
  const { backwardAudio, audioPlayer } = useAudioContext();

  const onClickBackward = () => {
    backwardAudio();
    track('BackwardRosaryClicked', { userId: user?.userId! });
  };

  return (
    <Tooltip title="Backward">
      <span>
        <IconButton
          data-testid="backward-button"
          disabled={audioPlayer?.audio === undefined}
          color="info"
          onClick={onClickBackward}
          href="#prev"
        >
          <UndoIcon fontSize="large" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default AudioPrevious;
