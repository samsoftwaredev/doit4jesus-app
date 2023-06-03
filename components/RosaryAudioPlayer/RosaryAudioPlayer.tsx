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
  TitleNav,
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
      tooltip: "Home",
      onClick: () => changeView(null),
      icon: <HomeIcon color="secondary" />,
    },
    options: {
      id: "options",
      tooltip: "Settings",
      onClick: () => changeView(<RosaryOptions />),
      icon: <MusicIcon color="secondary" />,
    },
    // TODO: new features
    // read: {
    //   id: "read",
    //   onClick: () => changeView(<ReadRosary />),
    //   icon: <MenuBook />,
    // },
    share: {
      id: "share",
      onClick: () => changeView(<ShareRosary />),
      tooltip: "Share",
      icon: <ShareIcon color="secondary" />,
    },
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
    <>
      <TitleNav
        title="The Holy Rosary"
        description="Let's meditate the life of Jesus and Mary"
      />
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
    </>
  );
};

export default RosaryAudioPlayer;
