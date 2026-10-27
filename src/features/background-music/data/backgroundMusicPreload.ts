import { preload } from "expo-audio";
import { Platform } from "react-native";

import { BACKGROUND_MUSIC_PLAYLIST } from "./backgroundMusicPlaylist";

/** Starts warming the first music track as soon as the web application module loads. */
export function preloadInitialBackgroundMusicTrack(): void {
  if (Platform.OS !== "web") return;
  void preload(BACKGROUND_MUSIC_PLAYLIST[0].audioSource);
}

/** Warms later tracks after authentication so skips can reuse Expo Audio's web preload cache. */
export function preloadRemainingBackgroundMusicTracks(): void {
  if (Platform.OS !== "web") return;

  for (const track of BACKGROUND_MUSIC_PLAYLIST.slice(1)) {
    void preload(track.audioSource);
  }
}
