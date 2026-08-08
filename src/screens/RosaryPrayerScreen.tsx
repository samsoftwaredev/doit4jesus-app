import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
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

import {
  MysteryCard,
  PrayerCard,
  RosaryBeadNavigator,
  RosaryBottomNavigation,
  RosaryHeader,
  ScriptureCard,
} from "@/components/rosary";
import { rosarySequence } from "@/data/rosarySequence";
import { useRosarySession } from "@/hooks/useRosarySession";
import { theme } from "@/theme/tokens";

function completionDateLabel(date: string | null) {
  const value = date ? new Date(date) : new Date();
  if (Number.isNaN(value.getTime())) return "Today";
  return value.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function RosaryPrayerScreen() {
  const router = useRouter();
  const { width, height, fontScale } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [completionVisible, setCompletionVisible] = useState(false);
  const lastAnnouncement = useRef<string | null>(null);
  const hadCompletion = useRef(false);
  const isTablet = width >= theme.breakpoints.tablet;
  const compact = width < theme.breakpoints.smallPhone || fontScale > 1.25;
  const rosaryColumnWidth = isTablet
    ? Math.min(224, Math.max(176, width * 0.24))
    : Math.min(compact ? 104 : 142, Math.max(compact ? 88 : 108, width * (compact ? 0.28 : 0.3)));
  const imageHeight = isTablet ? 290 : compact ? 132 : Math.min(210, Math.max(158, height * 0.23));
  const contentGap = isTablet ? theme.spacing[6] : theme.spacing[3];
  const session = useRosarySession();

  const progress = {
    currentIndex: session.currentBead ? session.currentBeadIndex + 1 : 0,
    total: rosarySequence.length,
    prayerName: session.currentPrayer?.name ?? "Prayer",
  };

  useEffect(() => {
    if (!session.isHydrated || !session.currentMystery || !session.currentBead || session.isTransitioning) return;
    const announcement = `${session.currentPrayer?.name ?? "Prayer"} ${session.currentBeadIndex + 1} of ${rosarySequence.length}. ${session.currentMystery.title}.`;
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
  ]);

  useEffect(() => {
    if (session.isRosaryCompleted && !hadCompletion.current) {
      hadCompletion.current = true;
      setCompletionVisible(true);
      AccessibilityInfo.announceForAccessibility(
        `Rosary completed. ${session.currentMystery?.title ?? "Current mystery"} is complete.`,
      );
    }
    if (!session.isRosaryCompleted) hadCompletion.current = false;
  }, [session.currentMystery?.title, session.isRosaryCompleted]);

  const restart = () => {
    setCompletionVisible(false);
    session.restartMystery();
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <LinearGradient
        colors={[theme.rosary.colors.canvas, theme.rosary.colors.canvasLight, theme.rosary.colors.canvas]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.background}
      >
        <View
          style={[
            styles.page,
            {
              maxWidth: isTablet ? 1180 : undefined,
              paddingHorizontal: isTablet ? theme.spacing[7] : compact ? theme.spacing[2] : theme.spacing[3],
            },
          ]}
        >
          <RosaryHeader onOpenGarden={() => router.push("/rosary-garden")} />
          <View style={[styles.main, { gap: contentGap }]}>
            <View style={{ width: rosaryColumnWidth }}>
              <RosaryBeadNavigator
                beads={rosarySequence}
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
              accessibilityLabel="Rosary prayer content"
              contentContainerStyle={[styles.contentScrollContent, { gap: contentGap }]}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.contentScroll}
            >
              <MysteryCard imageHeight={imageHeight} mystery={session.currentMystery} />
              <PrayerCard prayer={session.currentPrayer} />
              <ScriptureCard
                quotation={session.currentMystery?.scriptureText}
                reference={session.currentMystery?.scriptureReference}
              />
              {session.storageError ? (
                <Text accessibilityRole="alert" style={styles.storageNote}>
                  Your prayer is continuing, but progress could not be saved on this device.
                </Text>
              ) : null}
            </ScrollView>
          </View>

          <RosaryBottomNavigation
            disabled={session.isTransitioning || rosarySequence.length === 0}
            onAdvance={session.goToNextBead}
            onRestart={session.restartMystery}
            progress={progress}
          />
        </View>
      </LinearGradient>

      <Modal
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={() => setCompletionVisible(false)}
        presentationStyle="overFullScreen"
        transparent
        visible={completionVisible}
      >
        <View style={styles.completionOverlay}>
          <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(220)} style={styles.completionCard}>
            <View style={styles.completionIcon}>
              <Feather accessible={false} color={theme.rosary.colors.goldBright} name="heart" size={theme.sizes.iconLarge} />
            </View>
            <Text accessibilityRole="header" style={styles.completionTitle}>
              Rosary Completed
            </Text>
            <Text style={styles.completionDate}>{completionDateLabel(session.lastPrayedOn)}</Text>
            <Text style={styles.completionCopy}>
              May this time of prayer remain with you in peace.
            </Text>
            <Pressable
              accessibilityLabel="Pray this mystery again"
              accessibilityRole="button"
              onPress={restart}
              style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
            >
              <Text style={styles.primaryActionText}>Pray Again</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Return home"
              accessibilityRole="button"
              onPress={() => {
                setCompletionVisible(false);
                router.replace("/");
              }}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryActionText}>Return Home</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.rosary.colors.canvas,
    flex: 1,
  },
  background: {
    flex: 1,
  },
  page: {
    alignSelf: "center",
    flex: 1,
    minHeight: 0,
    paddingBottom: theme.spacing[2],
    width: "100%",
  },
  main: {
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
  },
  contentScroll: {
    flex: 1,
    minWidth: 0,
  },
  contentScrollContent: {
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
  pressed: {
    opacity: theme.opacity.pressed,
  },
});
