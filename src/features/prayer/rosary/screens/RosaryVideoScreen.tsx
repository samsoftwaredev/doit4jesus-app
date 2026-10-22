import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { BackHeader } from "@/components/navigation";
import { Button } from "@/components/ui";
import { APP_CONFIG } from "@/config/app-config";
import { useAchievement } from "@/features/achievements";
import { recordRosaryActivity } from "@/features/prayer/rosary/api/activities.api";
import {
  RosaryPresence,
  RosaryVideoPlayer,
  type RosaryVideoPlaybackState,
  type RosaryVideoPlayerHandle,
  type RosaryVideoProgress,
} from "@/features/prayer/rosary/components";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types";
import { logDevelopmentError } from "@/lib/development-logger";
import type { SupportedLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const completionThreshold = 0.85;

type CompletionStatus = "idle" | "recorded" | "recording" | "save-error";

/** Creates one high-entropy request key that remains stable across retries for the mounted video session. */
function createIdempotencyKey(): string {
  const random = Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
  return `rosary-video-${Date.now().toString(36)}-${random}`;
}

/** Reports whether valid playback timing has reached the configured completion threshold. */
function hasReachedCompletion({ currentTime, duration }: RosaryVideoProgress): boolean {
  return (
    Number.isFinite(currentTime) &&
    Number.isFinite(duration) &&
    duration > 0 &&
    currentTime / duration >= completionThreshold
  );
}

/** Renders one accessible seek or playback control in the sticky bottom action row. */
function VideoControl({
  accessibilityHint,
  accessibilityLabel,
  disabled,
  icon,
  label,
  onPress,
  primary = false,
  showDivider = false,
}: {
  accessibilityHint: string;
  accessibilityLabel: string;
  disabled: boolean;
  icon: "pause" | "play" | "rotate-ccw" | "rotate-cw";
  label: string;
  onPress: () => void;
  primary?: boolean;
  showDivider?: boolean;
}) {
  const styles = useThemedStyles(styleSheet);

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.control,
        showDivider && styles.controlDivider,
        primary && styles.primaryControl,
        disabled && styles.controlDisabled,
        pressed && !disabled && styles.controlPressed,
      ]}
    >
      <Feather
        accessible={false}
        color={primary ? theme.colors.text.inverse : theme.colors.text.primary}
        name={icon}
        size={theme.sizes.iconMedium}
      />
      <Text style={[styles.controlText, primary && styles.primaryControlText]}>{label}</Text>
    </Pressable>
  );
}

/**
 * Plays one localized mystery video, shares focused-route Rosary Presence, and records completion at 85 percent.
 * Completion recording is idempotent within the mounted session and never interrupts playback.
 */
