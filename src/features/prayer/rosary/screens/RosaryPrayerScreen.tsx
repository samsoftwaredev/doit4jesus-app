import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  type LayoutChangeEvent,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Confetti, SacredAtmosphere } from "@/components/ui";
import { recordPrayerForIntention } from "@/features/prayer/intentions";
import { recordRosaryActivity } from "@/features/prayer/rosary/api/activities.api";
import {
  FruitOfMysteryCard,
  MysteryCard,
  PrayerCard,
  RosaryBeadNavigator,
  RosaryBottomNavigation,
  RosaryPresence,
  ScriptureCard,
} from "@/features/prayer/rosary/components";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import {
  formatRosaryAudioDuration,
  getRemainingRosaryAudioSeconds,
  getRosaryAudioDurationSeconds,
} from "@/features/prayer/rosary/data/rosaryAudioTiming";
import type { RosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import { ROSARY_LENGTH_OPTIONS } from "@/features/prayer/rosary/data/rosaryLengths";
import { getRosaryMysteriesFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import { createRosarySequence, getRosarySequenceForLength } from "@/features/prayer/rosary/data/rosarySequence";
import { useRosaryArtStylePreference } from "@/features/prayer/rosary/hooks/useRosaryArtStylePreference";
import { useRosaryAudioPlayback } from "@/features/prayer/rosary/hooks/useRosaryAudioPlayback";
import { useRosaryAudioPreference } from "@/features/prayer/rosary/hooks/useRosaryAudioPreference";
import { useRosaryLengthPreference } from "@/features/prayer/rosary/hooks/useRosaryLengthPreference";
import { useRosarySession } from "@/features/prayer/rosary/hooks/useRosarySession";
import type { RosaryArtStyle, RosaryBead, RosaryLength, RosaryMysteryType } from "@/features/prayer/rosary/types";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

function completionDateLabel(date: string | null, locale: string, today: string) {
  const value = date ? new Date(date) : new Date();
  if (Number.isNaN(value.getTime())) return today;
  return value.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function createIdempotencyKey() {
  const random = Array.from({ length: 24 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
  return `rosary-${Date.now().toString(36)}-${random}`;
}

/** Counts only physical beads through the current prayer step, excluding the crucifix and non-bead prayers. */
function physicalBeadProgress(beads: RosaryBead[], currentBeadIndex: number) {
  const total = beads.filter((bead) => bead.isPhysicalBead !== false).length;
  const boundedIndex = Math.max(0, Math.min(currentBeadIndex, beads.length - 1));
  const currentIndex = beads.slice(0, boundedIndex + 1).filter((bead) => bead.isPhysicalBead !== false).length;

  return { currentIndex, total };
}

/**
 * Renders the guided Rosary within the shared atmosphere using the selected style's localized mystery artwork and prayer sequence.
 * Full sessions include opening, five decades, and closing prayers; the bead rail remains bounded to the visible viewport.
 */
export function RosaryPrayerScreen({
  content: providedContent,
  intentionId,
  isDecade = true,
  mysteryType = "joyful",
  source: _source = "manual",
}: {
  content?: RosaryContent;
  intentionId?: string;
  isDecade?: boolean;
  mysteryType?: RosaryMysteryType;
  source?: string;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language, locale } = useAppLanguage();
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [completionVisible, setCompletionVisible] = useState(false);
  const [completionCelebration, setCompletionCelebration] = useState(0);
  const [completionError, setCompletionError] = useState<string>();
  const [intentionPrayerCount, setIntentionPrayerCount] = useState<number>();
  const [isRecordingCompletion, setIsRecordingCompletion] = useState(false);
  const [backgroundImageFailed, setBackgroundImageFailed] = useState(false);
  const [pageViewportHeight, setPageViewportHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [rosaryRecorded, setRosaryRecorded] = useState(false);
  const [rosarySettingsVisible, setRosarySettingsVisible] = useState(false);
  const {
    isHydrated: isLengthHydrated,
    rosaryLength,
    setRosaryLength,
    storageError: lengthStorageError,
  } = useRosaryLengthPreference();
  const {
    isHydrated: isAudioPreferenceHydrated,
    isMuted: isAudioMuted,
    setIsMuted: setAudioMuted,
    storageError: audioStorageError,
  } = useRosaryAudioPreference();
  const { rosaryArtStyle, setRosaryArtStyle, storageError: artStyleStorageError } = useRosaryArtStylePreference();
  const lastAnnouncement = useRef<string | null>(null);
  const hadCompletion = useRef(false);
  const hydratedCompletionState = useRef(false);
  const completionKey = useRef<string | undefined>(undefined);
  const completionStartedAt = useRef(new Date());
  const activityRecorded = useRef(false);
  const intentionPrayerRecorded = useRef(false);
  const completionRequestInFlight = useRef(false);
  const isTablet = width >= theme.breakpoints.tablet;
  const compact = width < theme.breakpoints.smallPhone || fontScale > 1.25;
  const rosaryColumnWidth = isTablet
    ? Math.min(224, Math.max(176, width * 0.24))
    : Math.min(compact ? 104 : 142, Math.max(compact ? 88 : 108, width * (compact ? 0.28 : 0.3)));
  const contentGap = isTablet ? theme.spacing[6] : theme.spacing[3];
  const rosaryViewportHeight =
    pageViewportHeight > 0 && headerHeight > 0
      ? Math.max(0, pageViewportHeight - headerHeight - contentGap)
      : undefined;
  const defaultRosaryContent = useMemo(() => getRosaryContent(language), [language]);
  const rosaryContent = providedContent ?? defaultRosaryContent;
  const defaultMysteries = useMemo(
    () => getRosaryMysteriesFromContent(rosaryContent, mysteryType, rosaryArtStyle),
    [mysteryType, rosaryArtStyle, rosaryContent],
  );
  const mysteries = defaultMysteries;
  const activeMysteries = useMemo(() => (isDecade ? [mysteries[0]].filter(Boolean) : mysteries), [isDecade, mysteries]);
  const shortRosaryBeads = useMemo(
    () => getRosarySequenceForLength(rosaryContent, mysteryType, "short"),
    [mysteryType, rosaryContent],
  );
  const selectedRosaryBeads = useMemo(
    () => getRosarySequenceForLength(rosaryContent, mysteryType, rosaryLength),
    [mysteryType, rosaryContent, rosaryLength],
  );
  const rosaryLengthAudioDurations = useMemo(
    () =>
      ROSARY_LENGTH_OPTIONS.reduce<Record<RosaryLength, number>>(
        (durations, option) => {
          const audioPaths = getRosarySequenceForLength(rosaryContent, mysteryType, option.id).flatMap(
            (bead) => bead.audioQueue ?? [],
          );
          durations[option.id] = getRosaryAudioDurationSeconds(audioPaths);
          return durations;
        },
        { long: 0, medium: 0, short: 0 },
      ),
    [mysteryType, rosaryContent],
  );
  const decadeRosaryBeads = useMemo(() => createRosarySequence(1, rosaryContent), [rosaryContent]);
  const activeBeads = isDecade ? decadeRosaryBeads : selectedRosaryBeads;

  /** Falls back to the Rosary gradient when the active mystery artwork cannot be displayed. */
  const handleBackgroundImageError = useCallback(() => setBackgroundImageFailed(true), []);
  /** Unmutes persisted Rosary audio before an explicit Play action. */
  const handleRequestAudioUnmute = useCallback(() => setAudioMuted(false), [setAudioMuted]);
  const session = useRosarySession({
    beads: activeBeads,
    enabled: isLengthHydrated,
    isFullRosary: !isDecade,
    legacyBeads: isDecade ? decadeRosaryBeads : shortRosaryBeads,
    mysteries: activeMysteries,
    storageKey: `@doit4jesus/rosary-session/${isDecade ? "v3" : "v4"}/${mysteryType}/${isDecade ? "decade" : "full"}`,
  });

  useEffect(() => {
    setBackgroundImageFailed(false);
  }, [session.currentMystery?.id]);
  const audioPlayback = useRosaryAudioPlayback({
    audioQueue: session.currentBead?.audioQueue,
    isMuted: isAudioMuted,
    isPreferenceHydrated: isAudioPreferenceHydrated && session.isHydrated,
    onQueueComplete: session.goToNextBead,
    onRequestUnmute: handleRequestAudioUnmute,
    playbackKey: session.currentBead?.id,
  });

  const beadProgress = useMemo(
    () => physicalBeadProgress(activeBeads, session.currentBeadIndex),
    [activeBeads, session.currentBeadIndex],
  );
  const progress = {
    ...beadProgress,
    prayerName: session.currentPrayer?.name ?? t("rosary.cards.prayer"),
  };

  /** Formats an exact localized audio duration for a selectable Rosary length. */
  const getRosaryLengthLabel = useCallback(
    (length: RosaryLength) =>
      t("rosary.length.timedLabel", {
        duration: formatRosaryAudioDuration(rosaryLengthAudioDurations[length]),
        name: t(`rosary.length.${length}.name`),
      }),
    [rosaryLengthAudioDurations, t],
  );
  const remainingAudioPaths = useMemo(
    () => activeBeads.slice(Math.max(0, session.currentBeadIndex)).flatMap((bead) => bead.audioQueue ?? []),
    [activeBeads, session.currentBeadIndex],
  );
  const remainingAudioSeconds = useMemo(
    () =>
      getRemainingRosaryAudioSeconds({
        currentTrackIndex: audioPlayback.currentTrackIndex,
        currentTrackPosition: audioPlayback.currentTrackPosition,
        remainingAudioPaths,
      }),
    [audioPlayback.currentTrackIndex, audioPlayback.currentTrackPosition, remainingAudioPaths],
  );
  const remainingAudioDuration = useMemo(
    () => formatRosaryAudioDuration(remainingAudioSeconds),
    [remainingAudioSeconds],
  );
  const lengthIndicatorLabel = useMemo(
    () =>
      t("rosary.length.timedRemainingLabel", {
        length: t(`rosary.length.${rosaryLength}.name`),
        remaining: remainingAudioDuration,
      }),
    [remainingAudioDuration, rosaryLength, t],
  );
  const lengthIndicatorAccessibilityLabel = useMemo(
    () =>
      t("rosary.length.currentWithRemaining", {
        length: t(`rosary.length.${rosaryLength}.name`),
        remaining: remainingAudioDuration,
      }),
    [remainingAudioDuration, rosaryLength, t],
  );

  /** Applies and announces a Rosary length selected from the settings modal. */
  const handleRosaryLengthChange = useCallback(
    (length: RosaryLength) => {
      void setRosaryLength(length);
      AccessibilityInfo.announceForAccessibility(t("rosary.length.selected", { length: getRosaryLengthLabel(length) }));
    },
    [getRosaryLengthLabel, setRosaryLength, t],
  );

  /** Applies and persists a mystery artwork style selected from the settings modal. */
  const handleRosaryArtStyleChange = useCallback(
    (style: RosaryArtStyle) => {
      void setRosaryArtStyle(style);
      AccessibilityInfo.announceForAccessibility(
        t("rosary.settings.artStyleSelected", { style: t(`rosary.settings.artStyles.${style}`) }),
      );
    },
    [setRosaryArtStyle, t],
  );

  /** Opens the shared Rosary settings modal from the active-length badge. */
  const handleOpenRosarySettings = useCallback(() => setRosarySettingsVisible(true), []);

  /** Persists a settings change and lets the playback hook pause immediately when muted. */
  const handleAudioMutedChange = useCallback(
    (muted: boolean) => {
      void setAudioMuted(muted);
    },
    [setAudioMuted],
  );

  /** Toggles the active prayer queue without forwarding the native press event. */
  const handleAudioToggle = useCallback(() => {
    void audioPlayback.togglePlayback();
  }, [audioPlayback]);

  /** Records the visible scrolling region so the Rosary rail does not grow with the card stack. */
  const handlePageViewportLayout = useCallback((event: LayoutChangeEvent) => {
    setPageViewportHeight(event.nativeEvent.layout.height);
  }, []);

  /** Records the responsive header height used to calculate the remaining Rosary viewport. */
  const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    if (!session.isHydrated || !session.currentMystery || !session.currentBead || session.isTransitioning) return;
    const isAtCrucifix =
      session.currentBead.type === "creed" ||
      (session.currentBead.type === "signOfCross" && session.currentBead.section === "opening");
    const markerPosition = isAtCrucifix
      ? t("rosary.controls.atCrucifix", { total: progress.total })
      : t("rosary.controls.atBead", { current: progress.currentIndex, total: progress.total });
    const announcement = `${session.currentPrayer?.name ?? t("rosary.cards.prayer")}, ${markerPosition}. ${session.currentMystery.title}.`;
    if (lastAnnouncement.current === announcement) return;
    lastAnnouncement.current = announcement;
    const timeout = setTimeout(() => AccessibilityInfo.announceForAccessibility(announcement), 220);
    return () => clearTimeout(timeout);
  }, [
    session.currentBead,
    session.currentBeadIndex,
    session.currentMystery,
    session.currentPrayer?.name,
    session.isHydrated,
    session.isTransitioning,
    progress.currentIndex,
    progress.total,
    t,
  ]);

  const recordCompletedPrayer = useCallback(async () => {
    if (completionRequestInFlight.current) return;
    completionRequestInFlight.current = true;
    setCompletionError(undefined);
    setIsRecordingCompletion(true);

    try {
      if (!activityRecorded.current) {
        const completedAt = new Date();
        const result = await recordRosaryActivity({
          completedAt: completedAt.toISOString(),
          durationSeconds: Math.max(
            0,
            Math.floor((completedAt.getTime() - completionStartedAt.current.getTime()) / 1000),
          ),
          idempotencyKey: completionKey.current ?? (completionKey.current = createIdempotencyKey()),
          occurredAt: completionStartedAt.current.toISOString(),
        });
        activityRecorded.current = true;
        setRosaryRecorded(true);
        if (result.points > 0) {
          AccessibilityInfo.announceForAccessibility(
            t("rosary.completion.activityRecorded", { points: result.points }),
          );
        }
      }

      if (intentionId && !intentionPrayerRecorded.current) {
        try {
          const intentionResult = await recordPrayerForIntention(intentionId);
          intentionPrayerRecorded.current = true;
          setIntentionPrayerCount(intentionResult.prayerCount);
        } catch (error) {
          logDevelopmentError("recording a Rosary prayer for an intention", error);
          setCompletionError(t("rosary.completion.intentionError"));
        }
      }
    } catch (error) {
      logDevelopmentError("recording Rosary completion", error);
      setCompletionError(error instanceof Error ? error.message : t("rosary.completion.saveError"));
    } finally {
      completionRequestInFlight.current = false;
      setIsRecordingCompletion(false);
    }
  }, [intentionId, t]);

  useEffect(() => {
    if (!session.isHydrated) return;
    if (!hydratedCompletionState.current) {
      hydratedCompletionState.current = true;
      hadCompletion.current = session.isRosaryCompleted;
      if (session.isRosaryCompleted) setCompletionVisible(true);
      return;
    }

    if (session.isRosaryCompleted && !hadCompletion.current) {
      hadCompletion.current = true;
      setCompletionVisible(true);
      setCompletionCelebration((current) => current + 1);
      AccessibilityInfo.announceForAccessibility(
        t("rosary.completion.completeAnnouncement", {
          mystery: session.currentMystery?.title ?? t("rosary.completion.currentMystery"),
        }),
      );
      void recordCompletedPrayer();
    }
    if (!session.isRosaryCompleted) hadCompletion.current = false;
  }, [recordCompletedPrayer, session.currentMystery?.title, session.isHydrated, session.isRosaryCompleted, t]);

  const restart = () => {
    setCompletionVisible(false);
    setCompletionError(undefined);
    setIntentionPrayerCount(undefined);
    setRosaryRecorded(false);
    activityRecorded.current = false;
    intentionPrayerRecorded.current = false;
    completionKey.current = undefined;
    completionStartedAt.current = new Date();
    session.restartMystery();
  };

  /** Closes the completion modal and returns to Home positioned at the Rosary Garden. */
  const exitToGarden = useCallback(() => {
    setCompletionVisible(false);
    router.replace({ pathname: "/home", params: { scrollTo: "garden" } });
  }, [router]);

  return (
    <View style={styles.background}>
      {!session.currentMystery || backgroundImageFailed ? (
        <LinearGradient
          colors={[theme.rosary.colors.canvas, theme.rosary.colors.canvasLight, theme.rosary.colors.canvas]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.backgroundFallback}
        />
      ) : (
        <Image
          accessible={false}
          cachePolicy="memory-disk"
          contentFit="cover"
          onError={handleBackgroundImageError}
          source={session.currentMystery.imageSource}
          style={styles.mysteryBackground}
          testID="rosary-mystery-background"
          transition={reduceMotion ? 0 : 220}
        />
      )}
      <View pointerEvents="none" style={styles.mysteryScrim} testID="rosary-mystery-scrim" />
      <SacredAtmosphere />
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <View
          style={[
            styles.page,
            {
              maxWidth: isTablet ? 1180 : undefined,
              paddingHorizontal: isTablet ? theme.spacing[7] : compact ? theme.spacing[2] : theme.spacing[3],
            },
          ]}
        >
          <ScrollView
            accessibilityLabel={t("rosary.controls.content")}
            contentContainerStyle={[styles.pageScrollContent, { gap: contentGap }]}
            nestedScrollEnabled
            onLayout={handlePageViewportLayout}
            showsVerticalScrollIndicator={false}
            style={styles.pageScroll}
          >
            <View
              accessibilityLabel={t("rosary.controls.header")}
              onLayout={handleHeaderLayout}
              style={[styles.topBar, { gap: compact ? 4 : 8 }]}
            >
              <Pressable
                accessibilityLabel={t("rosary.controls.goBack")}
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Feather
                  accessible={false}
                  color={theme.rosary.colors.immersiveGold}
                  name="chevron-left"
                  size={theme.sizes.iconMedium}
                />
              </Pressable>
              <Pressable
                accessibilityHint={t("rosary.length.hint")}
                accessibilityLabel={lengthIndicatorAccessibilityLabel}
                accessibilityRole="button"
                onPress={handleOpenRosarySettings}
                style={({ pressed }) => [
                  styles.lengthIndicator,
                  compact && styles.compactLengthIndicator,
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  accessible={false}
                  color={theme.rosary.colors.immersiveGold}
                  name="clock"
                  size={theme.sizes.iconSmall}
                />
                <Text ellipsizeMode="head" numberOfLines={1} style={styles.lengthIndicatorText}>
                  {lengthIndicatorLabel}
                </Text>
              </Pressable>
              <RosaryPresence />
            </View>
            <View style={[styles.main, { gap: contentGap }]}>
              <View style={{ height: rosaryViewportHeight, width: rosaryColumnWidth }} testID="rosary-navigator-column">
                <RosaryBeadNavigator
                  beads={activeBeads}
                  compact={compact}
                  completedBeadIds={session.completedBeadIds}
                  currentBeadIndex={session.currentBeadIndex}
                  isTransitioning={session.isTransitioning}
                  onNext={session.goToNextBead}
                  onPrevious={session.goToPreviousBead}
                  onSelectBead={session.selectBead}
                />
              </View>

              <ScrollView
                accessibilityLabel={t("rosary.controls.details")}
                contentContainerStyle={[styles.contentColumnContent, { gap: contentGap }]}
                nestedScrollEnabled
                showsVerticalScrollIndicator
                style={[styles.contentColumn, { height: rosaryViewportHeight }]}
              >
                <MysteryCard mystery={session.currentMystery} />
                <FruitOfMysteryCard
                  description={session.currentMystery?.fruitDescription}
                  fruit={session.currentMystery?.fruit}
                />
                <PrayerCard prayer={session.currentPrayer} />
                <ScriptureCard
                  quotation={
                    session.currentBead?.scriptureText ?? (isDecade ? session.currentMystery?.scriptureText : undefined)
                  }
                  reference={
                    session.currentBead?.scriptureReference ??
                    (isDecade ? session.currentMystery?.scriptureReference : undefined)
                  }
                />
                {audioPlayback.playbackError ? (
                  <Text accessibilityRole="alert" style={styles.storageNote}>
                    {t("rosary.audio.error")}
                  </Text>
                ) : null}
                {session.storageError || lengthStorageError || audioStorageError || artStyleStorageError ? (
                  <Text accessibilityRole="alert" style={styles.storageNote}>
                    {session.storageError
                      ? t("rosary.storage.progress")
                      : lengthStorageError
                        ? t("rosary.storage.length")
                        : audioStorageError
                          ? t("rosary.storage.audio")
                          : t("rosary.storage.artStyle")}
                  </Text>
                ) : null}
              </ScrollView>
            </View>
          </ScrollView>

          <RosaryBottomNavigation
            audioAvailable={audioPlayback.isAvailable}
            audioError={Boolean(audioPlayback.playbackError)}
            audioLoading={audioPlayback.isLoading}
            audioMuted={isAudioMuted}
            audioPlaying={audioPlayback.isPlaying}
            disabled={session.isTransitioning || activeBeads.length === 0}
            onAdvance={session.goToNextBead}
            onArtStyleChange={handleRosaryArtStyleChange}
            onAudioMutedChange={handleAudioMutedChange}
            onAudioToggle={handleAudioToggle}
            onLengthChange={handleRosaryLengthChange}
            onRestart={session.restartMystery}
            onSettingsVisibilityChange={setRosarySettingsVisible}
            progress={progress}
            rosaryLength={rosaryLength}
            rosaryLengthAudioDurations={rosaryLengthAudioDurations}
            rosaryArtStyle={rosaryArtStyle}
            settingsVisible={rosarySettingsVisible}
          />
        </View>

        <Modal
          animationType={reduceMotion ? "none" : "fade"}
          onRequestClose={() => setCompletionVisible(false)}
          presentationStyle="overFullScreen"
          transparent
          visible={completionVisible}
        >
          <View style={styles.completionOverlay}>
            {completionCelebration > 0 ? (
              <Confetti
                active={completionVisible}
                particleCount={52}
                style={styles.completionConfetti}
                testID="rosary-completion-confetti"
                trigger={completionCelebration}
              />
            ) : null}
            <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(220)} style={styles.completionCard}>
              <View style={styles.completionIcon}>
                <Feather
                  accessible={false}
                  color={theme.rosary.colors.goldBright}
                  name="heart"
                  size={theme.sizes.iconLarge}
                />
              </View>
              <Text accessibilityRole="header" style={styles.completionTitle}>
                {t("rosary.completion.title")}
              </Text>
              <Text style={styles.completionDate}>
                {completionDateLabel(session.lastPrayedOn, locale, t("rosary.completion.today"))}
              </Text>
              <Text style={styles.completionCopy}>{t("rosary.completion.copy")}</Text>
              {rosaryRecorded ? <Text style={styles.completionSuccess}>{t("rosary.completion.recorded")}</Text> : null}
              {intentionPrayerCount !== undefined ? (
                <Text style={styles.completionSuccess}>
                  {t("rosary.completion.prayerOffered", { count: intentionPrayerCount })}
                </Text>
              ) : null}
              {completionError ? (
                <Text accessibilityRole="alert" style={styles.completionError}>
                  {completionError}
                </Text>
              ) : null}
              {completionError ? (
                <Pressable
                  accessibilityLabel={t("rosary.completion.retryLabel")}
                  accessibilityRole="button"
                  disabled={isRecordingCompletion}
                  onPress={() => void recordCompletedPrayer()}
                  style={({ pressed }) => [styles.retryAction, pressed && styles.pressed]}
                >
                  <Text style={styles.retryActionText}>
                    {isRecordingCompletion ? t("rosary.completion.recording") : t("common.retry")}
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityLabel={t("rosary.completion.prayAgainLabel")}
                accessibilityRole="button"
                onPress={restart}
                style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
              >
                <Text style={styles.primaryActionText}>{t("rosary.completion.prayAgain")}</Text>
              </Pressable>
              <Pressable
                accessibilityLabel={t("rosary.completion.exitGardenLabel")}
                accessibilityRole="button"
                onPress={exitToGarden}
                style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryActionText}>{t("rosary.completion.exitGarden")}</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
      <SacredAtmosphere layer="foregroundDust" testID="rosary-foreground-atmosphere" />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safeArea: {
    flex: 1,
  },
  background: {
    backgroundColor: theme.rosary.colors.canvas,
    flex: 1,
    position: "relative",
  },
  backgroundFallback: {
    ...StyleSheet.absoluteFill,
  },
  mysteryBackground: {
    ...StyleSheet.absoluteFill,
  },
  mysteryScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.rosary.colors.immersiveScrim,
  },
  page: {
    alignSelf: "center",
    flex: 1,
    minHeight: 0,
    paddingBottom: theme.spacing[2],
    width: "100%",
    zIndex: theme.zIndex.card,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget,
    minWidth: 0,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.immersiveControl,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  lengthIndicator: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: theme.spacing[1.5],
    minHeight: theme.sizes.touchTarget,
    minWidth: 0,
    paddingHorizontal: theme.spacing[3],
  },
  compactLengthIndicator: { gap: theme.spacing[1], paddingHorizontal: theme.spacing[2] },
  lengthIndicatorText: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    flexShrink: 1,
  },
  main: {
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
  },
  contentColumn: {
    flex: 1,
    minWidth: 0,
  },
  contentColumnContent: {
    flexGrow: 1,
  },
  pageScroll: { flex: 1, minHeight: 0 },
  pageScrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing[2],
  },
  storageNote: {
    ...theme.typography.caption,
    color: theme.colors.text.warning,
    textAlign: "center",
  },
  completionOverlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[5],
  },
  completionCard: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.rosary.borderWidths.gold,
    maxWidth: 410,
    padding: theme.spacing[6],
    width: "100%",
    zIndex: 1,
  },
  completionConfetti: {
    zIndex: 0,
  },
  completionIcon: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: "rgba(230, 186, 100, 0.55)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: theme.spacing[12],
    justifyContent: "center",
    width: theme.spacing[12],
  },
  completionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    marginTop: theme.spacing[3],
  },
  completionDate: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.gold,
    marginTop: theme.spacing[1],
  },
  completionCopy: {
    ...theme.typography.body,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  completionError: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.warning,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  completionSuccess: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.success,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    justifyContent: "center",
    marginTop: theme.spacing[5],
    minHeight: theme.sizes.buttonHeight,
    width: "100%",
  },
  primaryActionText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  secondaryAction: {
    alignItems: "center",
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    marginTop: theme.spacing[2],
    minHeight: theme.sizes.buttonHeight,
    width: "100%",
  },
  secondaryActionText: {
    ...theme.typography.button,
    color: theme.colors.text.primary,
  },
  retryAction: {
    alignItems: "center",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.buttonHeight,
    width: "100%",
  },
  retryActionText: {
    ...theme.typography.button,
    color: theme.rosary.colors.goldBright,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
}));
