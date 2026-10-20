import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AvatarWithCountryBadge } from "@/components/identity";
import { getProfileAvatarSource } from "@/features/profile/saints";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { GlobalRosaryLeaderboard, LeaderboardEntryViewModel } from "../dashboard.types";
import { formatPoints } from "../rosary-reminder";

type LeaderboardCardProps = {
  isLifetimeLoading: boolean;
  isWeeklyLoading: boolean;
  lifetimeError: boolean;
  lifetimeLeaderboard: GlobalRosaryLeaderboard | null;
  onRetryLifetime: () => void;
  onRetryWeekly: () => void;
  weeklyError: boolean;
  weeklyLeaderboard: GlobalRosaryLeaderboard | null;
};

type BoardStatusProps = {
  emptyMessage: string;
  error: boolean;
  isLoading: boolean;
  leaderboard: GlobalRosaryLeaderboard | null;
  loadingLabel: string;
  onRetry: () => void;
  retryLabel: string;
  unavailableMessage: string;
  variant: "weekly" | "lifetime";
};

const podiumRankOrder = [2, 1, 3] as const;

/** Returns the semantic medal color associated with a leaderboard rank. */
function rankColor(rank: number) {
  if (rank === 1) return theme.colors.gold.pale;
  if (rank === 2) return "#D1D8DF";
  if (rank === 3) return "#C98B57";
  return theme.colors.text.secondary;
}

/** Returns the medal glyph for a podium rank, or no glyph for later ranks. */
function medal(rank: number): string | null {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

/** Returns the avatar dimension that establishes first, second, and third visual emphasis. */
function podiumAvatarSize(rank: number): number {
  if (rank === 1) return 88;
  if (rank === 2) return 74;
  return 62;
}

/** Orders entries by their server-provided rank without deriving replacement ranks. */
function orderByServerRank(entries: LeaderboardEntryViewModel[]): LeaderboardEntryViewModel[] {
  return [...entries].sort((first, second) => first.rank - second.rank);
}

/** Presents weekly and lifetime global Rosary leaders with independent status and current-rank states. */
export function LeaderboardCard({
  isLifetimeLoading,
  isWeeklyLoading,
  lifetimeError,
  lifetimeLeaderboard,
  onRetryLifetime,
  onRetryWeekly,
  weeklyError,
  weeklyLeaderboard,
}: LeaderboardCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);

  return (
    <LinearGradient
      colors={theme.colors.gradients.leaderboard}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.titleRow}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="award" size={theme.sizes.iconMedium} />
        <Text accessibilityRole="header" style={styles.title}>
          {t("dashboard.leaderboard.heading")}
        </Text>
      </View>
      <Text style={styles.subtitle}>{t("dashboard.leaderboard.subtitle")}</Text>

      <View style={styles.boardSection}>
        <Text accessibilityRole="header" style={styles.boardTitle}>
          {t("dashboard.leaderboard.weeklyTitle")}
        </Text>
        <BoardStatus
          emptyMessage={t("dashboard.leaderboard.weeklyEmpty")}
          error={weeklyError}
          isLoading={isWeeklyLoading}
          leaderboard={weeklyLeaderboard}
          loadingLabel={t("dashboard.leaderboard.weeklyLoading")}
          onRetry={onRetryWeekly}
          retryLabel={t("dashboard.leaderboard.weeklyRetryLabel")}
          unavailableMessage={t("dashboard.leaderboard.weeklyUnavailable")}
          variant="weekly"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.boardSection}>
        <Text accessibilityRole="header" style={styles.boardTitle}>
          {t("dashboard.leaderboard.lifetimeTitle")}
        </Text>
        <BoardStatus
          emptyMessage={t("dashboard.leaderboard.lifetimeEmpty")}
          error={lifetimeError}
          isLoading={isLifetimeLoading}
          leaderboard={lifetimeLeaderboard}
          loadingLabel={t("dashboard.leaderboard.lifetimeLoading")}
          onRetry={onRetryLifetime}
          retryLabel={t("dashboard.leaderboard.lifetimeRetryLabel")}
          unavailableMessage={t("dashboard.leaderboard.lifetimeUnavailable")}
          variant="lifetime"
        />
      </View>
    </LinearGradient>
  );
}

/** Chooses the loading, failure, empty, or populated presentation for one board. */
function BoardStatus({
  emptyMessage,
  error,
  isLoading,
  leaderboard,
  loadingLabel,
  onRetry,
  retryLabel,
  unavailableMessage,
  variant,
}: BoardStatusProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const entries = leaderboard?.entries ?? null;

  if (isLoading) {
    return <LeaderboardSkeleton count={variant === "weekly" ? 3 : 5} label={loadingLabel} variant={variant} />;
  }

  if (error) {
    return (
      <View accessibilityRole="alert" style={styles.unavailable}>
        <Text style={styles.unavailableText}>{unavailableMessage}</Text>
        <Pressable accessibilityLabel={retryLabel} accessibilityRole="button" onPress={onRetry} style={styles.retry}>
          <Text style={styles.retryText}>{t("common.retry")}</Text>
        </Pressable>
      </View>
    );
  }

  if (!entries?.length) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <>
      {variant === "weekly" ? <WeeklyPodium entries={entries} /> : <LifetimeLeaderboardRows entries={entries} />}
      {leaderboard ? <PinnedCurrentUser leaderboard={leaderboard} /> : null}
    </>
  );
}

