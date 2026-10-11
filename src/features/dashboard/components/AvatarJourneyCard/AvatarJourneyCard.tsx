import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import type { Gender } from "@/features/profile";
import type { DashboardProgress } from "@/features/progress";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

const MIN_LEVEL_NUMBER = 1;
const MAX_LEVEL_NUMBER = 10;
const AVATAR_START_LEFT_PERCENTAGE = 4;
const AVATAR_TRAVEL_PERCENTAGE = 70;

const walkingBackgrounds = [
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-01.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-02.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-03.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-04.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-05.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-06.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-07.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-08.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-09.png"),
  require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-10.png"),
] as const;

const avatarArtwork = {
  knight: [
    require("../../../../../assets/images/avatar/knightProgress/level-01-sick-peasant.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-02-enduring-peasant.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-03-hopeful-servant.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-04-emerging-adventurer.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-05-trainee-warrior.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-06-armed-defender.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-07-knighted-knight.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-08-knight-with-horse.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-09-royal-champion.png"),
    require("../../../../../assets/images/avatar/knightProgress/level-10-warrior-knight-king.png"),
  ],
  princess: [
    require("../../../../../assets/images/avatar/princessProgress/level-01-sick-peasant.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-02-enduring-peasant.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-03-hopeful-servant.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-04-emerging-adventurer.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-05-trainee-warrior.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-06-armed-defender.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-07-knighted-princess.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-08-princess-with-horse.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-09-royal-champion.png"),
    require("../../../../../assets/images/avatar/princessProgress/level-10-warrior-princess-queen.png"),
  ],
} as const;

export type AvatarJourneyCardProps = {
  gender: Gender | null;
  isLoading: boolean;
  progress: DashboardProgress | null;
};

/** Keeps a level number within the ten supplied journey scenes. */
function clampLevelNumber(levelNumber: number | null | undefined): number {
  if (levelNumber === null || levelNumber === undefined || !Number.isFinite(levelNumber)) return MIN_LEVEL_NUMBER;
  return Math.min(Math.max(Math.round(levelNumber), MIN_LEVEL_NUMBER), MAX_LEVEL_NUMBER);
}

/** Converts a backend percentage into a valid visual and accessible progress value. */
function clampPercentage(percentage: number | null | undefined): number {
  if (percentage === null || percentage === undefined || !Number.isFinite(percentage)) return 0;
  return Math.min(Math.max(Math.round(percentage), 0), 100);
}

/** Places the avatar's left edge so its centre travels safely across the landscape. */
function getAvatarLeftPercentage(percentage: number): `${number}%` {
  return `${(AVATAR_START_LEFT_PERCENTAGE + (percentage / 100) * AVATAR_TRAVEL_PERCENTAGE).toFixed(1)}%` as `${number}%`;
}

/** Selects knight artwork by default, reserving princess artwork for saved female profiles. */
function getAvatarVariant(gender: Gender | null): keyof typeof avatarArtwork {
  return gender === "female" ? "princess" : "knight";
}

/**
 * Shows a user's level as a character walking through its matching journey scene.
 *
 * @param props - Profile gender and the dashboard's already-loaded level progress state.
 * @returns A localized, non-interactive progress visualization or its loading state.
 */
export function AvatarJourneyCard({ gender, isLoading, progress }: AvatarJourneyCardProps) {
  const { t } = useTranslation();
  const { isLargeText, isTablet } = useResponsiveLayout();
  const styles = useThemedStyles(styleSheet);
  const levelNumber = clampLevelNumber(progress?.currentLevel?.levelNumber);
  const percentage = levelNumber === MAX_LEVEL_NUMBER ? 100 : clampPercentage(progress?.levelProgressPercentage);
  const avatarVariant = getAvatarVariant(gender);
  const assetIndex = levelNumber - 1;
  const usesWideScene = isTablet && !isLargeText;

  return (
    <View style={styles.container} testID="avatar-journey-card">
      {isLoading ? (
        <View accessibilityLabel={t("dashboard.avatarJourney.loading")} style={styles.loadingScene} />
      ) : (
        <View
          accessible
          accessibilityLabel={t("dashboard.avatarJourney.progressLabel", { level: levelNumber, percent: percentage })}
          accessibilityRole="progressbar"
          accessibilityValue={{ max: 100, min: 0, now: percentage }}
          style={[styles.scene, usesWideScene && styles.sceneWide]}
        >
          <Image
            accessible={false}
            contentFit="cover"
            pointerEvents="none"
            source={walkingBackgrounds[assetIndex]}
            style={styles.background}
            testID="avatar-journey-background"
          />
          <Image
            accessible={false}
            contentFit="contain"
            pointerEvents="none"
            source={avatarArtwork[avatarVariant][assetIndex]}
            style={[styles.character, { left: getAvatarLeftPercentage(percentage) }]}
            testID="avatar-journey-character"
          />
        </View>
      )}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  background: {
    bottom: theme.spacing[0],
    height: "100%",
    left: theme.spacing[0],
    position: "absolute",
    right: theme.spacing[0],
    top: theme.spacing[0],
    width: "100%",
  },
  character: {
    aspectRatio: 2 / 3,
    bottom: theme.spacing[0],
    height: "100%",
    position: "absolute",
    width: "22%",
  },
  container: { minWidth: theme.spacing[0] },
  loadingScene: {
    aspectRatio: 3,
    backgroundColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    minHeight: theme.spacing[24],
  },
  scene: {
    aspectRatio: 3,
    borderRadius: theme.radii.lg,
    minHeight: theme.spacing[24],
    overflow: "hidden",
  },
  sceneWide: {
    maxHeight: theme.spacing[24] * 2,
  },
}));
