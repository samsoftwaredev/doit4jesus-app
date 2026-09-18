import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { saintAvatars } from "@/features/profile/saints";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { LeaderboardEntryViewModel } from "../dashboard.types";
import { formatPoints } from "../rosary-reminder";

type LeaderboardCardProps = {
  entries: LeaderboardEntryViewModel[] | null;
  error: boolean;
  isLoading: boolean;
  onRetry: () => void;
};

function rankColor(rank: number) {
  if (rank === 1) return theme.colors.gold.pale;
  if (rank === 2) return "#D1D8DF";
  if (rank === 3) return "#C98B57";
  return theme.colors.text.secondary;
}

function medal(rank: number): string | null {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

/** Presents the weekly global Rosary leaders without linking into the friends-only leaderboard. */
export function LeaderboardCard({ entries, error, isLoading, onRetry }: LeaderboardCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <LinearGradient
      colors={theme.colors.gradients.leaderboard}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather accessible={false} color={theme.colors.gold.pale} name="award" size={theme.sizes.iconMedium} />
          <Text accessibilityRole="header" style={styles.title}>
            {t("dashboard.leaderboard.heading")}
          </Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{t("dashboard.leaderboard.subtitle")}</Text>
      {isLoading ? <LeaderboardSkeleton /> : null}
      {!isLoading && error ? (
        <View accessibilityRole="alert" style={styles.unavailable}>
          <Text style={styles.unavailableText}>{t("dashboard.leaderboard.unavailable")}</Text>
          <Pressable
            accessibilityLabel={t("dashboard.leaderboard.retryLabel")}
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.retry}
          >
            <Text style={styles.retryText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      ) : null}
      {!isLoading && !error && entries ? <LeaderboardRows entries={entries.slice(0, 5)} /> : null}
    </LinearGradient>
  );
}

/** Renders LeaderboardRows with styles resolved from the active appearance. */
function LeaderboardRows({ entries }: { entries: LeaderboardEntryViewModel[] }) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  return (
    <View>
      <View style={[styles.row, styles.columnLabels]}>
        <Text style={[styles.columnLabel, styles.rankColumn]}>{t("dashboard.leaderboard.rank")}</Text>
        <Text style={[styles.columnLabel, styles.warriorColumn]}>{t("dashboard.leaderboard.warrior")}</Text>
        <Text style={[styles.columnLabel, styles.rosariesColumn]}>{t("dashboard.leaderboard.rosaries")}</Text>
      </View>
      {entries.map((entry) => {
        const rankMedal = medal(entry.rank);
        return (
          <View
            accessibilityLabel={t("dashboard.leaderboard.rowLabel", {
              count: entry.rosaries,
              name: entry.displayName,
              rank: entry.rank,
            })}
            key={`${entry.rank}-${entry.displayName}`}
            style={[styles.row, styles.entry, entry.rank === 1 && styles.firstPlace]}
          >
            <View style={styles.rankColumn}>
              {rankMedal ? (
                <Text accessible={false} style={styles.medal}>
                  {rankMedal}
                </Text>
              ) : null}
              <Text style={[styles.rank, { color: rankColor(entry.rank) }]}>{entry.rank}</Text>
            </View>
            <View style={styles.warriorColumn}>
              <Image
                accessibilityLabel={t("dashboard.leaderboard.avatarLabel", { name: entry.displayName })}
                contentFit="cover"
                source={entry.avatarUrl ?? saintAvatars[8].image}
                style={styles.avatar}
              />
              <Text numberOfLines={1} style={styles.name}>
                {entry.displayName}
              </Text>
            </View>
            <Text style={styles.rosariesColumn}>{formatPoints(entry.rosaries, locale)}</Text>
          </View>
        );
      })}
    </View>
  );
}

/** Renders LeaderboardSkeleton with styles resolved from the active appearance. */
function LeaderboardSkeleton() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("dashboard.leaderboard.loading")} style={styles.skeletons}>
      {Array.from({ length: 5 }, (_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <View style={styles.skeletonRank} />
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonName} />
          <View style={styles.skeletonScore} />
        </View>
      ))}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  avatar: { borderRadius: theme.radii.pill, height: 32, width: 32 },
  card: {
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
    padding: theme.spacing[4],
  },
  columnLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.subtle,
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wide,
  },
  columnLabels: { paddingBottom: theme.spacing[2], paddingTop: theme.spacing[3] },
  entry: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    minHeight: 56,
    paddingVertical: theme.spacing[2],
  },
  firstPlace: {
    backgroundColor: "rgba(230, 186, 100, 0.1)",
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing[1],
  },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  medal: { fontSize: 14 },
  name: { ...theme.typography.bodyMedium, color: theme.colors.text.primary, flex: 1, marginLeft: theme.spacing[2] },
  rank: { ...theme.typography.bodyMedium, fontFamily: theme.fontFamilies.devotional },
  rankColumn: { alignItems: "center", flexDirection: "row", gap: theme.spacing[1], width: "20%" },
  retry: { alignSelf: "flex-start", justifyContent: "center", minHeight: theme.sizes.touchTarget },
  retryText: { ...theme.typography.button, color: theme.colors.gold.pale },
  rosariesColumn: { ...theme.typography.bodyMedium, color: theme.colors.gold.pale, textAlign: "right", width: "25%" },
  row: { alignItems: "center", flexDirection: "row" },
  skeletonAvatar: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.pill,
    height: 32,
    marginRight: theme.spacing[2],
    width: 32,
  },
  skeletonName: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    flex: 1,
    height: theme.spacing[3],
  },
  skeletonRank: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[3],
    marginRight: theme.spacing[2],
    width: 26,
  },
  skeletonRow: { alignItems: "center", flexDirection: "row", minHeight: 56 },
  skeletonScore: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[3],
    marginLeft: theme.spacing[3],
    width: 38,
  },
  skeletons: { marginTop: theme.spacing[2] },
  subtitle: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    letterSpacing: theme.letterSpacing.wide,
    marginTop: theme.spacing[1],
  },
  title: { ...theme.typography.heading3, color: theme.colors.gold.pale, fontFamily: theme.fontFamilies.devotional },
  titleRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  unavailable: { paddingVertical: theme.spacing[4] },
  unavailableText: { ...theme.typography.body, color: theme.colors.text.secondary },
  warriorColumn: { alignItems: "center", flex: 1, flexDirection: "row", minWidth: 0 },
}));
