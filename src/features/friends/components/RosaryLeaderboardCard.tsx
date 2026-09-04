import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";

import { Button, Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { FriendsLeaderboard } from "../friends.types";
import { LeaderboardEntries } from "./LeaderboardEntries";

type RosaryLeaderboardCardProps = {
  leaderboard: FriendsLeaderboard;
  onPressFriend: (friendId: string) => void;
  onViewFullLeaderboard: () => void;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function RosaryLeaderboardCard({
  leaderboard,
  onPressFriend,
  onViewFullLeaderboard,
}: RosaryLeaderboardCardProps) {
  const styles = useThemedStyles(styleSheet);
  const topEntries = leaderboard.entries.slice(0, 7);
  const showCurrentUserEntry = Boolean(
    leaderboard.currentUserEntry &&
    !topEntries.some((entry) => entry.friend.id === leaderboard.currentUserEntry?.friend.id),
  );

  return (
    <Card
      header={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.heading}>
            LEADERBOARD
          </Text>
          <Pressable
            accessibilityLabel={`Leaderboard period: ${leaderboard.period.name}`}
            onPress={onViewFullLeaderboard}
            style={styles.period}
          >
            <Text style={styles.periodLabel}>{leaderboard.period.name}</Text>
            <Feather color={theme.colors.icon.secondary} name="chevron-down" size={theme.sizes.iconSmall} />
          </Pressable>
        </View>
      }
      footer={
        <Button
          fullWidth
          onPress={onViewFullLeaderboard}
          rightIcon={<Feather color={theme.colors.text.link} name="arrow-right" size={theme.sizes.iconSmall} />}
          variant="ghost"
        >
          View Leaderboard
        </Button>
      }
      padding="none"
      variant="warning"
    >
      <View style={styles.content}>
        <LeaderboardEntries entries={topEntries} onPressFriend={onPressFriend} />
        {showCurrentUserEntry && leaderboard.currentUserEntry ? (
          <View style={styles.currentUserSection}>
            <Text style={styles.currentUserLabel}>{`YOU — #${leaderboard.currentUserEntry.rank} AMONG FRIENDS`}</Text>
            <LeaderboardEntries entries={[leaderboard.currentUserEntry]} showHeader={false} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  currentUserLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.success,
    marginBottom: theme.spacing[1],
  },
  currentUserSection: {
    borderTopColor: theme.colors.border.strong,
    borderTopWidth: theme.borderWidths.thin,
    marginTop: theme.spacing[2],
    paddingTop: theme.spacing[3],
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    ...theme.typography.heading3,
    color: theme.colors.text.warning,
  },
  period: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    minHeight: theme.sizes.touchTarget,
  },
  periodLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
  },
}));
