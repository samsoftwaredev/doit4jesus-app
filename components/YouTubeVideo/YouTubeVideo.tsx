import { useEffect, useRef } from "react";
import { useAudioContext } from "@/context/AudioContext";
import { isClientSideRender } from "@/utils";
import { Container } from "./YouTubeVideo.style";
import { useState } from "react";
import { YouTubeClass } from "@/class";

interface Props {
  id: string;
  visible: boolean;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady: Function;
  }
}

const YouTubeVideo = ({ id, visible = true }: Props) => {
  let myYT = new YouTubeClass(id);
  const youtubeElem = useRef(null);
  const [player, setPlayer] = useState<any>(null);
  const { isPlaying, setIsPlaying } = useAudioContext();

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
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        break;
    }
  };

  const pauseVideo = () => {
    if (typeof player?.pauseVideo === "function") {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const playVideo = () => {
    if (typeof player?.playVideo === "function") {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isClientSideRender()) {
      isPlaying ? playVideo() : pauseVideo();
    }
  }, [isPlaying]);

  return (
    <Container visible={visible} id="youtube-container">
      <div ref={youtubeElem} id={`youtube-player-${id}`} />
    </Container>
  );
};

export default YouTubeVideo;
