import { act, renderHook } from "@testing-library/react-native";

import { useRosaryAudioPlayback } from "@/features/prayer/rosary/hooks/useRosaryAudioPlayback";

const mockPlayer = {
  pause: jest.fn(),
  play: jest.fn(),
  replace: jest.fn(),
  seekTo: jest.fn(() => Promise.resolve()),
};
let mockStatus = {
  currentTime: 0,
  duration: 0,
  didJustFinish: false,
  error: null as string | null,
  isBuffering: false,
  isLoaded: true,
  playing: false,
};

jest.mock("expo-audio", () => ({
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
  useAudioPlayer: jest.fn(() => mockPlayer),
  useAudioPlayerStatus: jest.fn(() => mockStatus),
}));

jest.mock("../../../../../assets/audios", () => ({
  ROSARY_AUDIO_SOURCES: {
    "/audio/one.m4a": 1,
    "/audio/two.m4a": 2,
    "/audio/three.m4a": 3,
  },
}));

describe("useRosaryAudioPlayback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStatus = {
      currentTime: 0,
      didJustFinish: false,
      duration: 0,
      error: null,
      isBuffering: false,
      isLoaded: true,
      playing: false,
    };
  });

  it("autoplays the first recording and replaces it when the prayer changes", async () => {
    const { rerender } = await renderHook<
      ReturnType<typeof useRosaryAudioPlayback>,
      { playbackKey: string; queue: string[] }
    >(
      ({ playbackKey, queue }) =>
        useRosaryAudioPlayback({
          audioQueue: queue,
          isMuted: false,
          isPreferenceHydrated: true,
          onRequestUnmute: jest.fn(),
          playbackKey,
        }),
      { initialProps: { playbackKey: "bead-1", queue: ["/audio/one.m4a"] } },
    );

    expect(mockPlayer.replace).toHaveBeenCalledWith(1);
    expect(mockPlayer.play).toHaveBeenCalledTimes(1);

    await rerender({ playbackKey: "bead-2", queue: ["/audio/three.m4a"] });
    expect(mockPlayer.replace).toHaveBeenLastCalledWith(3);
    expect(mockPlayer.play).toHaveBeenCalledTimes(2);

    await rerender({ playbackKey: "bead-3", queue: ["/audio/three.m4a"] });
    expect(mockPlayer.replace).toHaveBeenLastCalledWith(3);
    expect(mockPlayer.play).toHaveBeenCalledTimes(3);
  });

  it("advances through every recording before completing the prayer once", async () => {
    const onQueueComplete = jest.fn();
    const { rerender } = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/one.m4a", "/audio/two.m4a"],
        isMuted: false,
        isPreferenceHydrated: true,
        onQueueComplete,
        onRequestUnmute: jest.fn(),
      }),
    );

    mockStatus = { ...mockStatus, didJustFinish: true };
    await rerender(undefined);

    expect(mockPlayer.replace).toHaveBeenLastCalledWith(2);
    expect(mockPlayer.play).toHaveBeenCalledTimes(2);
    expect(onQueueComplete).not.toHaveBeenCalled();

    mockStatus = { ...mockStatus, didJustFinish: false };
    await rerender(undefined);
    mockStatus = { ...mockStatus, didJustFinish: true };
    await rerender(undefined);
    await rerender(undefined);

    expect(onQueueComplete).toHaveBeenCalledTimes(1);
  });

  it("completes a single-track prayer once", async () => {
    const onQueueComplete = jest.fn();
    const { rerender } = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/one.m4a"],
        isMuted: false,
        isPreferenceHydrated: true,
        onQueueComplete,
        onRequestUnmute: jest.fn(),
        playbackKey: "bead-1",
      }),
    );

    mockStatus = { ...mockStatus, didJustFinish: true };
    await rerender(undefined);
    await rerender(undefined);

    expect(onQueueComplete).toHaveBeenCalledTimes(1);
  });

  it("ignores a stale completion event until the replacement prayer is armed", async () => {
    const onQueueComplete = jest.fn();
    const { rerender } = await renderHook<ReturnType<typeof useRosaryAudioPlayback>, { playbackKey: string }>(
      ({ playbackKey }) =>
        useRosaryAudioPlayback({
          audioQueue: ["/audio/one.m4a"],
          isMuted: false,
          isPreferenceHydrated: true,
          onQueueComplete,
          onRequestUnmute: jest.fn(),
          playbackKey,
        }),
      { initialProps: { playbackKey: "bead-1" } },
    );

    mockStatus = { ...mockStatus, didJustFinish: true };
    await rerender({ playbackKey: "bead-2" });
    expect(onQueueComplete).not.toHaveBeenCalled();

    mockStatus = { ...mockStatus, didJustFinish: false };
    await rerender({ playbackKey: "bead-2" });
    mockStatus = { ...mockStatus, didJustFinish: true };
    await rerender({ playbackKey: "bead-2" });

    expect(onQueueComplete).toHaveBeenCalledTimes(1);
  });

  it("does not complete muted, failed, or unavailable prayer audio", async () => {
    const onQueueComplete = jest.fn();
    const muted = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/one.m4a"],
        isMuted: true,
        isPreferenceHydrated: true,
        onQueueComplete,
        onRequestUnmute: jest.fn(),
      }),
    );
    mockStatus = { ...mockStatus, didJustFinish: true };
    await muted.rerender(undefined);
    await muted.unmount();

    mockStatus = { ...mockStatus, didJustFinish: false, error: "decode failed" };
    const failed = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/one.m4a"],
        isMuted: false,
        isPreferenceHydrated: true,
        onQueueComplete,
        onRequestUnmute: jest.fn(),
      }),
    );
    mockStatus = { ...mockStatus, didJustFinish: true };
    await failed.rerender(undefined);
    await failed.unmount();

    mockStatus = { ...mockStatus, didJustFinish: false, error: null };
    const unavailable = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/missing.m4a"],
        isMuted: false,
        isPreferenceHydrated: true,
        onQueueComplete,
        onRequestUnmute: jest.fn(),
      }),
    );
    mockStatus = { ...mockStatus, didJustFinish: true };
    await unavailable.rerender(undefined);
    await unavailable.unmount();

    expect(onQueueComplete).not.toHaveBeenCalled();
  });

  it("pauses while muted and explicit Play unmutes and restarts from the beginning", async () => {
    const onRequestUnmute = jest.fn(() => Promise.resolve());
    const { result } = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/one.m4a"],
        isMuted: true,
        isPreferenceHydrated: true,
        onRequestUnmute,
      }),
    );

    expect(mockPlayer.pause).toHaveBeenCalled();
    expect(mockPlayer.play).not.toHaveBeenCalled();

    await act(async () => result.current.togglePlayback());

    expect(onRequestUnmute).toHaveBeenCalledTimes(1);
    expect(mockPlayer.replace).toHaveBeenLastCalledWith(1);
    expect(mockPlayer.play).toHaveBeenCalledTimes(1);
  });

  it("filters missing sources, reports playback failures, and pauses on unmount", async () => {
    mockStatus = { ...mockStatus, error: "decode failed" };
    const { result, unmount } = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/missing.m4a"],
        isMuted: false,
        isPreferenceHydrated: true,
        onRequestUnmute: jest.fn(),
      }),
    );

    expect(result.current.isAvailable).toBe(false);
    expect(result.current.playbackError).toBe("decode failed");
    await unmount();
    expect(mockPlayer.pause).toHaveBeenCalled();
  });

  it("exposes the active queue position and native playback timing for the Rosary countdown", async () => {
    mockStatus = { ...mockStatus, currentTime: 7.25, duration: 17.194 };
    const { result } = await renderHook(() =>
      useRosaryAudioPlayback({
        audioQueue: ["/audio/one.m4a", "/audio/two.m4a"],
        isMuted: false,
        isPreferenceHydrated: true,
        onRequestUnmute: jest.fn(),
      }),
    );

    expect(result.current.currentTrackIndex).toBe(0);
    expect(result.current.currentTrackPosition).toBe(7.25);
    expect(result.current.currentTrackDuration).toBe(17.194);
  });
});
