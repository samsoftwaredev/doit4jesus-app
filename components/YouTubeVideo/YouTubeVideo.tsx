import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { YouTubeClass } from '@/classes';
import { INITIAL_VOLUME } from '@/constants/mysteries';
import {
  INTERFACE_AUDIO_SEEK,
  INTERFACE_AUDIO_SPEED,
  INTERFACE_AUDIO_STATE,
} from '@/interfaces';
import { generateRandomStringId, isClientSideRender } from '@/utils';

import styles from './youTubeVideo.module.scss';

interface Props {
  id: string;
  onChange: Function;
  setAudioTimer: Dispatch<SetStateAction<INTERFACE_AUDIO_SEEK>>;
  setAudioProgress: Dispatch<SetStateAction<number>>;
  volume?: number;
  audioLoop?: boolean;
  audioSpeed?: number;
  audioSeek?: INTERFACE_AUDIO_SEEK;
  audioState?: INTERFACE_AUDIO_STATE;
  showVideo?: boolean;
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
  setAudioProgress,
  volume = INITIAL_VOLUME,
  audioLoop = false,
  audioSeek = INTERFACE_AUDIO_SEEK.NEUTRAL,
  audioSpeed = INTERFACE_AUDIO_SPEED.NORMAL,
  audioState = INTERFACE_AUDIO_STATE.UNSTARTED,
  showVideo = false,
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
      pauseVideo();
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

  const toggleVideoState = (audioState: INTERFACE_AUDIO_STATE) => {
    switch (audioState) {
      case INTERFACE_AUDIO_STATE.PLAYING:
        playVideo();
        break;
      case INTERFACE_AUDIO_STATE.PAUSED:
        pauseVideo();
    }
  };

  const onPlayerStateChange = (event: any) => {
    // update the video state
    onChange(event.data);
  };

  const pauseVideo = () => {
    if (typeof player?.pauseVideo === 'function') {
      player.pauseVideo();
      onChange(INTERFACE_AUDIO_STATE.PAUSED);
    }
  };

  const playVideo = () => {
    if (typeof player?.playVideo === 'function') {
      player.playVideo();
      onChange(INTERFACE_AUDIO_STATE.PLAYING);
    }
  };

  const seekTo = (
    type: INTERFACE_AUDIO_SEEK,
    seconds: number = 15,
    allowSeekAhead: Boolean = true,
  ) => {
    if (
      typeof player?.seekTo === 'function' &&
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
    if (typeof player?.getPlaybackRate === 'function') {
      player.setPlaybackRate(suggestedRate);
    }
  };

  const setLoop = (bool: Boolean) => {
    if (typeof player?.getPlaybackRate === 'function') {
      player.setLoop(bool);
    }
  };

  const setVolume = (volume: number) => {
    if (typeof player?.playVideo === 'function') {
      player.setVolume(volume);
    }
  };

  useEffect(() => {
    if (isClientSideRender()) toggleVideoState(audioState);
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      if (player) {
        const progress = (player.getCurrentTime() / player.getDuration()) * 100;
        setAudioProgress(progress);
      }
    }, 5000);

    return () => clearInterval(intervalId); //This is important
  }, [player]);

  return (
    <div
      className={styles.container}
      style={{ visibility: showVideo ? 'visible' : 'hidden' }}
    >
      <div className="video" ref={youtubeEleRef} id={youtubeId} />
    </div>
  );
};

export default YouTubeVideo;
