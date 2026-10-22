import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";

import type {
  RosaryVideoPlayerHandle,
  RosaryVideoPlayerProps,
} from "@/features/prayer/rosary/components/RosaryVideoPlayer";
import { RosaryVideoScreen } from "@/features/prayer/rosary/screens/RosaryVideoScreen";
import { i18n } from "@/localization";

const mockBack = jest.fn();
const mockQueueAchievement = jest.fn();
const mockRecordRosaryActivity = jest.fn();
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSeekBy = jest.fn();
const mockPlayerProps = jest.fn();
const mockRosaryPresence = jest.fn();
const mockFocusCleanups: (() => void)[] = [];

jest.mock("expo-router", () => ({
  useFocusEffect: (effect: () => void | (() => void)) => {
    const ReactActual = jest.requireActual("react") as typeof import("react");
    return ReactActual.useEffect(() => {
      const cleanup = effect();
      if (cleanup) mockFocusCleanups.push(cleanup);
      return cleanup;
    }, [effect]);
  },
  useRouter: () => ({ back: mockBack }),
}));
jest.mock("@/features/achievements", () => ({
  useAchievement: () => ({ queueAchievement: mockQueueAchievement }),
}));
jest.mock("@/features/prayer/rosary/api/activities.api", () => ({
  recordRosaryActivity: (...args: unknown[]) => mockRecordRosaryActivity(...args),
}));
jest.mock("@/features/prayer/rosary/components", () => ({
  ...(() => {
    const ReactActual = jest.requireActual("react") as typeof import("react");
    const ReactNative = jest.requireActual<typeof import("react-native")>("react-native");
    return {
      RosaryPresence: function MockRosaryPresence() {
        mockRosaryPresence();
        return <ReactNative.View testID="mock-rosary-presence" />;
      },
      RosaryVideoPlayer: ReactActual.forwardRef<RosaryVideoPlayerHandle, RosaryVideoPlayerProps>(
        function MockPlayer(props, ref) {
          ReactActual.useImperativeHandle(ref, () => ({ pause: mockPause, play: mockPlay, seekBy: mockSeekBy }));
          mockPlayerProps(props);
          return <ReactNative.View testID="mock-youtube-player" />;
        },
      ),
    };
  })(),
}));

/** Renders the video Rosary with a stable English Joyful video. */
function renderScreen() {
  return render(<RosaryVideoScreen language="en" mysteryType="joyful" videoId="Yxl_DsofPTk" />);
}

/** Returns the latest player bridge props supplied by the native screen. */
function latestPlayerProps(): RosaryVideoPlayerProps {
  return mockPlayerProps.mock.lastCall?.[0] as RosaryVideoPlayerProps;
}

