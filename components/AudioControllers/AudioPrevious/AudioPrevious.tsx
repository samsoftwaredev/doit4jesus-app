import { IconButton, Box } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import { useRosaryContext } from "context/RosaryContext";

const AudioPrevious = () => {
  const { backwardAudio } = useRosaryContext();

  return (
    <Box>
      <IconButton onClick={backwardAudio} href="#prev">
        <UndoIcon />
      </IconButton>
    </Box>
  );
};

export default AudioPrevious;
