import { fireEvent, render, screen } from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";

import {
  BackgroundMusicProvider,
  useBackgroundMusic,
} from "@/features/background-music/components/BackgroundMusicProvider/BackgroundMusicProvider";

const mockNativePlayer = {
  pause: jest.fn(),
  play: jest.fn(),
  replace: jest.fn(),
  volume: 1,
};
let mockPlayerStatus = {
  currentTime: 0,
  didJustFinish: false,
  duration: 0,
  error: null,
  isBuffering: false,
  isLoaded: true,
  playing: false,
};

jest.mock("expo-audio", () => ({
  useAudioPlayer: jest.fn(() => mockNativePlayer),
  useAudioPlayerStatus: jest.fn(() => mockPlayerStatus),
}));

jest.mock("@/features/background-music/data/backgroundMusicPlaylist", () => ({
  BACKGROUND_MUSIC_PLAYLIST: [
    { audioSource: 11, artwork: 101, id: "agnus-dei", title: { en: "Agnus Dei", es: "Agnus Dei" } },
    { audioSource: 12, artwork: 102, id: "dies-irae", title: { en: "Dies Irae", es: "Dies Irae" } },
    { audioSource: 13, artwork: 103, id: "kyrie", title: { en: "Kyrie", es: "Kyrie" } },
    { audioSource: 14, artwork: 104, id: "sanctus", title: { en: "Sanctus", es: "Sanctus" } },
  ],
}));

const { useAudioPlayer } = jest.requireMock("expo-audio") as {
  useAudioPlayer: jest.Mock;
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
    mockNativePlayer.volume = 1;
    mockPlayerStatus = {
      ...mockPlayerStatus,
      didJustFinish: false,
      isBuffering: false,
      isLoaded: true,
      playing: false,
    };
  });

  it("creates one player for the first track, starts paused, and fixes music volume at 15 percent", async () => {
    await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(useAudioPlayer).toHaveBeenCalledWith(11, { updateInterval: 250 });
    expect(useAudioPlayer).toHaveBeenCalledTimes(1);
    expect(mockNativePlayer.volume).toBe(0.15);
    expect(mockNativePlayer.play).not.toHaveBeenCalled();
    expect(screen.getByText("agnus-dei")).toBeTruthy();
  });

  it("resumes and pauses without replacing the current source", async () => {
    const rendered = await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Play" }));
    expect(mockNativePlayer.play).toHaveBeenCalledTimes(1);
    expect(mockNativePlayer.replace).not.toHaveBeenCalled();

    mockPlayerStatus = { ...mockPlayerStatus, playing: true };
    await rendered.rerender(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Pause" }));
    expect(mockNativePlayer.pause).toHaveBeenCalledTimes(1);
    expect(mockNativePlayer.replace).not.toHaveBeenCalled();
  });

  it("advances rapid Next presses sequentially with one player and wraps to the first track", async () => {
    await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    const nextButton = screen.getByRole("button", { name: "Next" });
    await fireEvent.press(nextButton);
    await fireEvent.press(nextButton);
    await fireEvent.press(nextButton);
    await fireEvent.press(nextButton);

    expect(mockNativePlayer.pause).toHaveBeenCalledTimes(4);
    expect(mockNativePlayer.replace.mock.calls).toEqual([[12], [13], [14], [11]]);
    expect(mockNativePlayer.play).toHaveBeenCalledTimes(4);
    expect(new Set(useAudioPlayer.mock.results.map(({ value }) => value))).toEqual(new Set([mockNativePlayer]));
    expect(screen.getByText("agnus-dei")).toBeTruthy();
  });

  it("advances once after natural completion and ignores a repeated completion status", async () => {
    const rendered = await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    mockPlayerStatus = { ...mockPlayerStatus, didJustFinish: true };
    await rendered.rerender(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(mockNativePlayer.replace).toHaveBeenCalledTimes(1);
    expect(mockNativePlayer.replace).toHaveBeenCalledWith(12);
    expect(mockNativePlayer.play).toHaveBeenCalledTimes(1);

    await rendered.rerender(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(mockNativePlayer.replace).toHaveBeenCalledTimes(1);
    expect(mockNativePlayer.play).toHaveBeenCalledTimes(1);
  });

  it("keeps natural advancement armed after manual skips and wraps the final track", async () => {
    const rendered = await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    const nextButton = screen.getByRole("button", { name: "Next" });
    await fireEvent.press(nextButton);
    await fireEvent.press(nextButton);
    await fireEvent.press(nextButton);

    mockPlayerStatus = { ...mockPlayerStatus, didJustFinish: true };
    await rendered.rerender(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    expect(mockNativePlayer.replace.mock.calls).toEqual([[12], [13], [14], [11]]);
    expect(screen.getByText("agnus-dei")).toBeTruthy();
  });

  it("reports the current player's buffering state without losing the selected track", async () => {
    mockPlayerStatus = { ...mockPlayerStatus, isBuffering: true, isLoaded: false };

    await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("dies-irae")).toBeTruthy();
    expect(screen.getByText("loading")).toBeTruthy();
  });

  it("exposes an explicit pause action for the Rosary video route", async () => {
    await render(
      <BackgroundMusicProvider>
        <MusicConsumer />
      </BackgroundMusicProvider>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Stop for video" }));
    expect(mockNativePlayer.pause).toHaveBeenCalledTimes(1);
  });
});