export function RosaryVideoScreen({
  language,
  mysteryType: _mysteryType,
  videoId,
}: {
  language: SupportedLanguage;
  mysteryType: RosaryMysteryType;
  videoId: string;
}) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { queueAchievement } = useAchievement();
  const playerRef = useRef<RosaryVideoPlayerHandle>(null);
  const mountedRef = useRef(true);
  const completionStatusRef = useRef<CompletionStatus>("idle");
  const idempotencyKeyRef = useRef(createIdempotencyKey());
  const sessionStartedAtRef = useRef(new Date());
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>("idle");
  const [isRouteFocused, setIsRouteFocused] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsRouteFocused(true);

      /** Pauses and unmounts remote media so its player and polling loop are cleaned up. */
      return function cleanUpVideoOnFocusLoss(): void {
        playerRef.current?.pause();
        if (!mountedRef.current) return;
        setIsRouteFocused(false);
        setIsPlayerReady(false);
        setIsPlaying(false);
      };
    }, []),
  );

  /** Returns to the previous protected route. */
  const handleBack = useCallback(() => router.back(), [router]);

  /** Records the threshold completion once and preserves its idempotency key for a manual retry. */
  const recordCompletion = useCallback(async () => {
    if (completionStatusRef.current === "recording" || completionStatusRef.current === "recorded") return;
    completionStatusRef.current = "recording";
    if (mountedRef.current) setCompletionStatus("recording");

    try {
      const completedAt = new Date();
      await recordRosaryActivity({
        completedAt: completedAt.toISOString(),
        durationSeconds: Math.max(
          0,
          Math.floor((completedAt.getTime() - sessionStartedAtRef.current.getTime()) / 1_000),
        ),
        idempotencyKey: idempotencyKeyRef.current,
        occurredAt: sessionStartedAtRef.current.toISOString(),
      });
      completionStatusRef.current = "recorded";
      if (!mountedRef.current) return;
      setCompletionStatus("recorded");
      queueAchievement({ type: "rosary-video-complete" });
    } catch (error) {
      logDevelopmentError("recording video Rosary completion", error);
      completionStatusRef.current = "save-error";
      if (mountedRef.current) setCompletionStatus("save-error");
    }
  }, [queueAchievement]);

  /** Receives YouTube timing updates and starts completion recording at the selected threshold. */
  const handleProgress = useCallback(
    async (progress: RosaryVideoProgress) => {
      if (completionStatusRef.current === "idle" && hasReachedCompletion(progress)) await recordCompletion();
    },
    [recordCompletion],
  );

  /** Enables the custom controls after YouTube confirms that the player is ready. */
  const handlePlayerReady = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsPlayerReady(true);
    setPlayerError(false);
  }, []);

  /** Mirrors YouTube playback changes so the central control has the correct accessible action. */
  const handlePlayerStateChange = useCallback(async (state: RosaryVideoPlaybackState) => {
    if (mountedRef.current) setIsPlaying(state === "playing");
  }, []);

  /** Displays a recoverable player failure without affecting completion state. */
  const handlePlayerError = useCallback(async (error: string) => {
    logDevelopmentError("playing video Rosary", new Error(error));
    if (!mountedRef.current) return;
    setIsPlayerReady(false);
    setIsPlaying(false);
    setPlayerError(true);
  }, []);

  /** Reloads the embedded player after a recoverable YouTube error. */
  const retryPlayer = useCallback(() => {
    setPlayerError(false);
    setIsPlayerReady(false);
    setIsPlaying(false);
    setPlayerKey((current) => current + 1);
  }, []);

  /** Toggles the custom play control without changing completion tracking. */
  const togglePlayback = useCallback(() => {
    if (isPlaying) playerRef.current?.pause();
    else playerRef.current?.play();
  }, [isPlaying]);

  /** Seeks backward by the requested fifteen-second interval. */
  const seekBackward = useCallback(() => playerRef.current?.seekBy(-15), []);

  /** Seeks forward by the requested fifteen-second interval. */
  const seekForward = useCallback(() => playerRef.current?.seekBy(15), []);

  /** Retries the completion request without replacing the mounted session's idempotency key. */
  const retryCompletion = useCallback(() => {
    void recordCompletion();
  }, [recordCompletion]);

  const controlsDisabled = !isPlayerReady || playerError;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea} testID="rosary-video-screen">
      <View style={styles.content}>
        <BackHeader
          description={t("rosary.video.description")}
          onBack={handleBack}
          rightAction={isRouteFocused ? <RosaryPresence /> : undefined}
          title={t("rosary.video.title")}
        />
        <View style={styles.playerArea} testID="rosary-video-player-area">
          <View
            accessibilityLabel={t("rosary.video.playerLabel")}
            style={styles.playerFrame}
            testID="rosary-video-frame"
          >
            {isRouteFocused ? (
              <RosaryVideoPlayer
                appOrigin={APP_CONFIG.appUrl}
                dom={{ allowsFullscreenVideo: true, scrollEnabled: false }}
                key={playerKey}
                language={language}
                onError={handlePlayerError}
                onProgress={handleProgress}
                onReady={handlePlayerReady}
                onStateChange={handlePlayerStateChange}
                ref={playerRef}
                showYouTubeControls
                videoId={videoId}
              />
            ) : null}
            {!isPlayerReady && !playerError ? (
              <Text accessibilityLiveRegion="polite" style={styles.playerStatus}>
                {t("rosary.video.loading")}
              </Text>
            ) : null}
          </View>

          {playerError ? (
            <View accessibilityRole="alert" style={styles.statusCard}>
              <Text style={styles.statusText}>{t("rosary.video.unavailable")}</Text>
              <Button
                accessibilityHint={t("rosary.video.retryLoadHint")}
                accessibilityLabel={t("rosary.video.retryLoadLabel")}
                onPress={retryPlayer}
                size="sm"
                variant="warning"
              >
                {t("common.retry")}
              </Button>
            </View>
          ) : null}

          {completionStatus === "recording" ? (
            <Text accessibilityLiveRegion="polite" style={styles.completionStatus}>
              {t("rosary.video.saving")}
            </Text>
          ) : null}
          {completionStatus === "save-error" ? (
            <View accessibilityRole="alert" style={styles.statusCard}>
              <Text style={styles.statusText}>{t("rosary.video.saveError")}</Text>
              <Button
                accessibilityHint={t("rosary.video.retrySaveHint")}
                accessibilityLabel={t("rosary.video.retrySaveLabel")}
                onPress={retryCompletion}
                size="sm"
                variant="warning"
              >
                {t("common.retry")}
              </Button>
            </View>
          ) : null}
        </View>
        <View style={styles.controlsArea}>
          <View
            accessibilityLabel={t("rosary.video.controlsLabel")}
            style={styles.controls}
            testID="rosary-video-controls"
          >
            <VideoControl
              accessibilityHint={t("rosary.video.back15Hint")}
              accessibilityLabel={t("rosary.video.back15Label")}
              disabled={controlsDisabled}
              icon="rotate-ccw"
              label={t("rosary.video.back15")}
              onPress={seekBackward}
              showDivider
            />
            <VideoControl
              accessibilityHint={isPlaying ? t("rosary.video.pauseHint") : t("rosary.video.playHint")}
              accessibilityLabel={isPlaying ? t("rosary.video.pauseLabel") : t("rosary.video.playLabel")}
              disabled={controlsDisabled}
              icon={isPlaying ? "pause" : "play"}
              label={isPlaying ? t("rosary.video.pause") : t("rosary.video.play")}
              onPress={togglePlayback}
              primary
              showDivider
            />
            <VideoControl
              accessibilityHint={t("rosary.video.forward15Hint")}
              accessibilityLabel={t("rosary.video.forward15Label")}
              disabled={controlsDisabled}
              icon="rotate-cw"
              label={t("rosary.video.forward15")}
              onPress={seekForward}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safeArea: { backgroundColor: theme.colors.black, flex: 1 },
  content: { backgroundColor: theme.colors.black, flex: 1 },
  playerArea: { flex: 1, justifyContent: "center" },
  playerFrame: {
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.black,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  playerStatus: {
    ...theme.typography.bodySmall,
    alignSelf: "center",
    color: theme.colors.text.secondary,
    position: "absolute",
  },
  controlsArea: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  controls: {
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    maxWidth: 396,
    overflow: "hidden",
    width: "100%",
  },
  control: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    gap: theme.spacing[1],
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget + theme.spacing[2],
    minWidth: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[2],
  },
  controlDivider: {
    borderRightColor: theme.colors.border.default,
    borderRightWidth: theme.borderWidths.thin,
  },
  primaryControl: { backgroundColor: theme.rosary.colors.gold },
  controlDisabled: { opacity: theme.opacity.disabled },
  controlPressed: { opacity: theme.opacity.pressed },
  controlText: { ...theme.typography.caption, color: theme.colors.text.primary, textAlign: "center" },
  primaryControlText: { color: theme.colors.text.inverse },
  completionStatus: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    textAlign: "center",
  },
  statusCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
  },
  statusText: { ...theme.typography.bodySmall, color: theme.colors.text.primary, textAlign: "center" },
}));
