import { IconButton, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useAudioContext } from "context/AudioContext";

const AudioPrevious = () => {
  const { backwardAudio, audioPlayer } = useAudioContext();

  return (
    <Tooltip title="Backward">
      <span>
        <IconButton
          disabled={audioPlayer?.audio === undefined}
          color="info"
          onClick={backwardAudio}
          href="#prev"
        >
          <UndoIcon fontSize="large" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default AudioPrevious;
