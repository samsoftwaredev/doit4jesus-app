import { IconButton, Tooltip } from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import { useAudioContext } from "context/AudioContext";

const AudioControllers = () => {
  const { forwardAudio } = useAudioContext();

  return (
    <Tooltip title="Forward">
      <IconButton color="primary" onClick={forwardAudio} href="#next">
        <RedoIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AudioControllers;
