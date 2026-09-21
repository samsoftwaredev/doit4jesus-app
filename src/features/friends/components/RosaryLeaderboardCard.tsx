import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button, Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { FriendsLeaderboard } from "../friends.types";
import { getLeaderboardPeriodLabelKey } from "../friends.periods";
import { LeaderboardEntries } from "./LeaderboardEntries";

type RosaryLeaderboardCardProps = {
  leaderboard: FriendsLeaderboard;
  onAddFriends: () => void;
  onPressFriend: (friendId: string) => void;
  onViewFullLeaderboard: () => void;
};

/** Presents the friends-only leaderboard with context and actions to expand the user's fellowship. */
export function RosaryLeaderboardCard({
  leaderboard,
  onAddFriends,
  onPressFriend,
  onViewFullLeaderboard,
}: RosaryLeaderboardCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const periodLabel = t(getLeaderboardPeriodLabelKey(leaderboard.period.periodType));
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
            {t("friends.leaderboard.title").toUpperCase()}
          </Text>
          <Pressable
            accessibilityLabel={t("friends.leaderboard.periodLabel", { period: periodLabel })}
            onPress={onViewFullLeaderboard}
            style={styles.period}
          >
            <Text style={styles.periodLabel}>{periodLabel}</Text>
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
          {t("friends.leaderboard.view")}
        </Button>
      }
      padding="none"
      variant="warning"
    >
      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.description}>{t("friends.leaderboard.friendsOnlyDescription")}</Text>
          <Button fullWidth onPress={onAddFriends} size="sm" style={styles.addFriendsButton} variant="warning">
            {t("friends.leaderboard.addFriends")}
          </Button>
        </View>
        <LeaderboardEntries entries={topEntries} onPressFriend={onPressFriend} />
        {showCurrentUserEntry && leaderboard.currentUserEntry ? (
          <View style={styles.currentUserSection}>
            <Text style={styles.currentUserLabel}>
              {t("friends.leaderboard.youAmong", { rank: leaderboard.currentUserEntry.rank })}
            </Text>
            <LeaderboardEntries entries={[leaderboard.currentUserEntry]} showHeader={false} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  addFriendsButton: {
    minHeight: theme.sizes.touchTarget,
  },
  content: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
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
  intro: {
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[3],
    paddingTop: theme.spacing[1],
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