/** Displays available podium placements with country-badged avatars in second-first-third visual order. */
function WeeklyPodium({ entries }: { entries: LeaderboardEntryViewModel[] }) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const podiumEntries = podiumRankOrder.flatMap((rank) => {
    const entry = entries.find((candidate) => candidate.rank === rank);
    return entry ? [entry] : [];
  });

  return (
    <ScrollView
      accessibilityLabel={t("dashboard.leaderboard.weeklyScrollLabel")}
      contentContainerStyle={styles.podiumContent}
      horizontal
      showsHorizontalScrollIndicator
      style={styles.podiumScroll}
      testID="weekly-podium-scroll"
    >
      {podiumEntries.map((entry) => {
        const avatarSize = podiumAvatarSize(entry.rank);
        return (
          <View
            accessibilityLabel={`${t("dashboard.leaderboard.rowLabel", {
              count: entry.rosaries,
              name: entry.displayName,
              rank: entry.rank,
            })}${entry.isCurrentUser ? t("dashboard.leaderboard.currentUserSuffix") : ""}`}
            key={`${entry.rank}-${entry.displayName}`}
            style={[
              styles.podiumEntry,
              entry.rank === 1 && styles.podiumFirst,
              entry.rank === 2 && styles.podiumSecond,
            ]}
            testID={`weekly-podium-entry-${entry.rank}`}
          >
            <Text accessible={false} style={styles.podiumMedal}>
              {medal(entry.rank)}
            </Text>
            <AvatarWithCountryBadge
              accessibilityLabel={t("dashboard.leaderboard.avatarLabel", { name: entry.displayName })}
              borderColor={theme.colors.gold.strong}
              borderWidth={theme.borderWidths.thin}
              countryCode={entry.countryCode}
              name={entry.displayName}
              size={avatarSize}
              source={getProfileAvatarSource(entry.saintAvatarId, entry.avatarUrl)}
            />
            <Text style={[styles.podiumRank, { color: rankColor(entry.rank) }]}>#{entry.rank}</Text>
            <Text style={styles.podiumName}>{entry.displayName}</Text>
            <Text style={styles.podiumRosaries}>
              {t("dashboard.leaderboard.rosaryCount", { count: formatPoints(entry.rosaries, locale) })}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

/** Renders lifetime leaders with country-badged avatars in ascending server-provided rank order. */
function LifetimeLeaderboardRows({ entries }: { entries: LeaderboardEntryViewModel[] }) {
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
      {orderByServerRank(entries)
        .slice(0, 10)
        .map((entry) => {
          const rankMedal = medal(entry.rank);
          return (
            <View
              accessibilityLabel={`${t("dashboard.leaderboard.rowLabel", {
                count: formatPoints(entry.rosaries, locale),
                name: entry.displayName,
                rank: entry.rank,
              })}${entry.isCurrentUser ? t("dashboard.leaderboard.currentUserSuffix") : ""}`}
              key={`${entry.rank}-${entry.displayName}`}
              style={[
                styles.row,
                styles.entry,
                entry.rank === 1 && styles.firstPlace,
                entry.isCurrentUser && styles.currentUserEntry,
              ]}
              testID={`lifetime-leaderboard-entry-${entry.rank}`}
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
                <AvatarWithCountryBadge
                  accessibilityLabel={t("dashboard.leaderboard.avatarLabel", { name: entry.displayName })}
                  borderWidth={0}
                  countryCode={entry.countryCode}
                  name={entry.displayName}
                  size={32}
                  source={getProfileAvatarSource(entry.saintAvatarId, entry.avatarUrl)}
                />
                <Text style={styles.name}>{entry.displayName}</Text>
              </View>
              <Text style={styles.rosariesColumn}>{formatPoints(entry.rosaries, locale)}</Text>
            </View>
          );
        })}
    </View>
  );
}

/** Shows the authenticated user's authoritative rank when it falls outside the compact leaders list. */
function PinnedCurrentUser({ leaderboard }: { leaderboard: GlobalRosaryLeaderboard }) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const entry = leaderboard.currentUserEntry;
  if (!entry || leaderboard.entries.some((candidate) => candidate.userId === entry.userId)) return null;
  const formattedRosaries = formatPoints(entry.rosaries, locale);

  return (
    <View style={styles.currentUserSection}>
      <Text accessibilityRole="header" style={styles.currentUserTitle}>
        {t("dashboard.leaderboard.yourRank")}
      </Text>
      <View
        accessibilityLabel={t("dashboard.leaderboard.pinnedRowLabel", {
          count: formattedRosaries,
          name: entry.displayName,
          rank: entry.rank,
        })}
        style={[styles.row, styles.entry, styles.currentUserEntry]}
      >
        <View style={styles.rankColumn}>
          <Text style={[styles.rank, { color: rankColor(entry.rank) }]}>{entry.rank}</Text>
        </View>
        <View style={styles.warriorColumn}>
          <AvatarWithCountryBadge
            accessibilityLabel={t("dashboard.leaderboard.avatarLabel", { name: entry.displayName })}
            borderColor={theme.colors.gold.strong}
            borderWidth={theme.borderWidths.thin}
            countryCode={entry.countryCode}
            name={entry.displayName}
            size={32}
            source={getProfileAvatarSource(entry.saintAvatarId, entry.avatarUrl)}
          />
          <Text style={styles.name}>{entry.displayName}</Text>
        </View>
        <Text style={styles.rosariesColumn}>{formattedRosaries}</Text>
      </View>
    </View>
  );
}

/** Renders a compact placeholder matching the selected board layout while data loads. */
function LeaderboardSkeleton({
  count,
  label,
  variant,
}: {
  count: number;
  label: string;
  variant: "weekly" | "lifetime";
}) {
  const styles = useThemedStyles(styleSheet);

  if (variant === "weekly") {
    return (
      <View accessibilityLabel={label} style={styles.podiumSkeletons}>
        {Array.from({ length: count }, (_, index) => (
          <View key={index} style={styles.podiumSkeletonEntry}>
            <View style={styles.podiumSkeletonAvatar} />
            <View style={styles.podiumSkeletonName} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View accessibilityLabel={label} style={styles.skeletons}>
      {Array.from({ length: count }, (_, index) => (
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
  boardSection: { gap: theme.spacing[2] },
  boardTitle: {
    ...theme.typography.heading3,
    color: theme.colors.gold.pale,
    fontFamily: theme.fontFamilies.devotional,
  },
  card: {
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[3],
    overflow: "hidden",
    padding: theme.spacing[4],
  },
  columnLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.subtle,
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wide,
  },
  columnLabels: { paddingBottom: theme.spacing[2] },
  currentUserEntry: {
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.colors.semantic.successBorder,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.thin,
    paddingHorizontal: theme.spacing[2],
  },
  currentUserSection: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    gap: theme.spacing[1],
    marginTop: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },
  currentUserTitle: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.success,
  },
  divider: { backgroundColor: theme.colors.border.subtle, height: theme.borderWidths.hairline },
  emptyText: { ...theme.typography.body, color: theme.colors.text.secondary, paddingVertical: theme.spacing[3] },
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
  medal: { fontSize: 14 },
  name: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    flex: 1,
    marginLeft: theme.spacing[2],
    minWidth: 0,
  },
  podiumContent: {
    alignItems: "flex-end",
    flexGrow: 1,
    gap: theme.spacing[2],
    justifyContent: "center",
    minWidth: 400,
    paddingHorizontal: theme.spacing[1],
    paddingVertical: theme.spacing[2],
  },
  podiumEntry: { alignItems: "center", gap: theme.spacing[1], width: 112 },
  podiumFirst: { width: 136 },
  podiumMedal: { fontSize: 22 },
  podiumName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  podiumRank: { ...theme.typography.heading3, fontFamily: theme.fontFamilies.devotional },
  podiumRosaries: { ...theme.typography.labelSmall, color: theme.colors.text.secondary, textAlign: "center" },
  podiumSecond: { width: 124 },
  podiumScroll: { marginHorizontal: -theme.spacing[4] },
  podiumSkeletonAvatar: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.pill,
    height: 62,
    width: 62,
  },
  podiumSkeletonEntry: { alignItems: "center", gap: theme.spacing[2], width: 112 },
  podiumSkeletonName: {
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.xs,
    height: theme.spacing[3],
    width: 82,
  },
  podiumSkeletons: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "center",
    minHeight: 120,
  },
  rank: { ...theme.typography.bodyMedium, fontFamily: theme.fontFamilies.devotional },
  rankColumn: { alignItems: "center", flexDirection: "row", gap: theme.spacing[1], width: "20%" },
  retry: { alignSelf: "flex-start", justifyContent: "center", minHeight: theme.sizes.touchTarget },
  retryText: { ...theme.typography.button, color: theme.colors.gold.pale },
  rosariesColumn: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gold.pale,
    textAlign: "right",
    width: "25%",
  },
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
  skeletons: { marginTop: theme.spacing[1] },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  title: { ...theme.typography.heading3, color: theme.colors.gold.pale, fontFamily: theme.fontFamilies.devotional },
  titleRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  unavailable: { paddingVertical: theme.spacing[3] },
  unavailableText: { ...theme.typography.body, color: theme.colors.text.secondary },
  warriorColumn: { alignItems: "center", flex: 1, flexDirection: "row", minWidth: 0 },
}));
