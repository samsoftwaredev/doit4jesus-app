import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { getProfileAvatarSource } from "@/features/profile/saints";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import type { FriendsLeaderboardEntry } from "../friends.types";
import { useAppLanguage } from "@/localization";
import { FriendAvatar } from "./FriendAvatar";

type LeaderboardEntriesProps = {
  entries: FriendsLeaderboardEntry[];
  onPressFriend?: (friendId: string) => void;
  showHeader?: boolean;
};

function medalForRank(rank: number): string | undefined {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return undefined;
}

export function formatPoints(points: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(points);
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function LeaderboardEntries({ entries, onPressFriend, showHeader = true }: LeaderboardEntriesProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  return (
    <View>
      {showHeader ? (
        <View style={[styles.row, styles.columnLabels]}>
          <Text style={[styles.columnLabel, styles.position]}>{t("friends.table.position")}</Text>
          <Text style={[styles.columnLabel, styles.user]}>{t("friends.table.user")}</Text>
          <Text style={[styles.columnLabel, styles.points]}>{t("friends.table.points")}</Text>
        </View>
      ) : null}
      {entries.map((entry) => {
        const medal = medalForRank(entry.rank);
        const formattedPoints = formatPoints(entry.points, locale);
        const rowLabel = t("friends.table.rankLabel", {
          currentUser: entry.isCurrentUser ? `. ${t("friends.table.currentUser")}` : "",
          name: entry.friend.displayName,
          points: formattedPoints,
          rank: entry.rank,
        });
        return (
          <Pressable
            accessibilityLabel={rowLabel}
            accessibilityRole={onPressFriend ? "button" : "text"}
            disabled={!onPressFriend || entry.isCurrentUser}
            key={entry.friend.id}
            onPress={() => onPressFriend?.(entry.friend.id)}
            style={({ pressed }) => [
              styles.row,
              styles.entry,
              entry.rank === 1 && styles.firstPlace,
              entry.isCurrentUser && styles.currentUser,
              pressed && !entry.isCurrentUser && styles.pressed,
            ]}
          >
            <View style={styles.position}>
              {medal ? <Text style={styles.medal}>{medal}</Text> : null}
              <Text style={styles.rank}>{entry.rank}</Text>
            </View>
            <View style={styles.user}>
              <FriendAvatar
                accessibilityLabel={t("friends.avatarLabel", { name: entry.friend.displayName })}
                countryCode={entry.friend.countryCode}
                name={entry.friend.displayName}
                size="sm"
                source={getProfileAvatarSource(entry.friend.saintAvatarId, entry.friend.avatarUrl)}
              />
              <View style={styles.nameCopy}>
                <Text numberOfLines={1} style={styles.name}>
                  {entry.friend.displayName}
                  {entry.isCurrentUser ? ` (${t("friends.table.currentUser")})` : ""}
                </Text>
                {entry.friend.title ? (
                  <Text numberOfLines={1} style={styles.title}>
                    {entry.friend.title}
                  </Text>
                ) : null}
              </View>
            </View>
            <Text
              accessibilityLabel={t("friends.table.pointsLabel", {
                count: entry.points,
                formattedCount: formattedPoints,
              })}
              style={styles.points}
            >
              {formattedPoints}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  columnLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.subtle,
  },
  columnLabels: {
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },
  currentUser: {
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.colors.semantic.successBorder,
  },
  entry: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    borderRadius: theme.radii.sm,
    borderTopColor: theme.colors.transparent,
    borderTopWidth: theme.borderWidths.thin,
    minHeight: theme.sizes.touchTarget + theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[2],
  },
  firstPlace: {
    backgroundColor: theme.colors.badge.warningBackground,
    borderColor: theme.colors.gold.primary,
    minHeight: theme.sizes.touchTarget + theme.spacing[5],
  },
  medal: {
    fontSize: theme.fontSizes.lg,
    lineHeight: theme.lineHeights.lg,
  },
  name: {
    ...theme.typography.bodyMedium,
  },
  nameCopy: {
    flex: 1,
    marginLeft: theme.spacing[2],
    minWidth: theme.spacing[0],
  },
  points: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.warning,
    textAlign: "right",
    width: "20%",
  },
  position: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    width: "24%",
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  rank: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  user: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    minWidth: theme.spacing[0],
  },
}));
