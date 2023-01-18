import Rosary from "class/Rosary";
import ShareIcon from "@mui/icons-material/IosShare";
import MusicIcon from "@mui/icons-material/MusicNote";
import MenuBook from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import {
  AudioNavigation,
  AudioCover,
  ShareRosary,
  ReadRosary,
  RosaryOptions,
} from "@/components";
import { Container } from "./RosaryAudioPlayer.style";
import { useState } from "react";
import { VIEW_SIZE } from "@/constants/mysteries";
import { viewSize } from "@/interfaces/rosaryInterface";
import { AudioPlayer } from "../AudioPlayer";
import { Box } from "@mui/system";

const withBackgroundMusic = true;
const myRosary = new Rosary(withBackgroundMusic);
const rosary = myRosary.getRosaryState();

const RosaryAudioPlayer = () => {
  const [rosaryContent, setRosaryContent] = useState<JSX.Element | null>(null);
  const [viewSize, setViewSize] = useState<viewSize>(
    VIEW_SIZE.medium as viewSize
  );

  const changeView = (component: JSX.Element | null) => {
    if (component !== null) setViewSize(VIEW_SIZE.small as viewSize);
    else setViewSize(VIEW_SIZE.medium as viewSize);
    setRosaryContent(component);
  };

  // make a call to the backend so it can create a single audio file will
  // all the prayers selected by the user
  const buttons = {
    home: {
      id: "home",
      onClick: () => changeView(null),
      icon: <HomeIcon />,
    },
    options: {
      id: "options",
      onClick: () => changeView(<RosaryOptions />),
      icon: <MusicIcon />,
    },
    read: {
      id: "read",
      onClick: () => changeView(<ReadRosary />),
      icon: <MenuBook />,
    },
    share: {
      id: "share",
      onClick: () => changeView(<ShareRosary />),
      icon: <ShareIcon />,
    },
  };

  const controls = (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <AudioPlayer audio="https://www.youtube.com/embed/HgMuRA87US0">
          <AudioPlayer.AudioPrevious />
          <AudioPlayer.AudioPlay />
          <AudioPlayer.AudioNext />
        </AudioPlayer>
      </Box>
      <AudioNavigation buttons={Object.values(buttons)} />
    </>
  );

  return (
    <Container>
      {/* <audio controls>
        <source src={rosary.backgroundMusic} type="audio/ogg" />
        <source src={rosary.backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio> */}
      <AudioCover
        audioCover={rosary.audioCover}
        title="Rosary"
        description="Sorrow Mysteries"
        size={viewSize}
        onClick={buttons.home.onClick}
        controls={controls}
      >
        {rosaryContent}
      </AudioCover>
    </Container>
  );
};

export default RosaryAudioPlayer;
