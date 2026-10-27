import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { i18n } from "@/localization";
import { BackgroundMusicSideDrawerHandle } from "./BackgroundMusicSideDrawerHandle";

const mockPausePlayback = jest.fn();
const mockPlayNext = jest.fn();
const mockTogglePlayback = jest.fn();
let mockPathname = "/home";
let mockLanguage: "en" | "es" = "en";
let mockReducedMotion = false;
let mockMusic = {
  currentTrack: {
    audioSource: 1,
    artwork: 101,
    id: "agnus-dei-polyphony",
    title: { en: "Agnus Dei — Polyphony", es: "Agnus Dei — Polifonía" },
  },
  isLoading: false,
  isPlaying: false,
  pausePlayback: mockPausePlayback,
  playNext: mockPlayNext,
  togglePlayback: mockTogglePlayback,
};

jest.mock("expo-router", () => ({
  usePathname: () => mockPathname,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 20, left: 0, right: 0, top: 40 }),
}));

jest.mock("../BackgroundMusicProvider", () => ({
  useBackgroundMusic: () => mockMusic,
}));

jest.mock("@/localization", () => {
  const actual = jest.requireActual("@/localization");
  return {
    ...actual,
    useAppLanguage: () => ({ language: mockLanguage }),
  };
});

jest.mock("react-native-reanimated", () => {
  const ReactNative = jest.requireActual("react-native");
  const sharedValue = (value: unknown) => ({ value });

  return {
    ...ReactNative.Animated,
    default: ReactNative.Animated,
    cancelAnimation: jest.fn(),
    useAnimatedStyle: (updater: () => unknown) => updater(),
    useReducedMotion: () => mockReducedMotion,
    useSharedValue: sharedValue,
    withRepeat: (value: unknown) => value,
    withTiming: (value: unknown) => value,
  };
});

