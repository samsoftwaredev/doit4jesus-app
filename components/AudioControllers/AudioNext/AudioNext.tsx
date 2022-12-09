import { IconButton, Box } from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import { useRosaryContext } from "context/RosaryContext";

const AudioControllers = () => {
  const { forwardAudio } = useRosaryContext();

  return (
    <Box>
      <IconButton onClick={forwardAudio} href="#next">
        <RedoIcon />
      </IconButton>
    </Box>
  );
};

export default AudioControllers;
