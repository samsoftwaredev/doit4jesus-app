import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  preloadInitialBackgroundMusicTrack,
  preloadRemainingBackgroundMusicTracks,
} from "@/features/background-music/data/backgroundMusicPreload";
import {
  BACKGROUND_MUSIC_PLAYLIST,
  type BackgroundMusicTrack,
} from "@/features/background-music/data/backgroundMusicPlaylist";

export interface BackgroundMusicContextValue {
  currentTrack: BackgroundMusicTrack;
  isLoading: boolean;
  isPlaying: boolean;
  pausePlayback: () => void;
  playNext: () => void;
  togglePlayback: () => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | undefined>(undefined);
const BACKGROUND_MUSIC_VOLUME = 0.15;
const PLAYER_STATUS_INTERVAL_MS = 250;

preloadInitialBackgroundMusicTrack();

/** Owns one background-music player and advances its source without allowing overlapping playback. */
export function BackgroundMusicProvider({ children }: PropsWithChildren) {
  const player = useAudioPlayer(BACKGROUND_MUSIC_PLAYLIST[0].audioSource, {
    updateInterval: PLAYER_STATUS_INTERVAL_MS,
  });
  const status = useAudioPlayerStatus(player);
  const currentTrackIndexRef = useRef(0);
  const completionArmedRef = useRef(false);
  const handledCompletionRef = useRef(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    player.volume = BACKGROUND_MUSIC_VOLUME;
  }, [player]);

  useEffect(() => {
    preloadRemainingBackgroundMusicTracks();
  }, []);

  useEffect(
    () => () => {
      player.pause();
    },
    [player],
  );

  /** Stops the active source, replaces it with the next track, and starts playback immediately. */
  const advanceTrack = useCallback(() => {
    const nextIndex = (currentTrackIndexRef.current + 1) % BACKGROUND_MUSIC_PLAYLIST.length;
    currentTrackIndexRef.current = nextIndex;
    setCurrentTrackIndex(nextIndex);
    player.pause();
    player.replace(BACKGROUND_MUSIC_PLAYLIST[nextIndex].audioSource);
    player.play();
  }, [player]);

  useEffect(() => {
    if (!status.didJustFinish) {
      completionArmedRef.current = true;
      handledCompletionRef.current = false;
      return;
    }
    if (!completionArmedRef.current || handledCompletionRef.current) return;

    completionArmedRef.current = false;
    handledCompletionRef.current = true;
    advanceTrack();
  }, [advanceTrack, status.didJustFinish]);

  /** Pauses without seeking so route exclusions and the Pause control preserve position. */
  const pausePlayback = useCallback(() => {
    player.pause();
  }, [player]);

  /** Advances exactly one track and starts it even when the previous track was paused. */
  const playNext = useCallback(() => {
    completionArmedRef.current = true;
    handledCompletionRef.current = false;
    advanceTrack();
  }, [advanceTrack]);

  /** Toggles the current track while retaining its native playback position. */
  const togglePlayback = useCallback(() => {
    if (status.playing) {
      player.pause();
      return;
    }
    player.play();
  }, [player, status.playing]);

  const currentTrack = BACKGROUND_MUSIC_PLAYLIST[currentTrackIndex];
  const value = useMemo<BackgroundMusicContextValue>(
    () => ({
      currentTrack,
      isLoading: status.isBuffering || !status.isLoaded,
      isPlaying: status.playing,
      pausePlayback,
      playNext,
      togglePlayback,
    }),
    [currentTrack, pausePlayback, playNext, status.isBuffering, status.isLoaded, status.playing, togglePlayback],
  );

  return <BackgroundMusicContext.Provider value={value}>{children}</BackgroundMusicContext.Provider>;
}

/** Returns the app-wide music controls and fails fast when used outside the authenticated provider. */
export function useBackgroundMusic(): BackgroundMusicContextValue {
  const context = useContext(BackgroundMusicContext);
  if (!context) throw new Error("useBackgroundMusic must be used within BackgroundMusicProvider");
  return context;
}