describe("RosaryVideoScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockFocusCleanups.length = 0;
    mockRecordRosaryActivity.mockResolvedValue({ currentLevel: 2, points: 25, replayed: false, totalXp: 300 });
    await act(async () => i18n.changeLanguage("en"));
  });

  afterAll(async () => {
    await act(async () => i18n.changeLanguage("en"));
  });

  it("centers the full-width player vertically on a black page and provides accessible bottom actions", async () => {
    await renderScreen();

    expect(StyleSheet.flatten(screen.getByTestId("rosary-video-screen").props.style)).toMatchObject({
      backgroundColor: "#000000",
    });
    expect(StyleSheet.flatten(screen.getByTestId("rosary-video-player-area").props.style)).toMatchObject({
      flex: 1,
      justifyContent: "center",
    });
    expect(StyleSheet.flatten(screen.getByTestId("rosary-video-frame").props.style)).toMatchObject({
      aspectRatio: 16 / 9,
      width: "100%",
    });
    expect(StyleSheet.flatten(screen.getByTestId("rosary-video-controls").props.style)).toMatchObject({
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: "row",
      overflow: "hidden",
    });
    expect(screen.getByTestId("mock-rosary-presence")).toBeTruthy();
    expect(mockRosaryPresence).toHaveBeenCalledTimes(1);
    expect(latestPlayerProps()).toMatchObject({ language: "en", showYouTubeControls: true, videoId: "Yxl_DsofPTk" });

    await act(async () => latestPlayerProps().onReady());
    const backAction = screen.getByRole("button", { name: "Go back 15 seconds" });
    const playAction = screen.getByRole("button", { name: "Play video Rosary" });
    const forwardAction = screen.getByRole("button", { name: "Skip ahead 15 seconds" });
    expect(StyleSheet.flatten(backAction.props.style)).toMatchObject({ borderRightWidth: 1, flex: 1 });
    expect(StyleSheet.flatten(playAction.props.style)).toMatchObject({ borderRightWidth: 1, flex: 1 });
    expect(StyleSheet.flatten(forwardAction.props.style).borderRightWidth).toBeUndefined();
    expect(backAction.props.accessibilityHint).toBe("Moves the video 15 seconds earlier.");
    expect(playAction.props.accessibilityHint).toBe("Starts the guided Rosary video.");
    expect(forwardAction.props.accessibilityHint).toBe("Moves the video 15 seconds later.");
    await fireEvent.press(backAction);
    await fireEvent.press(playAction);
    await fireEvent.press(forwardAction);

    expect(mockSeekBy).toHaveBeenNthCalledWith(1, -15);
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(mockSeekBy).toHaveBeenNthCalledWith(2, 15);

    await act(async () => latestPlayerProps().onStateChange("playing"));
    await fireEvent.press(screen.getByRole("button", { name: "Pause video Rosary" }));
    expect(mockPause).toHaveBeenCalledTimes(1);
  });

  it("records once at 85 percent, keeps playback active, and queues the confetti toast", async () => {
    await renderScreen();

    await act(async () => latestPlayerProps().onProgress({ currentTime: 849, duration: 1_000 }));
    expect(mockRecordRosaryActivity).not.toHaveBeenCalled();

    await act(async () => latestPlayerProps().onStateChange("playing"));
    await act(async () => latestPlayerProps().onProgress({ currentTime: 850, duration: 1_000 }));
    await waitFor(() => expect(mockRecordRosaryActivity).toHaveBeenCalledTimes(1));
    await act(async () => latestPlayerProps().onProgress({ currentTime: 900, duration: 1_000 }));

    expect(mockRecordRosaryActivity).toHaveBeenCalledTimes(1);
    expect(mockPause).not.toHaveBeenCalled();
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "rosary-video-complete" });
  });

  it("keeps a failed completion non-blocking and retries with the same idempotency key", async () => {
    mockRecordRosaryActivity.mockRejectedValueOnce(new Error("offline"));
    await renderScreen();

    await act(async () => latestPlayerProps().onProgress({ currentTime: 85, duration: 100 }));
    const saveError = await screen.findByText("Your Rosary could not be saved.");
    expect(saveError.parent?.props.accessibilityRole).toBe("alert");

    const firstInput = mockRecordRosaryActivity.mock.calls[0][0] as { idempotencyKey: string };
    await fireEvent.press(screen.getByRole("button", { name: "Retry saving Rosary completion" }));
    await waitFor(() => expect(mockRecordRosaryActivity).toHaveBeenCalledTimes(2));
    const secondInput = mockRecordRosaryActivity.mock.calls[1][0] as { idempotencyKey: string };

    expect(secondInput.idempotencyKey).toBe(firstInput.idempotencyKey);
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "rosary-video-complete" });
  });

  it("pauses playback when the route loses focus and reloads a failed player", async () => {
    await renderScreen();

    await act(async () => latestPlayerProps().onError("embed_not_allowed"));
    const playerError = screen.getByText("The video Rosary is unavailable.");
    expect(playerError.parent?.props.accessibilityRole).toBe("alert");

    const renderCount = mockPlayerProps.mock.calls.length;
    await fireEvent.press(screen.getByRole("button", { name: "Retry loading video Rosary" }));
    expect(mockPlayerProps.mock.calls.length).toBeGreaterThan(renderCount);

    await act(async () => mockFocusCleanups[0]?.());
    expect(mockPause).toHaveBeenCalled();
    expect(screen.queryByTestId("mock-youtube-player")).toBeNull();
    expect(screen.queryByTestId("mock-rosary-presence")).toBeNull();
  });

  it("localizes the player controls and completion error in Spanish", async () => {
    await act(async () => i18n.changeLanguage("es"));
    mockRecordRosaryActivity.mockRejectedValueOnce(new Error("offline"));
    await render(<RosaryVideoScreen language="es" mysteryType="joyful" videoId="if85VqzxHYg" />);

    await act(async () => latestPlayerProps().onReady());
    expect(screen.getByRole("button", { name: "Retroceder 15 segundos" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reproducir Rosario en video" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Adelantar 15 segundos" })).toBeTruthy();

    await act(async () => latestPlayerProps().onProgress({ currentTime: 85, duration: 100 }));
    const saveError = await screen.findByText("No se pudo guardar tu Rosario.");
    expect(saveError.parent?.props.accessibilityRole).toBe("alert");
  });
});
