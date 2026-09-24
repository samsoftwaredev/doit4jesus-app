import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui";
import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./LevelsProgression.styles";
import type { LevelsProgressionProps } from "./LevelsProgression.types";

interface LevelBadgeProps {
  label: string;
  level: number;
}

/** Renders LevelBadge with styles resolved from the active appearance. */
function LevelBadge({ label, level }: LevelBadgeProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.levelColumn}>
      <View style={styles.shield}>
        <MaterialCommunityIcons
          color={theme.colors.gold.primary}
          name="shield"
          size={theme.sizes.buttonHeight + theme.spacing[2]}
          style={styles.shieldIcon}
        />
        <Text style={styles.levelNumber}>{level}</Text>
      </View>
      <Text style={styles.levelLabel}>{label}</Text>
    </View>
  );
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function LevelsProgression({
  currentLevel = 12,
  nextLevel = 13,
  checkpointCount = 5,
  completedCheckpoints = 3,
  style,
  testID,
}: LevelsProgressionProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const safeCheckpointCount = Math.max(2, Math.floor(checkpointCount));
  const safeCompletedCheckpoints = Math.min(Math.max(0, Math.floor(completedCheckpoints)), safeCheckpointCount);
  const completedTrackWidth = `${Math.max(
    0,
    ((safeCompletedCheckpoints - 1) / (safeCheckpointCount - 1)) * 100,
  )}%` as `${number}%`;
  const checkpoints = Array.from({ length: safeCheckpointCount }, (_, index) => index < safeCompletedCheckpoints);
  const progressSummary = t("formation.levels.summary", {
    completed: safeCompletedCheckpoints,
    total: safeCheckpointCount,
  });

  return (
    <Card
      accessibilityLabel={t("formation.levels.label", {
        current: currentLevel,
        next: nextLevel,
        summary: progressSummary,
      })}
      fullWidth
      padding="lg"
      style={style}
      testID={testID}
      variant="elevated"
    >
      <View style={styles.titleRow}>
        <MaterialCommunityIcons color={theme.colors.gold.pale} name="flag-variant" size={theme.sizes.iconSmall} />
        <Text accessibilityRole="header" style={styles.title}>
          {t("formation.levels.title")}
        </Text>
      </View>

      <View style={styles.progression}>
        <LevelBadge label={t("formation.levels.current")} level={currentLevel} />

        <View style={styles.progressArea}>
          <View style={styles.guardianMarker}>
            <View style={styles.guardianAvatar}>
              <Image
                accessible={false}
                contentFit="cover"
                source={require("../../../assets/images/avatar/knight.png")}
                style={styles.guardianImage}
              />
            </View>
            <View style={styles.guardianIdentity}>
              <MaterialCommunityIcons color={theme.colors.gold.pale} name="shield-outline" size={theme.sizes.iconXs} />
              <Text style={styles.guardianLabel}>{t("formation.levels.guardian")}</Text>
            </View>
          </View>

          <View
            accessibilityLabel={progressSummary}
            accessibilityRole="progressbar"
            accessibilityValue={{
              max: safeCheckpointCount,
              min: 0,
              now: safeCompletedCheckpoints,
            }}
            style={styles.progressPath}
          >
            <View pointerEvents="none" style={styles.track} />
            <View pointerEvents="none" style={[styles.completedTrack, { width: completedTrackWidth }]} />
            <View style={styles.checkpointRow}>
              {checkpoints.map((isCompleted, index) => (
                <View
                  key={index}
                  accessibilityLabel={
                    isCompleted ? t("formation.levels.completedCheckpoint") : t("formation.levels.upcomingCheckpoint")
                  }
                  style={[styles.checkpoint, isCompleted && styles.checkpointCompleted]}
                >
                  <MaterialCommunityIcons
                    color={isCompleted ? theme.colors.text.white : theme.colors.gold.pale}
                    name={isCompleted ? "check" : "circle-small"}
                    size={theme.sizes.iconXs}
                  />
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.pathSummary}>{progressSummary}</Text>
        </View>

        <LevelBadge label={t("formation.levels.next")} level={nextLevel} />
      </View>
    </Card>
  );
}
