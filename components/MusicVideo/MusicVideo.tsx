import FitScreenIcon from "@mui/icons-material/FitScreen";
import { IconButton, Tooltip } from "@mui/material";
import { useAudioContext } from "@/context/AudioContext";
import { NAV_APP_LINKS } from "@/constants/nav";
import { usePathname } from "next/navigation";

const MusicVideo = () => {
  const pathname = usePathname();
  const { goToEvent, audioPlayer } = useAudioContext();

  return (
    <Tooltip title="View Video">
      <span>
        <IconButton
          color="info"
          disabled={
            pathname.includes(NAV_APP_LINKS.liveEvent.link) ||
            pathname.includes(NAV_APP_LINKS.event.link) ||
            audioPlayer?.audio === undefined
          }
          onClick={goToEvent}
        >
          <FitScreenIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default MusicVideo;
