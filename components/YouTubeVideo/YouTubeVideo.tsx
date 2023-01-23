import { useState, useEffect, useRef } from "react";
import { isClientSideRender } from "@/utils";
import { YouTubeClass } from "@/class";
import { INTERFACE_AUDIO_STATE } from "@/constants/interfaces";
import { Container } from "./YouTubeVideo.style";

interface Props {
  id: string;
  volume: number;
  visible?: boolean;
  audioState?: INTERFACE_AUDIO_STATE;
  onChange?: Function;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady: Function;
  }
}

const YouTubeVideo = ({
  id,
  volume = 100,
  visible = true,
  audioState = INTERFACE_AUDIO_STATE.UNSTARTED,
  onChange = () => {},
}: Props) => {
  let myYT = new YouTubeClass(id);
  const youtubeElem = useRef(null);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    // On mount, check to see if the API script is already loaded
    if (isClientSideRender()) {
      myYT.add(loadVideo);
    }
    return () => {
      myYT.remove();
    };
  }, []);

  const loadVideo = () => {
    // the Player object is created uniquely based on the id in props
    const playerYT = myYT.init(onPlayerStateChange);
    setPlayer(playerYT);
  };

  const onPlayerStateChange = (event: any) => {
    // update the video state
    onChange(event.data);
  };

  const pauseVideo = () => {
    if (typeof player?.pauseVideo === "function") {
      player.pauseVideo();
      onChange(INTERFACE_AUDIO_STATE.PAUSED);
    }
  };

  const playVideo = () => {
    if (typeof player?.playVideo === "function") {
      player.playVideo();
      onChange(INTERFACE_AUDIO_STATE.PLAYING);
    }
  };

  useEffect(() => {
    if (isClientSideRender()) {
      switch (audioState) {
        case INTERFACE_AUDIO_STATE.PLAYING:
          playVideo();
          break;
        case INTERFACE_AUDIO_STATE.PAUSED:
          pauseVideo();
      }
    }
  }, [audioState]);

  useEffect(() => {
    if (isClientSideRender()) {
      if (typeof player?.playVideo === "function") player.setVolume(volume);
    }
  }, [volume, player]);

  return (
    <Container visible={visible} id="youtube-container">
      <div ref={youtubeElem} id={`youtube-player-${id}`} />
    </Container>
  );
};

export default YouTubeVideo;