describe("BackgroundMusicSideDrawerHandle", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockPathname = "/home";
    mockLanguage = "en";
    mockReducedMotion = false;
    mockMusic = {
      ...mockMusic,
      currentTrack: {
        audioSource: 1,
        artwork: 101,
        id: "agnus-dei-polyphony",
        title: { en: "Agnus Dei — Polyphony", es: "Agnus Dei — Polifonía" },
      },
      isLoading: false,
      isPlaying: false,
    };
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("opens from a music-note edge handle and renders only the compact player controls", async () => {
    await render(<BackgroundMusicSideDrawerHandle />);

    const handle = screen.getByRole("button", { name: "Open background music" });
    expect(handle.props.accessibilityState).toEqual(expect.objectContaining({ expanded: false }));
    expect(screen.getByTestId("background-music-handle-icon")).toBeTruthy();
    expect(screen.queryByText("Agnus Dei — Polyphony")).toBeNull();

    await fireEvent.press(handle);

    expect(StyleSheet.flatten(screen.getByTestId("background-music-drawer").props.style)).toEqual(
      expect.objectContaining({ height: 100 }),
    );
    expect(StyleSheet.flatten(screen.getByTestId("background-music-panel").props.style)).toEqual(
      expect.objectContaining({ height: 100 }),
    );
    expect(screen.getByRole("button", { name: "Close background music" }).props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: true }),
    );
    expect(screen.getAllByText("Agnus Dei — Polyphony").length).toBeGreaterThan(0);
    expect(StyleSheet.flatten(screen.getByTestId("background-music-artwork").props.style)).toEqual(
      expect.objectContaining({ aspectRatio: 1, maxWidth: 50, width: 50 }),
    );
    expect(screen.getByRole("button", { name: "Play background music" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Play next background music track" })).toBeTruthy();
    expect(screen.getByTestId("background-music-dismiss-backdrop", { includeHiddenElements: true })).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Play background music" }));
    await fireEvent.press(screen.getByRole("button", { name: "Play next background music track" }));
    expect(mockTogglePlayback).toHaveBeenCalledTimes(1);
    expect(mockPlayNext).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("background-music-panel")).toBeTruthy();
  });

  it("closes on an outside tap without changing playback", async () => {
    await render(<BackgroundMusicSideDrawerHandle />);

    expect(screen.queryByTestId("background-music-dismiss-backdrop")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Open background music" }));

    const backdrop = screen.getByTestId("background-music-dismiss-backdrop", { includeHiddenElements: true });
    expect(backdrop.props.accessible).toBe(false);
    await fireEvent.press(backdrop);

    expect(screen.queryByTestId("background-music-dismiss-backdrop")).toBeNull();
    expect(screen.queryByTestId("background-music-panel")).toBeNull();
    expect(screen.getByRole("button", { name: "Open background music" }).props.accessibilityState).toEqual(
      expect.objectContaining({ expanded: false }),
    );
    expect(mockPausePlayback).not.toHaveBeenCalled();
    expect(mockTogglePlayback).not.toHaveBeenCalled();
    expect(mockPlayNext).not.toHaveBeenCalled();
  });

  it("updates playback state and presents localized Spanish labels and titles", async () => {
    mockLanguage = "es";
    mockMusic = { ...mockMusic, isPlaying: true };
    await i18n.changeLanguage("es");

    await render(<BackgroundMusicSideDrawerHandle />);
    await fireEvent.press(screen.getByRole("button", { name: "Abrir música de fondo" }));

    expect(screen.getAllByText("Agnus Dei — Polifonía").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Pausar música de fondo" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reproducir la siguiente pista de música de fondo" })).toBeTruthy();
  });

  it("hides and pauses on the Rosary video route without automatically restarting afterward", async () => {
    mockPathname = "/rosary-video";
    mockMusic = { ...mockMusic, isPlaying: true };

    const rendered = await render(<BackgroundMusicSideDrawerHandle />);

    expect(screen.queryByTestId("background-music-drawer")).toBeNull();
    expect(screen.queryByTestId("background-music-dismiss-backdrop")).toBeNull();
    await waitFor(() => expect(mockPausePlayback).toHaveBeenCalledTimes(1));

    mockPathname = "/home";
    await rendered.rerender(<BackgroundMusicSideDrawerHandle />);

    expect(screen.getByTestId("background-music-drawer")).toBeTruthy();
    expect(mockTogglePlayback).not.toHaveBeenCalled();
  });

  it("uses a continuous marquee only when the title overflows and motion is allowed", async () => {
    await render(<BackgroundMusicSideDrawerHandle />);
    await fireEvent.press(screen.getByRole("button", { name: "Open background music" }));

    await fireEvent(screen.getByTestId("background-music-title-mask"), "layout", {
      nativeEvent: { layout: { height: 20, width: 80, x: 0, y: 0 } },
    });
    await fireEvent(screen.getByTestId("background-music-title-measure"), "layout", {
      nativeEvent: { layout: { height: 20, width: 180, x: 0, y: 0 } },
    });

    await waitFor(() => expect(screen.getByTestId("background-music-marquee-copy-2")).toBeTruthy());
  });

  it("keeps an overflowing title stationary when reduced motion is enabled", async () => {
    mockReducedMotion = true;
    await render(<BackgroundMusicSideDrawerHandle />);
    await fireEvent.press(screen.getByRole("button", { name: "Open background music" }));

    await fireEvent(screen.getByTestId("background-music-title-mask"), "layout", {
      nativeEvent: { layout: { height: 20, width: 80, x: 0, y: 0 } },
    });
    await fireEvent(screen.getByTestId("background-music-title-measure"), "layout", {
      nativeEvent: { layout: { height: 20, width: 180, x: 0, y: 0 } },
    });

    expect(screen.queryByTestId("background-music-marquee-copy-2")).toBeNull();
    expect(screen.getAllByText("Agnus Dei — Polyphony").length).toBeGreaterThan(0);
  });
});
