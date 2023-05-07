import { useState } from "react";
import {
  IosShare as ShareIcon,
  MusicNote as MusicIcon,
  MenuBook as MenuBook,
  Home as HomeIcon,
} from "@mui/icons-material";
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
import { useLanguageContext } from "@/context/LanguageContext";

const myRosary = new Rosary();
const rosaryState = myRosary.getRosaryState();

const RosaryAudioPlayer = () => {
  const { language } = useLanguageContext();
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
    // TODO: new features
    // read: {
    //   id: "read",
    //   onClick: () => changeView(<ReadRosary />),
    //   icon: <MenuBook />,
    // },
    // share: {
    //   id: "share",
    //   onClick: () => changeView(<ShareRosary />),
    //   icon: <ShareIcon />,
    // },
  };

  const controls = (
    <>
      <RosaryWrapper>
        <AudioPlayer
          audioPlayer={{
            audio: myRosary.getAudio(language),
          }}
        >
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
        audioCover={rosaryState.audioCover}
        title={rosaryState.title}
        description={rosaryState.mystery}
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
