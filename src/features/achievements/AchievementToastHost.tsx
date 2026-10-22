import { useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AchievementAlert, Confetti } from "@/components/ui";
import { resolveBadgeArtwork } from "@/features/progress/badge-assets";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { useAchievement } from "./AchievementProvider";

const ACHIEVEMENT_TOAST_DURATION_MS = 5_000;

/** Displays queued achievements above every route and clears each toast after its celebration window. */
export function AchievementToastHost() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { gutter } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const { achievement, achievementSequence, dismissAchievement } = useAchievement();

  const message =
    achievement?.type === "badge-award"
      ? t("achievements.badgeAward", { name: achievement.badge.name })
      : achievement?.type === "daily-scripture-complete"
        ? t("achievements.dailyScriptureComplete")
        : achievement?.type === "rosary-video-complete"
          ? t("achievements.rosaryVideoComplete")
          : t("achievements.onboardingComplete");
  const badgeArtwork =
    achievement?.type === "badge-award" ? resolveBadgeArtwork(achievement.badge.code, achievement.badge.iconUrl) : null;

  useEffect(() => {
    if (!achievement) return;

    const timeoutId = setTimeout(dismissAchievement, ACHIEVEMENT_TOAST_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, [achievement, dismissAchievement]);

  if (!achievement) return null;

  return (
    <View pointerEvents="box-none" style={styles.host} testID="achievement-toast-host">
      <Confetti
        key={achievementSequence}
        style={styles.confetti}
        testID="achievement-confetti"
        trigger={achievementSequence ?? 0}
      />
      <View
        style={[styles.content, { paddingHorizontal: gutter, paddingTop: insets.top + theme.spacing[2] }]}
        testID="achievement-toast-content"
      >
        <AchievementAlert badgeArtwork={badgeArtwork} message={message} onDismiss={dismissAchievement} />
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  confetti: { zIndex: 0 },
  content: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    width: "100%",
    zIndex: 1,
  },
  host: {
    bottom: 0,
    left: 0,
    pointerEvents: "box-none",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: theme.zIndex.toast,
  },
}));
