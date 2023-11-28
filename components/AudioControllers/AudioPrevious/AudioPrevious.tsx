import { IconButton, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useAudioContext } from "context/AudioContext";

const AudioPrevious = () => {
  const { backwardAudio } = useAudioContext();

  return (
    <Tooltip title="Backward">
      <IconButton onClick={backwardAudio} href="#prev">
        <UndoIcon sx={{ color: "white" }} fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AudioPrevious;
