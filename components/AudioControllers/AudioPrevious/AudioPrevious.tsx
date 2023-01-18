import { IconButton, Box } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useAudioContext } from "context/AudioContext";

const AudioPrevious = () => {
  const { backwardAudio } = useAudioContext();

  return (
    <Box>
      <IconButton onClick={backwardAudio} href="#prev">
        <UndoIcon />
      </IconButton>
    </Box>
  );
};

export default AudioPrevious;
