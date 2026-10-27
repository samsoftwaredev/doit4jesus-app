import { Platform } from "react-native";

import {
  preloadInitialBackgroundMusicTrack,
  preloadRemainingBackgroundMusicTracks,
} from "@/features/background-music/data/backgroundMusicPreload";

const mockPreload = jest.fn();

jest.mock("expo-audio", () => ({
  preload: (...args: unknown[]) => mockPreload(...args),
}));

jest.mock("@/features/background-music/data/backgroundMusicPlaylist", () => ({
  BACKGROUND_MUSIC_PLAYLIST: [{ audioSource: 11 }, { audioSource: 12 }, { audioSource: 13 }, { audioSource: 14 }],
}));

describe("background music preloading", () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: originalPlatform });
  });

  it("warms the first track before authentication on web", () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });

    preloadInitialBackgroundMusicTrack();

    expect(mockPreload.mock.calls).toEqual([[11]]);
  });

  it("warms the remaining tracks after the authenticated provider mounts on web", () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });

    preloadRemainingBackgroundMusicTracks();

    expect(mockPreload.mock.calls).toEqual([[12], [13], [14]]);
  });

  it("does not allocate a preload cache for embedded native tracks", () => {
    Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });

    preloadInitialBackgroundMusicTrack();
    preloadRemainingBackgroundMusicTracks();

    expect(mockPreload).not.toHaveBeenCalled();
  });
});
