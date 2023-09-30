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
import { VIEW_SIZE, NAV_APP_LINKS } from "@/constants";
import { AudioPlayer } from "../../components/AudioPlayer";
import { useLanguageContext } from "@/context/LanguageContext";
import { useRouter } from "next/router";
import { Box, Container } from "@mui/material";
import { INTERFACE_VIEW_SIZE } from "@/interfaces";

const myRosary = new Rosary();
const rosaryState = myRosary.getRosaryState();

const RosaryAudioPlayer = () => {
  const router = useRouter();
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

  const handelBack = () => {
    router.push(NAV_APP_LINKS.app.link);
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
      <Box>
        <AudioPlayer
          audioPlayer={{
            audio: myRosary.getAudio(language),
          }}
        >
          <AudioPlayer.AudioPrevious />
          <AudioPlayer.AudioPlay />
          <AudioPlayer.AudioNext />
        </AudioPlayer>
      </Box>
      <AudioNavigation buttons={Object.values(buttons)} />
    </>
  );

  return (
    <Container maxWidth="sm">
      <TitleNav
        onBack={handelBack}
        title="The Holy Rosary"
        description="Let's meditate the life of Jesus and Mary"
      />
      <AudioCover
        // audioCover={rosaryState.audioCover}
        title={rosaryState.title}
        description={rosaryState.mystery}
        onClick={buttons.home.onClick}
        controls={controls}
      >
        {rosaryContent}
      </AudioCover>
    </Container>
  );
};

export default RosaryAudioPlayer;
