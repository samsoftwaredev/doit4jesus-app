import FitScreenIcon from "@mui/icons-material/FitScreen";
import { IconButton, Tooltip } from "@mui/material";
import { useAudioContext } from "@/context/AudioContext";
import { theme } from "@/styles/mui-overwrite";

const MusicVideo = () => {
  const { toggleDialog } = useAudioContext();
  return (
    <Tooltip title="View Video">
      <IconButton onClick={toggleDialog}>
        <FitScreenIcon sx={{ color: theme.palette.info.dark }} />
      </IconButton>
    </Tooltip>
  );
};

export default MusicVideo;
