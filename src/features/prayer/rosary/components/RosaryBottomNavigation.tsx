import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { PrayerProgress } from "@/features/prayer/rosary/types";

interface RosaryBottomNavigationProps {
  progress: PrayerProgress;
  decadeCount?: number;
  activeDecadeIndex?: number;
  disabled?: boolean;
  onAdvance: () => void;
  onRestart: () => void;
}

/** Renders theme-aware bead progress, next-bead navigation, and Rosary settings. */
export function RosaryBottomNavigation({
  progress,
  decadeCount = 5,
  activeDecadeIndex = 0,
  disabled = false,
  onAdvance,
  onRestart,
}: RosaryBottomNavigationProps) {
  const styles = useThemedStyles(styleSheet);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    scale.value = withSequence(withTiming(1.025, { duration: 130 }), withSpring(1));
  }, [progress.currentIndex, reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.navigation}>
      <View style={styles.buttonRow}>
        <Animated.View style={[styles.progressWrap, animatedStyle]}>
          <Pressable
            accessibilityHint="Advances to the next rosary bead."
            accessibilityLabel={`${progress.prayerName}, ${progress.currentIndex} of ${progress.total}. Next bead.`}
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
                {progress.currentIndex} of {progress.total}
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
          accessibilityHint="Opens options for this Rosary mystery."
          accessibilityLabel="Open Rosary settings"
          accessibilityRole="button"
          onPress={() => setSettingsVisible(true)}
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
        onRequestClose={() => setSettingsVisible(false)}
        presentationStyle="overFullScreen"
        transparent
        visible={settingsVisible}
      >
        <View style={styles.modalOverlay}>
          <View accessibilityViewIsModal style={styles.settingsModal}>
            <View style={styles.modalHeading}>
              <View>
                <Text accessibilityRole="header" style={styles.modalTitle}>
                  Rosary settings
                </Text>
                <Text style={styles.modalCopy}>Choose how you would like to continue.</Text>
              </View>
              <Pressable
                accessibilityLabel="Close Rosary settings"
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={() => setSettingsVisible(false)}
                style={styles.closeButton}
              >
                <Feather color={theme.colors.icon.primary} name="x" size={theme.sizes.iconMedium} />
              </Pressable>
            </View>
            <Pressable
              accessibilityLabel="Restart current mystery"
              accessibilityRole="button"
              onPress={() => {
                setSettingsVisible(false);
                onRestart();
              }}
              style={({ pressed }) => [styles.settingAction, pressed && styles.pressed]}
            >
              <Feather color={theme.rosary.colors.gold} name="rotate-ccw" size={theme.sizes.iconSmall} />
              <Text style={styles.settingActionText}>Restart this mystery</Text>
            </Pressable>
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
    padding: theme.spacing[5],
    width: "100%",
  },
  modalHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  settingAction: {
    alignItems: "center",
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.md,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    gap: theme.spacing[2],
    marginTop: theme.spacing[5],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  settingActionText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
}));
