import { IconButton, Tooltip } from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import { useAudioContext } from "context/AudioContext";
import { theme } from "@/styles/mui-overwrite";

const AudioControllers = () => {
  const { forwardAudio } = useAudioContext();

  return (
    <Tooltip title="Forward">
      <IconButton onClick={forwardAudio} href="#next">
        <RedoIcon sx={{ color: theme.palette.info.dark }} fontSize="large" />
      </IconButton>
    </Tooltip>
  );
};

export default AudioControllers;
