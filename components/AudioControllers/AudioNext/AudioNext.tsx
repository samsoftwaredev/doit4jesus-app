import { IconButton, Box } from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import { useAudioContext } from "context/AudioContext";

const AudioControllers = () => {
  const { forwardAudio } = useAudioContext();

  return (
    <Box>
      <IconButton onClick={forwardAudio} href="#next">
        <RedoIcon />
      </IconButton>
    </Box>
  );
};

export default AudioControllers;
