import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import type { FriendsLeaderboardEntry } from "../friends.types";
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

export function formatPoints(points: number): string {
  return new Intl.NumberFormat("en-US").format(points);
}

export function LeaderboardEntries({ entries, onPressFriend, showHeader = true }: LeaderboardEntriesProps) {
  return (
    <View>
      {showHeader ? (
        <View style={[styles.row, styles.columnLabels]}>
          <Text style={[styles.columnLabel, styles.position]}>POSITION</Text>
          <Text style={[styles.columnLabel, styles.user]}>USER</Text>
          <Text style={[styles.columnLabel, styles.points]}>POINTS</Text>
        </View>
      ) : null}
      {entries.map((entry) => {
        const medal = medalForRank(entry.rank);
        const rowLabel = `Rank ${entry.rank}. ${entry.friend.displayName}. ${formatPoints(entry.points)} points${entry.isCurrentUser ? ". You" : ""}.`;
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
                accessibilityLabel={`${entry.friend.displayName}'s profile image`}
                name={entry.friend.displayName}
                size="sm"
                source={entry.friend.avatarUrl}
              />
              <View style={styles.nameCopy}>
                <Text numberOfLines={1} style={styles.name}>
                  {entry.friend.displayName}
                  {entry.isCurrentUser ? " (You)" : ""}
                </Text>
                {entry.friend.title ? <Text numberOfLines={1} style={styles.title}>{entry.friend.title}</Text> : null}
              </View>
            </View>
            <Text accessibilityLabel={`${formatPoints(entry.points)} points`} style={styles.points}>{formatPoints(entry.points)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
