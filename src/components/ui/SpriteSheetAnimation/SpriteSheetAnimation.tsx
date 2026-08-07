import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Image, View } from "react-native";

import { styles } from "./SpriteSheetAnimation.styles";
import type {
  SpriteSheetAnimationHandle,
  SpriteSheetAnimationProps,
} from "./SpriteSheetAnimation.types";

const DEFAULT_FPS = 8;
const DEFAULT_TOTAL_FRAMES = 8;

function positiveNumber(value: number | undefined, fallback: number) {
  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function positiveInteger(value: number | undefined, fallback: number) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 1
    ? Math.floor(number)
    : fallback;
}

/**
 * Displays and animates a single-row sprite sheet.
 *
 * Attach a ref to access `play`, `pause`, `reset`, and `restart`.
 */
export const SpriteSheetAnimation = forwardRef<
  SpriteSheetAnimationHandle,
  SpriteSheetAnimationProps
>(function SpriteSheetAnimation(
  {
    source,
    frameWidth,
    frameHeight,
    totalFrames = DEFAULT_TOTAL_FRAMES,
    fps = DEFAULT_FPS,
    loop = true,
    autoplay = true,
    style,
    onComplete,
  },
  ref,
) {
  const safeFrameWidth = positiveNumber(frameWidth, 0);
  const safeFrameHeight = positiveNumber(frameHeight, 0);
  const frameCount = positiveInteger(totalFrames, DEFAULT_TOTAL_FRAMES);
  const safeFps = positiveNumber(fps, DEFAULT_FPS);
  const frameDuration = 1000 / safeFps;

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerVersion, setTimerVersion] = useState(0);
  const currentFrameRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const autoplayRef = useRef(autoplay);

  // Always use the latest values without unnecessarily restarting the interval.
  onCompleteRef.current = onComplete;
  autoplayRef.current = autoplay;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    completedRef.current = false;
    currentFrameRef.current = 0;
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  const play = useCallback(() => {
    // Playing again after a completed non-looping run starts a fresh run.
    if (!loop && completedRef.current) {
      completedRef.current = false;
      currentFrameRef.current = 0;
      setCurrentFrame(0);
    }

    setIsPlaying(true);
  }, [loop]);

  const restart = useCallback(() => {
    clearTimer();
    completedRef.current = false;
    currentFrameRef.current = 0;
    setCurrentFrame(0);
    setIsPlaying(true);
    // Restart the interval even if the component was already playing.
    setTimerVersion((version) => version + 1);
  }, [clearTimer]);

  const advanceFrame = useCallback(() => {
    const lastFrame = frameCount - 1;

    if (currentFrameRef.current < lastFrame) {
      const nextFrame = currentFrameRef.current + 1;

      currentFrameRef.current = nextFrame;
      setCurrentFrame(nextFrame);
      return;
    }

    if (loop) {
      currentFrameRef.current = 0;
      setCurrentFrame(0);
      return;
    }

    clearTimer();
    setIsPlaying(false);

    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    }
  }, [clearTimer, frameCount, loop]);

  useImperativeHandle(
    ref,
    () => ({
      play,
      pause,
      reset,
      restart,
      getCurrentFrame: () => currentFrameRef.current,
    }),
    [pause, play, reset, restart],
  );

  // A replacement sheet (or a different frame count) begins at its first frame.
  useEffect(() => {
    reset();

    if (autoplayRef.current) {
      setIsPlaying(true);
      // `isPlaying` may already be true, so force a fresh timer for the new sheet.
      setTimerVersion((version) => version + 1);
    }
  }, [frameCount, reset, source]);

  // Changing autoplay pauses/resumes in place. A completed non-looping run restarts.
  useEffect(() => {
    if (autoplay) {
      play();
    } else {
      pause();
    }
  }, [autoplay, pause, play]);

  // Recreate the interval when fps, loop, or the number of frames changes.
  useEffect(() => {
    if (
      !source ||
      !safeFrameWidth ||
      !safeFrameHeight ||
      !isPlaying ||
      (frameCount === 1 && loop)
    ) {
      return undefined;
    }

    const timer = setInterval(advanceFrame, frameDuration);
    intervalRef.current = timer;

    return () => {
      clearInterval(timer);

      if (intervalRef.current === timer) {
        intervalRef.current = null;
      }
    };
  }, [
    advanceFrame,
    frameCount,
    frameDuration,
    isPlaying,
    loop,
    safeFrameHeight,
    safeFrameWidth,
    source,
    timerVersion,
  ]);

  // The fixed viewport crops the sheet; moving the image reveals one frame at a time.
  if (!source || !safeFrameWidth || !safeFrameHeight) {
    return null;
  }

  return (
    <View
      style={[
        styles.viewport,
        style,
        { width: safeFrameWidth, height: safeFrameHeight },
      ]}
    >
      <Image
        accessible={false}
        resizeMode="stretch"
        source={source}
        style={{
          width: safeFrameWidth * frameCount,
          height: safeFrameHeight,
          transform: [{ translateX: -currentFrame * safeFrameWidth }],
        }}
      />
    </View>
  );
});

SpriteSheetAnimation.displayName = "SpriteSheetAnimation";
