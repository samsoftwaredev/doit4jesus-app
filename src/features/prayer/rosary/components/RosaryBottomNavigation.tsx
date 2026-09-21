import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { LanguageSelector } from "@/components";
import { type SupportedLanguage, useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import { ROSARY_LENGTH_OPTIONS } from "@/features/prayer/rosary/data/rosaryLengths";
import type { PrayerProgress, RosaryLength } from "@/features/prayer/rosary/types";

interface RosaryBottomNavigationProps {
  audioAvailable?: boolean;
  audioError?: boolean;
  audioLoading?: boolean;
  audioMuted?: boolean;
  audioPlaying?: boolean;
  progress: PrayerProgress;
  decadeCount?: number;
  activeDecadeIndex?: number;
  disabled?: boolean;
  onAdvance: () => void;
  onAudioMutedChange?: (muted: boolean) => void;
  onAudioToggle?: () => void;
  onLengthChange: (length: RosaryLength) => void;
  onRestart: () => void;
  onSettingsVisibilityChange?: (visible: boolean) => void;
  rosaryLength: RosaryLength;
  settingsVisible?: boolean;
}

const prayerKeysByLength: Record<RosaryLength, readonly string[]> = {
  short: ["one", "two", "three", "four"],
  medium: ["one", "two"],
  long: ["one"],
};

/** Creates a press handler that selects one length without forwarding the native press event. */
function createLengthPressHandler(onLengthChange: (length: RosaryLength) => void, length: RosaryLength) {
  /** Applies the length represented by this settings option. */
  return function handleLengthPress() {
    onLengthChange(length);
  };
}

/** Renders bead progress and the only controls that can change or restart the active Rosary. */
export function RosaryBottomNavigation({
  audioAvailable = false,
  audioError = false,
  audioLoading = false,
  audioMuted = false,
  audioPlaying = false,
  progress,
  decadeCount = 5,
  activeDecadeIndex = 0,
  disabled = false,
  onAdvance,
  onAudioMutedChange,
  onAudioToggle,
  onLengthChange,
  onRestart,
  onSettingsVisibilityChange,
  rosaryLength,
  settingsVisible,
}: RosaryBottomNavigationProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language, setLanguage } = useAppLanguage();
  const [internalSettingsVisible, setInternalSettingsVisible] = useState(false);
  const isSettingsVisible = settingsVisible ?? internalSettingsVisible;
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    scale.value = withSequence(withTiming(1.025, { duration: 130 }), withSpring(1));
  }, [progress.currentIndex, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /** Updates controlled or local modal state so every settings trigger shares one dialog. */
  const updateSettingsVisibility = (visible: boolean) => {
    if (settingsVisible === undefined) setInternalSettingsVisible(visible);
    onSettingsVisibilityChange?.(visible);
  };

  /** Opens the shared Rosary settings modal. */
  const handleOpenSettings = () => updateSettingsVisibility(true);

  /** Closes the shared Rosary settings modal. */
  const handleCloseSettings = () => updateSettingsVisibility(false);

  /** Closes settings before restarting the active Rosary from its first prayer. */
  const handleRestart = () => {
    handleCloseSettings();
    onRestart();
  };

  /** Toggles the persisted mute preference from the settings switch. */
  const handleAudioMutedChange = () => onAudioMutedChange?.(!audioMuted);

  /** Applies and persists the app language selected from Rosary settings. */
  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    void setLanguage(nextLanguage);
  };

  const audioLabel = !audioAvailable
    ? t("rosary.audio.unavailable")
    : audioError
      ? t("rosary.audio.error")
      : audioLoading
        ? t("rosary.audio.loading")
        : audioPlaying
          ? t("rosary.audio.pause")
          : t("rosary.audio.play");

  return (
    <View style={styles.navigation}>
      <View style={styles.buttonRow}>
        <Animated.View style={[styles.progressWrap, animatedStyle]}>
          <Pressable
            accessibilityHint={t("rosary.settings.advanceHint")}
            accessibilityLabel={t("rosary.settings.nextLabel", {
              current: progress.currentIndex,
              prayer: progress.prayerName,
              total: progress.total,
            })}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={onAdvance}
            onPressIn={() => {
              if (!reduceMotion) scale.value = withTiming(0.98, { duration: 90 });
            }}
            onPressOut={() => {
              if (!reduceMotion) scale.value = withSpring(1);
            }}
            style={({ pressed }) => [styles.progressButton, pressed && !disabled && styles.pressed]}
            testID="rosary-progress-button"
          >
            <View accessible={false} style={styles.activeBead}>
              <View style={styles.activeBeadCore} />
            </View>
            <View style={styles.progressCopy}>
              <Text numberOfLines={1} style={styles.prayerName}>
                {progress.prayerName}
              </Text>
              <Text style={styles.progressText}>
                {t("rosary.settings.progress", { current: progress.currentIndex, total: progress.total })}
              </Text>
            </View>
            <Feather
              accessible={false}
              color={theme.rosary.colors.goldBright}
              name="chevron-right"
              size={theme.sizes.iconMedium}
            />
          </Pressable>
        </Animated.View>

        <Pressable
          accessibilityLabel={audioLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: !audioAvailable, ...(audioLoading ? { busy: true } : {}) }}
          disabled={!audioAvailable}
          onPress={onAudioToggle}
          style={({ pressed }) => [styles.audioButton, pressed && audioAvailable && styles.pressed]}
        >
          <Feather
            accessible={false}
            color={audioAvailable ? theme.rosary.colors.goldBright : theme.colors.icon.muted}
            name={audioPlaying ? "pause" : "play"}
            size={theme.sizes.iconMedium}
          />
        </Pressable>

        <Pressable
          accessibilityHint={t("rosary.settings.openHint")}
          accessibilityLabel={t("rosary.settings.open")}
          accessibilityRole="button"
          onPress={handleOpenSettings}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
          testID="open-rosary-settings"
        >
          <Feather
            accessible={false}
            color={theme.rosary.colors.goldBright}
            name="settings"
            size={theme.sizes.iconMedium}
          />
        </Pressable>
      </View>

      <View accessible={false} style={styles.indicators}>
        {Array.from({ length: decadeCount }, (_, index) => (
          <View key={index} style={[styles.indicator, index === activeDecadeIndex && styles.activeIndicator]} />
        ))}
      </View>

      <Modal
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={handleCloseSettings}
        presentationStyle="overFullScreen"
        transparent
        visible={isSettingsVisible}
      >
        <View style={styles.modalOverlay}>
          <View accessibilityViewIsModal style={styles.settingsModal}>
            <View style={styles.modalHeading}>
              <View style={styles.modalHeadingCopy}>
                <Text accessibilityRole="header" style={styles.modalTitle}>
                  {t("rosary.settings.title")}
                </Text>
                <Text style={styles.modalCopy}>{t("rosary.settings.copy")}</Text>
              </View>
              <Pressable
                accessibilityLabel={t("rosary.settings.close")}
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={handleCloseSettings}
                style={styles.closeButton}
              >
                <Feather accessible={false} color={theme.colors.icon.primary} name="x" size={theme.sizes.iconMedium} />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={styles.settingsScrollContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              style={styles.settingsScroll}
            >
              <View style={styles.settingSection}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  {t("rosary.settings.progressTitle")}
                </Text>
                <Pressable
                  accessibilityLabel={t("rosary.settings.restartLabel")}
                  accessibilityRole="button"
                  onPress={handleRestart}
                  style={({ pressed }) => [styles.settingAction, pressed && styles.pressed]}
                >
                  <Feather
                    accessible={false}
                    color={theme.rosary.colors.gold}
                    name="rotate-ccw"
                    size={theme.sizes.iconSmall}
                  />
                  <Text style={styles.settingActionText}>{t("rosary.settings.restart")}</Text>
                </Pressable>
              </View>

              <View style={styles.settingSection}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  {t("rosary.settings.lengthTitle")}
                </Text>
                <View
                  accessibilityLabel={t("rosary.settings.lengthTitle")}
                  accessibilityRole="radiogroup"
                  style={styles.lengthOptions}
                >
                  {ROSARY_LENGTH_OPTIONS.map((option) => {
                    const selected = option.id === rosaryLength;
                    const label = t(`rosary.length.${option.id}.label`);
                    const introduction = t(`rosary.length.${option.id}.introduction`);
                    const prayers = prayerKeysByLength[option.id].map((key) =>
                      t(`rosary.length.${option.id}.prayers.${key}`),
                    );
                    return (
                      <Pressable
                        accessibilityHint={`${introduction} ${prayers.join(", ")}.`}
                        accessibilityLabel={`${label} ${t("rosary.name")}`}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        key={option.id}
                        onPress={createLengthPressHandler(onLengthChange, option.id)}
                        style={({ pressed }) => [
                          styles.lengthOption,
                          selected && styles.selectedLengthOption,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View accessible={false} style={[styles.radio, selected && styles.selectedRadio]}>
                          {selected ? <View style={styles.radioCore} /> : null}
                        </View>
                        <View style={styles.lengthCopy}>
                          <Text style={[styles.lengthTitle, selected && styles.selectedLengthTitle]}>{label}</Text>
                          <Text style={styles.lengthIntroduction}>{introduction}</Text>
                          {prayers.map((prayer) => (
                            <Text key={prayer} style={styles.lengthPrayer}>
                              • {prayer}
                            </Text>
                          ))}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.settingSection}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  {t("rosary.settings.audioTitle")}
                </Text>
                <Pressable
                  accessibilityHint={t("rosary.audio.settingDescription")}
                  accessibilityLabel={t("rosary.audio.settingLabel")}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: audioMuted }}
                  onPress={handleAudioMutedChange}
                  style={({ pressed }) => [styles.audioSetting, pressed && styles.pressed]}
                >
                  <View style={styles.audioSettingCopy}>
                    <Text style={styles.lengthTitle}>{t("rosary.audio.settingLabel")}</Text>
                    <Text style={styles.lengthIntroduction}>{t("rosary.audio.settingDescription")}</Text>
                  </View>
                  <View accessible={false} style={[styles.switchTrack, audioMuted && styles.switchTrackEnabled]}>
                    <View style={[styles.switchThumb, audioMuted && styles.switchThumbEnabled]} />
                  </View>
                </Pressable>
              </View>

              <View style={styles.settingSection}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  {t("common.language")}
                </Text>
                <Text style={styles.sectionCopy}>{t("rosary.settings.languageCopy")}</Text>
                <LanguageSelector language={language} onChange={handleLanguageChange} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  navigation: {
    paddingTop: theme.spacing[2],
  },
  buttonRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  progressWrap: {
    flex: 1,
  },
  progressButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    flexDirection: "row",
    minHeight: theme.sizes.buttonHeightLarge,
    paddingHorizontal: theme.spacing[3],
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  activeBead: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.pearl,
    borderColor: theme.rosary.colors.goldBright,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldEmphasis,
    height: theme.spacing[7],
    justifyContent: "center",
    marginRight: theme.spacing[2],
    width: theme.spacing[7],
    ...theme.rosary.shadows.activeBead,
  },
  activeBeadCore: {
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    height: theme.spacing[1.5],
    width: theme.spacing[1.5],
  },
  progressCopy: {
    flex: 1,
    minWidth: 0,
  },
  prayerName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[0.5],
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.sizes.buttonHeightLarge,
    justifyContent: "center",
    width: theme.sizes.buttonHeightLarge,
  },
  audioButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    opacity: 1,
    width: theme.sizes.touchTarget,
  },
  indicators: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1.5],
    justifyContent: "center",
    paddingTop: theme.spacing[2],
  },
  indicator: {
    backgroundColor: theme.rosary.colors.blueMuted,
    borderRadius: theme.radii.pill,
    height: theme.spacing[1.5],
    width: theme.spacing[1.5],
  },
  activeIndicator: {
    backgroundColor: theme.rosary.colors.gold,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[5],
  },
  settingsModal: {
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.gold,
    maxWidth: 420,
    maxHeight: "90%",
    padding: theme.spacing[5],
    width: "100%",
  },
  modalHeading: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  modalTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  modalCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: -theme.spacing[2],
    marginTop: -theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
    minWidth: theme.sizes.touchTarget,
  },
  settingsScroll: {
    flexShrink: 1,
    minHeight: 0,
  },
  settingsScrollContent: {
    paddingBottom: theme.spacing[1],
  },
  settingSection: {
    borderTopColor: theme.colors.border.warning,
    borderTopWidth: theme.rosary.borderWidths.goldHairline,
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
  },
  sectionTitle: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
    textTransform: "uppercase",
  },
  sectionCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
  },
  lengthOptions: {
    gap: theme.spacing[2],
  },
  audioSetting: {
    alignItems: "center",
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.lg,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    justifyContent: "space-between",
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing[3],
  },
  audioSettingCopy: {
    flex: 1,
    minWidth: 0,
  },
  switchTrack: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.pill,
    height: theme.spacing[6],
    justifyContent: "center",
    paddingHorizontal: theme.spacing[0.5],
    width: theme.spacing[12],
  },
  switchTrackEnabled: {
    backgroundColor: theme.rosary.colors.gold,
  },
  switchThumb: {
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radii.pill,
    height: theme.spacing[5],
    width: theme.spacing[5],
  },
  switchThumbEnabled: {
    alignSelf: "flex-end",
  },
  lengthOption: {
    alignItems: "flex-start",
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.lg,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing[3],
  },
  selectedLengthOption: {
    backgroundColor: theme.colors.semantic.warningSurface,
    borderColor: theme.rosary.colors.goldBright,
  },
  radio: {
    alignItems: "center",
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.spacing[5],
    justifyContent: "center",
    marginTop: theme.spacing[0.5],
    width: theme.spacing[5],
  },
  selectedRadio: {
    borderColor: theme.rosary.colors.goldBright,
  },
  radioCore: {
    backgroundColor: theme.rosary.colors.goldBright,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2.5],
    width: theme.spacing[2.5],
  },
  lengthCopy: {
    flex: 1,
    minWidth: 0,
  },
  lengthTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  selectedLengthTitle: {
    color: theme.rosary.colors.goldBright,
  },
  lengthIntroduction: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
  },
  lengthPrayer: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[1],
  },
  settingAction: {
    alignItems: "center",
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.md,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    gap: theme.spacing[2],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  settingActionText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
}));
