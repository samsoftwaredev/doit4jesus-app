import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { GlobalRosaryStats } from "@/features/prayer/data/globalRosaryStats.api";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { OrnateCard } from "../OrnateCard";

export interface GlobalRosaryStatsCardProps {
  error: boolean;
  isLoading: boolean;
  onRetry: () => void;
  stats: GlobalRosaryStats | null;
}

/** Presents the global Rosary total and motivates authenticated users with their count and percentage. */
export function GlobalRosaryStatsCard({ error, isLoading, onRetry, stats }: GlobalRosaryStatsCardProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const contribution = stats?.currentUserContribution ?? null;
  const formattedTotal = stats ? new Intl.NumberFormat(locale).format(stats.totalRosariesPrayed) : null;
  const formattedContribution = contribution ? new Intl.NumberFormat(locale).format(contribution.rosariesPrayed) : null;
  const formattedPercentage = contribution
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(contribution.percentage)
    : null;
  const progressPercentage = contribution ? Math.min(100, Math.max(0, contribution.percentage)) : null;
  const progressWidth = `${progressPercentage ?? 0}%` as `${number}%`;

  return (
    <OrnateCard style={styles.card}>
      <View style={styles.titleRow}>
        <Feather accessible={false} color={theme.rosary.colors.goldBright} name="globe" size={theme.sizes.iconMedium} />
        <Text accessibilityRole="header" style={styles.title}>
          {t("prayerHome.globalStats.title")}
        </Text>
      </View>

      {isLoading ? (
        <View accessibilityLabel={t("prayerHome.globalStats.loadingLabel")} style={styles.loadingState}>
          <ActivityIndicator color={theme.rosary.colors.goldBright} />
          <View style={styles.valueSkeleton} />
        </View>
      ) : null}

      {!isLoading && error ? (
        <View style={styles.errorState}>
          <Text accessibilityRole="alert" style={styles.errorText}>
            {t("prayerHome.globalStats.unavailable")}
          </Text>
          <Pressable
            accessibilityLabel={t("prayerHome.globalStats.retryLabel")}
            accessibilityRole="button"
            onPress={onRetry}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          >
            <Text style={styles.retryText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && !error && stats && formattedTotal ? (
        <View style={styles.stats}>
          <Text
            accessibilityLabel={t("prayerHome.globalStats.totalLabel", { count: formattedTotal })}
            style={styles.total}
          >
            {formattedTotal}
          </Text>
          {formattedContribution !== null && formattedPercentage !== null && progressPercentage !== null ? (
            <View style={styles.contributionPanel}>
              <View style={styles.contributionRow}>
                <Feather
                  accessible={false}
                  color={theme.colors.badge.successText}
                  name="heart"
                  size={theme.sizes.iconSmall}
                />
                <Text style={styles.contribution}>
                  {t("prayerHome.globalStats.contribution", { count: formattedContribution })}
                </Text>
              </View>
              <Text style={styles.percentage}>
                {t("prayerHome.globalStats.percentage", { percentage: formattedPercentage })}
              </Text>
              <Text style={styles.percentageCopy}>{t("prayerHome.globalStats.percentageCopy")}</Text>
              <View
                accessible
                accessibilityLabel={t("prayerHome.globalStats.progressLabel", { percentage: formattedPercentage })}
                accessibilityRole="progressbar"
                accessibilityValue={{ max: 100, min: 0, now: progressPercentage }}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <Text style={styles.motivation}>{t("prayerHome.globalStats.motivation")}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </OrnateCard>
  );
}

const styleSheet = createThemedStyles((currentTheme) => ({
  card: {
    backgroundColor: currentTheme.rosary.colors.card,
    minWidth: 0,
    padding: currentTheme.spacing[5],
    width: "100%",
  },
  contribution: {
    ...currentTheme.typography.labelSmall,
    color: currentTheme.colors.badge.successText,
    flexShrink: 1,
    textAlign: "center",
  },
  contributionPanel: {
    alignItems: "center",
    backgroundColor: currentTheme.colors.badge.successBackground,
    borderColor: currentTheme.colors.semantic.successBorder,
    borderRadius: currentTheme.radii.lg,
    borderWidth: currentTheme.borderWidths.thin,
    marginTop: currentTheme.spacing[3],
    padding: currentTheme.spacing[4],
    width: "100%",
  },
  contributionRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: currentTheme.spacing[1],
    justifyContent: "center",
  },
  errorState: {
    alignItems: "center",
    marginTop: currentTheme.spacing[4],
  },
  errorText: {
    ...currentTheme.typography.body,
    color: currentTheme.colors.text.secondary,
    textAlign: "center",
  },
  loadingState: {
    alignItems: "center",
    gap: currentTheme.spacing[3],
    marginTop: currentTheme.spacing[4],
  },
  motivation: {
    ...currentTheme.typography.bodySmall,
    color: currentTheme.colors.text.secondary,
    marginTop: currentTheme.spacing[3],
    textAlign: "center",
  },
  percentage: {
    ...currentTheme.typography.heading2,
    color: currentTheme.colors.badge.successText,
    marginTop: currentTheme.spacing[2],
    textAlign: "center",
  },
  percentageCopy: {
    ...currentTheme.typography.caption,
    color: currentTheme.colors.badge.successText,
    textAlign: "center",
  },
  progressFill: {
    backgroundColor: currentTheme.colors.semantic.success,
    borderRadius: currentTheme.radii.pill,
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
  },
  progressTrack: {
    backgroundColor: currentTheme.colors.border.subtle,
    borderRadius: currentTheme.radii.pill,
    height: 8,
    marginTop: currentTheme.spacing[3],
    overflow: "hidden",
    width: "100%",
  },
  retryButton: {
    justifyContent: "center",
    marginTop: currentTheme.spacing[2],
    minHeight: currentTheme.sizes.touchTarget,
    paddingHorizontal: currentTheme.spacing[4],
  },
  retryButtonPressed: { opacity: currentTheme.opacity.pressed },
  retryText: {
    ...currentTheme.typography.button,
    color: currentTheme.rosary.colors.goldBright,
  },
  stats: {
    alignItems: "center",
    marginTop: currentTheme.spacing[3],
  },
  title: {
    ...currentTheme.typography.heading3,
    color: currentTheme.colors.text.primary,
    flexShrink: 1,
    fontFamily: currentTheme.fontFamilies.display,
    textAlign: "center",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: currentTheme.spacing[2],
    justifyContent: "center",
  },
  total: {
    color: currentTheme.rosary.colors.goldBright,
    fontFamily: currentTheme.fontFamilies.devotional,
    fontSize: 42,
    lineHeight: 50,
    textAlign: "center",
  },
  valueSkeleton: {
    backgroundColor: currentTheme.colors.surface.tertiary,
    borderRadius: currentTheme.radii.xs,
    height: 42,
    width: 112,
  },
}));
