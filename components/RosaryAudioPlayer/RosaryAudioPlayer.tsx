import { useState } from "react";
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
import { Rosary } from "@/class";
import { VIEW_SIZE, INTERFACE_VIEW_SIZE } from "@/constants";
import { AudioPlayer } from "../AudioPlayer";
import { Container, RosaryWrapper } from "./RosaryAudioPlayer.style";

const withBackgroundMusic = true;
const myRosary = new Rosary(withBackgroundMusic);
const rosary = myRosary.getRosaryState();

const RosaryAudioPlayer = () => {
  const [rosaryContent, setRosaryContent] = useState<JSX.Element | null>(null);
  const [viewSize, setViewSize] = useState<INTERFACE_VIEW_SIZE>(
    VIEW_SIZE.medium as INTERFACE_VIEW_SIZE
  );

  const changeView = (component: JSX.Element | null) => {
    if (component !== null) setViewSize(VIEW_SIZE.small as INTERFACE_VIEW_SIZE);
    else setViewSize(VIEW_SIZE.medium as INTERFACE_VIEW_SIZE);
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
      <RosaryWrapper>
        <AudioPlayer audio="HgMuRA87US0" visible={false}>
          <AudioPlayer.AudioPrevious />
          <AudioPlayer.AudioPlay />
          <AudioPlayer.AudioNext />
        </AudioPlayer>
      </RosaryWrapper>
      <AudioNavigation buttons={Object.values(buttons)} />
    </>
  );

  return (
    <Container>
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
