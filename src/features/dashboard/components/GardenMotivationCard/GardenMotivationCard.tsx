import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const lilyArtwork = require("../../../../assets/flowers/whiteLily.png");

const prayerSteps = [
  { icon: "heart" as const, translationKey: "dashboard.dailyRosary.prayStep" as const },
  { icon: "sun" as const, translationKey: "dashboard.dailyRosary.plantStep" as const },
  { icon: "trending-up" as const, translationKey: "dashboard.dailyRosary.growStep" as const },
];

/** Explains how daily Rosary prayer plants a flower and grows a streak. */
export function GardenMotivationCard() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { isLargeText, isTablet } = useResponsiveLayout();
  const displayStepsInRow = isTablet && !isLargeText;

  return (
    <View style={styles.card} testID="garden-motivation-card">
      <LinearGradient accessible={false} colors={theme.colors.gradients.gardenRays} style={styles.rays} />
      <View style={styles.headingRow}>
        <View style={styles.flowerPot}>
          <Image
            accessible={false}
            contentFit="contain"
            source={lilyArtwork}
            style={styles.lily}
            testID="garden-motivation-artwork"
          />
        </View>
        <View style={styles.copy}>
          <Text accessibilityRole="header" style={styles.title}>
            {t("rosary.garden.motivation")}
          </Text>
          <Text style={styles.subtitle}>{t("rosary.garden.motivationCopy")}</Text>
        </View>
      </View>

      <View
        accessibilityLabel={t("dashboard.dailyRosary.purposeLabel")}
        style={[styles.steps, displayStepsInRow ? styles.stepsRow : styles.stepsColumn]}
        testID="garden-purpose-steps"
      >
        {prayerSteps.map((step, index) => (
          <View key={step.translationKey} style={styles.step}>
            <View style={styles.stepIcon}>
              <Feather
                accessible={false}
                color={theme.colors.gold.pale}
                name={step.icon}
                size={theme.sizes.iconSmall}
              />
            </View>
            <Text style={styles.stepText}>{t(step.translationKey)}</Text>
            {index < prayerSteps.length - 1 && displayStepsInRow ? (
              <Feather
                accessible={false}
                color={theme.colors.text.muted}
                name="chevron-right"
                size={theme.sizes.iconSmall}
              />
            ) : null}
          </View>
        ))}
      </View>

      <Text style={styles.resetGuidance}>{t("dashboard.dailyRosary.resetGuidance")}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 0,
    minWidth: theme.spacing[0],
    overflow: "hidden",
    padding: theme.spacing[4],
  },
  rays: { ...StyleSheet.absoluteFill, opacity: theme.opacity.secondary },
  headingRow: { alignItems: "center", flexDirection: "row", zIndex: theme.zIndex.card },
  flowerPot: {
    alignItems: "center",
    backgroundColor: "rgba(9, 31, 42, 0.24)",
    borderRadius: theme.radii.lg,
    height: theme.spacing[16],
    justifyContent: "center",
    width: theme.spacing[14],
  },
  lily: { height: "100%", width: "100%" },
  copy: { flex: 1, minWidth: 0, paddingLeft: theme.spacing[3] },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary },
  subtitle: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  steps: { gap: theme.spacing[2], marginTop: theme.spacing[4], zIndex: theme.zIndex.card },
  stepsColumn: { flexDirection: "column" },
  stepsRow: { flexDirection: "row" },
  step: { alignItems: "center", flex: 1, flexDirection: "row", gap: theme.spacing[2], minWidth: 0 },
  stepIcon: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.13)",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  stepText: { ...theme.typography.bodyMedium, color: theme.colors.text.primary, flexShrink: 1 },
  resetGuidance: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[3],
    zIndex: theme.zIndex.card,
  },
}));
