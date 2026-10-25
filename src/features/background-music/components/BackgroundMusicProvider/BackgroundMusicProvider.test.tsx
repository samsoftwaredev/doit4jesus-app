import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import {
  BackgroundMusicProvider,
  useBackgroundMusic,
} from "@/features/background-music/components/BackgroundMusicProvider/BackgroundMusicProvider";

const mockNativePlaylist = {
  next: jest.fn(),
  pause: jest.fn(),
  play: jest.fn(),
  volume: 1,
};
let mockPlaylistStatus = {
  currentIndex: 0,
  currentTime: 0,
  didJustFinish: false,
  duration: 0,
  isBuffering: false,
  isLoaded: true,
  loop: "all" as const,
  muted: false,
  playing: false,
  playbackRate: 1,
  trackCount: 4,
  volume: 1,
};

jest.mock("expo-audio", () => ({
  useAudioPlaylist: jest.fn(() => mockNativePlaylist),
  useAudioPlaylistStatus: jest.fn(() => mockPlaylistStatus),
}));

jest.mock("@/features/background-music/data/backgroundMusicPlaylist", () => ({
  BACKGROUND_MUSIC_PLAYLIST: [
    { audioSource: 11, artwork: 101, id: "agnus-dei", title: { en: "Agnus Dei", es: "Agnus Dei" } },
    { audioSource: 12, artwork: 102, id: "dies-irae", title: { en: "Dies Irae", es: "Dies Irae" } },
    { audioSource: 13, artwork: 103, id: "kyrie", title: { en: "Kyrie", es: "Kyrie" } },
    { audioSource: 14, artwork: 104, id: "sanctus", title: { en: "Sanctus", es: "Sanctus" } },
  ],
}));

const { useAudioPlaylist } = jest.requireMock("expo-audio") as {
  useAudioPlaylist: jest.Mock;
};

function MusicConsumer() {
  const music = useBackgroundMusic();

  return (
    <View>
      <Text>{music.currentTrack.id}</Text>
      <Text>{music.isLoading ? "loading" : "ready"}</Text>
      <Pressable accessibilityRole="button" onPress={music.togglePlayback}>
        <Text>{music.isPlaying ? "Pause" : "Play"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={music.playNext}>
        <Text>Next</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={music.pausePlayback}>
        <Text>Stop for video</Text>
      </Pressable>
    </View>
  );
}

describe("BackgroundMusicProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNativePlaylist.volume = 1;
    mockPlaylistStatus = {
      ...mockPlaylistStatus,
      currentIndex: 0,
      isBuffering: false,
      isLoaded: true,
      playing: false,
      volume: 1,
    };
  });

  it("creates one looping playlist, starts paused, and fixes music volume at 30 percent", async () => {
    await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(useAudioPlaylist).toHaveBeenCalledWith({
      loop: "all",
      sources: [11, 12, 13, 14],
    });
    expect(mockNativePlaylist.volume).toBe(0.3);
    expect(mockNativePlaylist.play).not.toHaveBeenCalled();
    expect(screen.getByText("agnus-dei")).toBeTruthy();
  });

  it("plays, pauses, advances exactly once, and exposes the native current track", async () => {
    const rendered = await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Play" }));
    expect(mockNativePlaylist.play).toHaveBeenCalledTimes(1);

    mockPlaylistStatus = { ...mockPlaylistStatus, currentIndex: 2, playing: true };
    await rendered.rerender(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(screen.getByText("kyrie")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Pause" }));
    expect(mockNativePlaylist.pause).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    expect(mockNativePlaylist.next).toHaveBeenCalledTimes(1);
    expect(mockNativePlaylist.play).toHaveBeenCalledTimes(2);

    await fireEvent.press(screen.getByRole("button", { name: "Stop for video" }));
    expect(mockNativePlaylist.pause).toHaveBeenCalledTimes(2);
  });

  it("reports buffering and loading states without losing the selected track", async () => {
    mockPlaylistStatus = { ...mockPlaylistStatus, currentIndex: 3, isBuffering: true, isLoaded: false };

    await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(screen.getByText("sanctus")).toBeTruthy();
    expect(screen.getByText("loading")).toBeTruthy();
  });
});
