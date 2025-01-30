import RedoIcon from '@mui/icons-material/Redo';
import { IconButton, Tooltip } from '@mui/material';
import { track } from '@vercel/analytics';

import { useAudioContext } from '@/context/AudioContext';
import { useUserContext } from '@/context/UserContext';

const AudioControllers = () => {
  const { user } = useUserContext();
  const { forwardAudio, audioPlayer } = useAudioContext();

  const onClickForward = () => {
    forwardAudio();
    track('ForwardRosaryClicked', { userId: user?.userId! });
  };

  return (
    <Tooltip title="Forward">
      <span>
        <IconButton
          data-testid="forward-button"
          disabled={audioPlayer?.audio === undefined}
          color="info"
          onClick={onClickForward}
          href="#next"
        >
          <RedoIcon fontSize="large" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default AudioControllers;
