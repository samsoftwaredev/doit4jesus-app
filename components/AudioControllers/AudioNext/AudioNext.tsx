import { IconButton, Tooltip } from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import { useAudioContext } from "context/AudioContext";

const AudioControllers = () => {
  const { forwardAudio } = useAudioContext();

  return (
    <Tooltip title="Forward">
      <IconButton onClick={forwardAudio} href="#next">
        <RedoIcon sx={{ color: "white" }} fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AudioControllers;
