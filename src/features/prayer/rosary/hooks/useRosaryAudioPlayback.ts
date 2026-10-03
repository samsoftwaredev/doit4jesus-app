import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ROSARY_AUDIO_SOURCES } from "../../../../../assets/audios";
import { logDevelopmentError } from "@/lib/development-logger";

interface UseRosaryAudioPlaybackOptions {
  audioQueue?: readonly string[];
  isMuted: boolean;
  isPreferenceHydrated: boolean;
  onQueueComplete?: () => void;
  onRequestUnmute: () => Promise<unknown> | unknown;
  playbackKey?: string;
}

/** Converts an unknown playback failure to a stable user-interface error value. */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "audio-playback-failed";
}

/**
 * Manages foreground-only Rosary playback for a localized sequence of bundled recordings.
 * Queue changes restart at the first track, completed tracks advance in order, and the final track reports completion.
 */
export function useRosaryAudioPlayback({
  audioQueue = [],
  isMuted,
  isPreferenceHydrated,
  onQueueComplete,
  onRequestUnmute,
  playbackKey = "",
}: UseRosaryAudioPlaybackOptions) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [localError, setLocalError] = useState<string | null>(null);
  const currentTrackIndex = useRef(0);
  const completionArmed = useRef(false);
  const handledCompletion = useRef(false);
  const handledAutoplayQueue = useRef<string | null>(null);
  const audioQueueKey = audioQueue.join("\n");
  const resolvedSources = useMemo(() => {
    if (!audioQueueKey) return [];
    return audioQueueKey
      .split("\n")
      .map((path) => ROSARY_AUDIO_SOURCES[path])
      .filter((source): source is number => Boolean(source));
  }, [audioQueueKey]);
  const queueKey = `${playbackKey}:${resolvedSources.join(":")}`;

  useEffect(() => {
    /** Configures Rosary audio for foreground playback, including the iOS silent switch. */
    async function configureAudio() {
      try {
        await setAudioModeAsync({
          interruptionMode: "doNotMix",
          playsInSilentMode: true,
          shouldPlayInBackground: false,
        });
      } catch (error) {
        logDevelopmentError("configuring Rosary audio", error);
        setLocalError(getErrorMessage(error));
      }
    }

    void configureAudio();
  }, []);

  useEffect(() => {
    player.pause();
    currentTrackIndex.current = 0;
    completionArmed.current = false;
    handledCompletion.current = false;
    handledAutoplayQueue.current = null;
    setLocalError(null);

    const firstSource = resolvedSources[0];
    if (!firstSource) return;

    try {
      player.replace(firstSource);
    } catch (error) {
      logDevelopmentError("preparing Rosary audio", error);
      setLocalError(getErrorMessage(error));
    }
  }, [player, queueKey, resolvedSources]);

  useEffect(() => {
    if (!isPreferenceHydrated || handledAutoplayQueue.current === queueKey) {
      if (isMuted) player.pause();
      return;
    }

    handledAutoplayQueue.current = queueKey;
    if (isMuted) {
      player.pause();
      return;
    }
    if (!resolvedSources[0]) return;

    try {
      player.play();
    } catch (error) {
      logDevelopmentError("starting Rosary audio", error);
      setLocalError(getErrorMessage(error));
    }
  }, [isMuted, isPreferenceHydrated, player, queueKey, resolvedSources]);

  useEffect(() => {
    if (isMuted || status.error || resolvedSources.length === 0) {
      completionArmed.current = false;
      return;
    }
    if (!status.didJustFinish) {
      completionArmed.current = true;
      handledCompletion.current = false;
      return;
    }
    if (!completionArmed.current || handledCompletion.current) return;
    completionArmed.current = false;
    handledCompletion.current = true;

    const nextIndex = currentTrackIndex.current + 1;
    const nextSource = resolvedSources[nextIndex];
    if (!nextSource) {
      onQueueComplete?.();
      return;
    }

    try {
      currentTrackIndex.current = nextIndex;
      completionArmed.current = false;
      player.replace(nextSource);
      player.play();
    } catch (error) {
      logDevelopmentError("advancing Rosary audio", error);
      setLocalError(getErrorMessage(error));
    }
  }, [isMuted, onQueueComplete, player, queueKey, resolvedSources, status.didJustFinish, status.error]);

  useEffect(
    () => () => {
      player.pause();
    },
    [player],
  );

  /** Pauses active audio or starts the current prayer from its first recording. */
  const togglePlayback = useCallback(async () => {
    const firstSource = resolvedSources[0];
    if (!firstSource) return;

    try {
      if (status.playing) {
        player.pause();
        return;
      }
      if (isMuted) await onRequestUnmute();
      if (isMuted || status.didJustFinish) {
        currentTrackIndex.current = 0;
        handledCompletion.current = false;
        player.replace(firstSource);
      }
      player.play();
      setLocalError(null);
    } catch (error) {
      logDevelopmentError("toggling Rosary audio", error);
      setLocalError(getErrorMessage(error));
    }
  }, [isMuted, onRequestUnmute, player, resolvedSources, status.didJustFinish, status.playing]);

  return {
    isAvailable: resolvedSources.length > 0,
    isLoading: status.isBuffering || (resolvedSources.length > 0 && !status.isLoaded),
    isPlaying: status.playing,
    playbackError: status.error ?? localError,
    togglePlayback,
  };
}
