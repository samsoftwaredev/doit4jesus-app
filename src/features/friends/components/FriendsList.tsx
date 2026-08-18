import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

import type { FriendSummary } from "../friends.types";
import { FriendAvatar } from "./FriendAvatar";

type FriendsListProps = {
  friends: FriendSummary[];
  onPressFriend: (friendId: string) => void;
};

export function FriendsList({ friends, onPressFriend }: FriendsListProps) {
  return (
    <Card padding="none" title="Your friends">
      <View style={styles.content}>
        {friends.map((friend) => (
          <Pressable
            accessibilityLabel={`View ${friend.displayName}'s profile`}
            key={friend.id}
            onPress={() => onPressFriend(friend.id)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <FriendAvatar
              accessibilityLabel={`${friend.displayName}'s profile image`}
              name={friend.displayName}
              source={friend.avatarUrl}
            />
            <View style={styles.copy}>
              <Text numberOfLines={1} style={styles.name}>{friend.displayName}</Text>
              <Text numberOfLines={1} style={styles.metadata}>
                {`Level ${friend.currentLevel.levelNumber}${friend.title ? ` • ${friend.title}` : ""}`}
              </Text>
            </View>
            <View style={styles.rosaryCount} accessibilityLabel={`${friend.rosaryTotal} total Rosaries`}>
              <Text style={styles.rosaryValue}>{friend.rosaryTotal}</Text>
              <Text style={styles.rosaryLabel}>ROSARIES</Text>
            </View>
            <Feather color={theme.colors.icon.muted} name="chevron-right" size={theme.sizes.iconMedium} />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing[4],
  },
  copy: {
    flex: 1,
    marginLeft: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  item: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget + theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  metadata: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  name: {
    ...theme.typography.bodyMedium,
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
  rosaryCount: {
    alignItems: "flex-end",
    marginRight: theme.spacing[2],
  },
  rosaryLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.subtle,
  },
  rosaryValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.warning,
  },
});
