import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Tooltip } from '@mui/material';
import { track } from '@vercel/analytics';
import { useAudioContext } from 'context/AudioContext';

import { useLanguageContext } from '@/context/LanguageContext';
import { useUserContext } from '@/context/UserContext';

const AudioPrevious = () => {
  const { t } = useLanguageContext();
  const { user } = useUserContext();
  const { backwardAudio, audioPlayer } = useAudioContext();

  const onClickBackward = () => {
    backwardAudio();
    track('BackwardRosaryClicked', { userId: user?.userId! });
  };

  return (
    <Tooltip title={t.backward}>
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
