import { useEffect } from "react";
import { useAudioContext } from "@/context/AudioContext";
import { isClientSideRender } from "@/utils";
import { Container } from "./YouTubeVideo.style";

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

let player: any;

const YouTubeVideo = ({ id, visible = true }: Props) => {
  const { isPlaying, setIsPlaying } = useAudioContext();

  useEffect(() => {
    // On mount, check to see if the API script is already loaded
    if (isClientSideRender()) {
      if (!window.YT) {
        // If not, load the script asynchronously
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";

        // onYouTubeIframeAPIReady will load the video after the script is loaded
        window.onYouTubeIframeAPIReady = loadVideo;

        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
      } else {
        // If script is already there, load the video directly
        loadVideo();
      }
    }
  }, []);

  const loadVideo = () => {
    // the Player object is created uniquely based on the id in props
    player = new window.YT.Player(`youtube-player-${id}`, {
      videoId: id,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        break;
    }
  };

  const stopVideo = () => {
    if (typeof player?.pauseVideo === "function") player.pauseVideo();
    setIsPlaying(false);
  };

  const onPlayerReady = () => {
    if (typeof player?.playVideo === "function") player.playVideo();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isClientSideRender()) {
      isPlaying ? onPlayerReady() : stopVideo();
    }
  }, [isPlaying]);

  return (
    <Container visible={visible}>
      <div id={`youtube-player-${id}`} />
    </Container>
  );
};

export default YouTubeVideo;
