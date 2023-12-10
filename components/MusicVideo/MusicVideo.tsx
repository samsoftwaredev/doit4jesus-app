import { theme } from "@/styles/mui-overwrite";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import { IconButton, Tooltip } from "@mui/material";

const MusicVideo = () => {
  return (
    <Tooltip title="View Video">
      <IconButton>
        <FitScreenIcon sx={{ color: theme.palette.info.dark }} />
      </IconButton>
    </Tooltip>
  );
};

export default MusicVideo;
