"use dom";

import { useDOMImperativeHandle } from "expo/dom";
import { useEffect, useMemo, useRef } from "react";

import {
  getRosaryVideoPlayerVars,
  resolveRosaryVideoPlaybackState,
  resolveRosaryVideoPlayerOrigin,
  type RosaryVideoPlayerProps,
} from "@/features/prayer/rosary/data/rosaryVideoPlayer";

type YouTubePlayerEvent = {
  data?: number;
  target: YouTubePlayer;
};

type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIframe: () => HTMLIFrameElement;
  getPlayerState: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: {
    events: {
      onError: (event: YouTubePlayerEvent) => void;
      onReady: (event: YouTubePlayerEvent) => void;
      onStateChange: (event: YouTubePlayerEvent) => void;
    };
    playerVars: Record<string, number | string>;
    videoId: string;
  },
) => YouTubePlayer;

declare global {
  interface Window {
    YT?: { Player: YouTubePlayerConstructor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Embeds the official YouTube IFrame player inside Expo's DOM webview and exposes native playback commands.
 * Expo DOM compilation requires this module to expose only one default export.
 */
export default function RosaryVideoPlayer({
  appOrigin,
  language,
  onError,
  onProgress,
  onReady,
  onStateChange,
  ref,
  showYouTubeControls = true,
  videoId,
}: RosaryVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerOrigin = resolveRosaryVideoPlayerOrigin(window.location.origin, appOrigin);
  const playerVars = useMemo(
    () => getRosaryVideoPlayerVars(language, playerOrigin, showYouTubeControls),
    [language, playerOrigin, showYouTubeControls],
  );

  useDOMImperativeHandle(
    ref,
    () => ({
      pause: () => playerRef.current?.pauseVideo(),
      play: () => playerRef.current?.playVideo(),
      seekBy: (...args) => {
        const seconds = typeof args[0] === "number" ? args[0] : 0;
        const player = playerRef.current;
        if (!player) return;
        const duration = Math.max(0, player.getDuration());
        const destination = Math.max(0, Math.min(duration, player.getCurrentTime() + seconds));
        player.seekTo(destination, seconds > 0);
      },
    }),
    [],
  );

  useEffect(() => {
    let active = true;
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    let iframeApiScript: HTMLScriptElement | null = null;

    /** Reports a network failure while loading YouTube's player API. */
    function handleIframeApiError(): void {
      iframeApiScript?.remove();
      void onError("iframe_api_unavailable");
    }

    /** Creates one player after the external IFrame API and local container are ready. */
    function createPlayer(): void {
      if (!active || playerRef.current || !window.YT?.Player || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars,
        events: {
          onError: (event) => void onError(String(event.data ?? "unknown")),
          onReady: (event) => {
            event.target.getIframe().referrerPolicy = "strict-origin-when-cross-origin";
            progressInterval = setInterval(() => {
              const player = playerRef.current;
              if (!player) return;
              void onProgress({ currentTime: player.getCurrentTime(), duration: player.getDuration() });
            }, 1_000);
            void onReady();
          },
          onStateChange: (event) => {
            const state = resolveRosaryVideoPlaybackState(event.data);
            void onStateChange(state);
            if (state === "ended") {
              void onProgress({ currentTime: event.target.getDuration(), duration: event.target.getDuration() });
            }
          },
        },
      });
    }

    if (window.YT?.Player) createPlayer();
    else {
      window.onYouTubeIframeAPIReady = createPlayer;
      const existingScript = document.getElementById("youtube-iframe-api");
      iframeApiScript = existingScript instanceof HTMLScriptElement ? existingScript : document.createElement("script");
      iframeApiScript.addEventListener("error", handleIframeApiError);
      if (!existingScript) {
        iframeApiScript.id = "youtube-iframe-api";
        iframeApiScript.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(iframeApiScript);
      }
    }

    return () => {
      active = false;
      iframeApiScript?.removeEventListener("error", handleIframeApiError);
      if (progressInterval) clearInterval(progressInterval);
      playerRef.current?.destroy();
      playerRef.current = null;
      if (window.onYouTubeIframeAPIReady === createPlayer) window.onYouTubeIframeAPIReady = undefined;
    };
  }, [onError, onProgress, onReady, onStateChange, playerVars, videoId]);

  return (
    <main aria-label="YouTube Rosary video" style={styles.page}>
      <div ref={containerRef} style={styles.player} />
    </main>
  );
}

const styles = {
  page: { backgroundColor: "#000", height: "100%", margin: 0, overflow: "hidden", width: "100%" },
  player: { height: "100%", width: "100%" },
} as const;
