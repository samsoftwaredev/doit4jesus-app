import { useState, useEffect, useRef } from "react";
import { generateRandomStringId, isClientSideRender } from "@/utils";
import { YouTubeClass } from "@/class";
import {
  INTERFACE_AUDIO_SEEK,
  INTERFACE_AUDIO_SPEED,
  INTERFACE_AUDIO_STATE,
} from "@/constants/interfaces";
import { Container } from "./YouTubeVideo.style";
import { INITIAL_VOLUME } from "@/constants/mysteries";

interface Props {
  id: string;
  onChange: Function;
  setAudioTimer: Function;
  volume?: number;
  audioLoop?: boolean;
  visible?: boolean;
  audioSpeed?: number;
  audioSeek?: INTERFACE_AUDIO_SEEK;
  audioState?: INTERFACE_AUDIO_STATE;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady: Function;
  }
}

const YouTubeVideo = ({
  id,
  onChange,
  setAudioTimer,
  volume = INITIAL_VOLUME,
  audioLoop = false,
  visible = false,
  audioSeek = INTERFACE_AUDIO_SEEK.NEUTRAL,
  audioSpeed = INTERFACE_AUDIO_SPEED.NORMAL,
  audioState = INTERFACE_AUDIO_STATE.UNSTARTED,
}: Props) => {
  let myYT: YouTubeClass;
  const youtubeEleRef = useRef<HTMLInputElement>(null);
  const youtubeId = `youtube-container-${generateRandomStringId(10)}`;
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    // On mount, check to see if the API script is already loaded
    if (youtubeEleRef && youtubeEleRef.current && isClientSideRender()) {
      myYT = new YouTubeClass(id, youtubeEleRef.current.id);
      myYT.add(loadVideo);
    }
    return () => {
      myYT.remove();
    };
  }, [id, youtubeEleRef]);

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

  const seekTo = (
    type: INTERFACE_AUDIO_SEEK,
    seconds: number = 15,
    allowSeekAhead: Boolean = true
  ) => {
    if (
      typeof player?.seekTo === "function" &&
      type !== INTERFACE_AUDIO_SEEK.NEUTRAL
    ) {
      let newSecondsPointer = 0;
      const currentSeconds = player.getCurrentTime();
      if (type === INTERFACE_AUDIO_SEEK.FORWARDS) {
        newSecondsPointer = Math.abs(seconds + currentSeconds);
      } else {
        // INTERFACE_AUDIO_SEEK.BACKWARDS
        newSecondsPointer = Math.abs(seconds - currentSeconds);
      }
      player.seekTo(newSecondsPointer, allowSeekAhead);
      setAudioTimer(INTERFACE_AUDIO_SEEK.NEUTRAL);
    }
  };

  const setSpeed = (suggestedRate = 1) => {
    if (typeof player?.getPlaybackRate === "function") {
      player.setPlaybackRate(suggestedRate);
    }
  };

  const setLoop = (bool: Boolean) => {
    if (typeof player?.getPlaybackRate === "function") {
      player.setLoop(bool);
    }
  };

  const setVolume = (volume: number) => {
    if (typeof player?.playVideo === "function") {
      console.log(player.getVolume());
      player.setVolume(volume);
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
    if (isClientSideRender()) seekTo(audioSeek);
  }, [audioSeek]);

  useEffect(() => {
    if (isClientSideRender()) setSpeed(audioSpeed);
  }, [audioSpeed]);

  useEffect(() => {
    if (isClientSideRender()) setLoop(audioLoop);
  }, [audioLoop]);

  useEffect(() => {
    if (isClientSideRender()) setVolume(volume);
  }, [volume]);

  return <Container ref={youtubeEleRef} visible={visible} id={youtubeId} />;
};

export default YouTubeVideo;
