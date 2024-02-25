import { IconButton, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useAudioContext } from "context/AudioContext";

const AudioPrevious = () => {
  const { backwardAudio } = useAudioContext();

  return (
    <Tooltip title="Backward">
      <IconButton color="info" onClick={backwardAudio} href="#prev">
        <UndoIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AudioPrevious;
