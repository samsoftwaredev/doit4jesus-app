import type { DOMImperativeFactory, DOMProps } from "expo/dom";
import type { Ref } from "react";

import type { SupportedLanguage } from "@/localization";

export type RosaryVideoPlaybackState = "buffering" | "ended" | "paused" | "playing" | "unstarted";

export type RosaryVideoProgress = {
  currentTime: number;
  duration: number;
};

export interface RosaryVideoPlayerHandle extends DOMImperativeFactory {
  pause: () => void;
  play: () => void;
  seekBy: DOMImperativeFactory[string];
}

export type RosaryVideoPlayerProps = {
  appOrigin: string;
  dom?: DOMProps;
  language: SupportedLanguage;
  onError: (error: string) => Promise<void>;
  onProgress: (progress: RosaryVideoProgress) => Promise<void>;
  onReady: () => Promise<void>;
  onStateChange: (state: RosaryVideoPlaybackState) => Promise<void>;
  ref: Ref<RosaryVideoPlayerHandle>;
  showYouTubeControls?: boolean;
  videoId: string;
};

const playerStateByCode: Record<number, RosaryVideoPlaybackState> = {
  [-1]: "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "unstarted",
};

/** Uses an HTTP browser origin when available and otherwise identifies the canonical app host. */
export function resolveRosaryVideoPlayerOrigin(browserOrigin: string, appOrigin: string): string {
  return browserOrigin.startsWith("http://") || browserOrigin.startsWith("https://") ? browserOrigin : appOrigin;
}

/** Builds the YouTube parameters that retain native controls, captions, inline playback, and API identification. */
export function getRosaryVideoPlayerVars(
  language: SupportedLanguage,
  origin: string,
  showYouTubeControls = true,
): Record<string, number | string> {
  return {
    cc_lang_pref: language,
    controls: showYouTubeControls ? 1 : 0,
    enablejsapi: 1,
    hl: language,
    origin,
    playsinline: 1,
    rel: 0,
    widget_referrer: origin,
  };
}

/** Converts YouTube's numeric state into the playback-state contract consumed by the native screen. */
export function resolveRosaryVideoPlaybackState(code: number | undefined): RosaryVideoPlaybackState {
  return typeof code === "number" ? (playerStateByCode[code] ?? "unstarted") : "unstarted";
}
