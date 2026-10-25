import { useAudioPlaylist, useAudioPlaylistStatus } from "expo-audio";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo } from "react";

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
const BACKGROUND_MUSIC_VOLUME = 0.3;
const PLAYLIST_SOURCES = BACKGROUND_MUSIC_PLAYLIST.map((track) => track.audioSource);

/** Owns the authenticated session's single looping music playlist and exposes stable playback actions. */
export function BackgroundMusicProvider({ children }: PropsWithChildren) {
  const playlist = useAudioPlaylist({ loop: "all", sources: PLAYLIST_SOURCES });
  const status = useAudioPlaylistStatus(playlist);

  useEffect(() => {
    playlist.volume = BACKGROUND_MUSIC_VOLUME;
  }, [playlist]);

  /** Pauses without seeking so route exclusions and the Pause control preserve position. */
  const pausePlayback = useCallback(() => {
    playlist.pause();
  }, [playlist]);

  /** Advances exactly one item and starts it even when the previous item was paused. */
  const playNext = useCallback(() => {
    playlist.next();
    playlist.play();
  }, [playlist]);

  /** Toggles the current item while retaining its native playback position. */
  const togglePlayback = useCallback(() => {
    if (status.playing) {
      playlist.pause();
      return;
    }
    playlist.play();
  }, [playlist, status.playing]);

  const currentTrack = BACKGROUND_MUSIC_PLAYLIST[status.currentIndex] ?? BACKGROUND_MUSIC_PLAYLIST[0];
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
