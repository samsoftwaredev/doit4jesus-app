import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { FriendSummary } from "../friends.types";
import { FriendAvatar } from "./FriendAvatar";

type FriendsListProps = {
  friends: FriendSummary[];
  onPressFriend: (friendId: string) => void;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function FriendsList({ friends, onPressFriend }: FriendsListProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <Card padding="none" title={t("friends.title")}>
      <View style={styles.content}>
        {friends.map((friend) => (
          <Pressable
            accessibilityLabel={t("friends.viewProfileLabel", { name: friend.displayName })}
            key={friend.id}
            onPress={() => onPressFriend(friend.id)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <FriendAvatar
              accessibilityLabel={t("friends.avatarLabel", { name: friend.displayName })}
              countryCode={friend.countryCode}
              name={friend.displayName}
              source={friend.avatarUrl}
            />
            <View style={styles.copy}>
              <Text numberOfLines={1} style={styles.name}>
                {friend.displayName}
              </Text>
              <Text numberOfLines={1} style={styles.metadata}>
                {`${t("friends.level", { level: friend.currentLevel.levelNumber })}${friend.title ? ` • ${friend.title}` : ""}`}
              </Text>
            </View>
            <View
              style={styles.rosaryCount}
              accessibilityLabel={t("friends.totalRosariesLabel", { count: friend.rosaryTotal })}
            >
              <Text style={styles.rosaryValue}>{friend.rosaryTotal}</Text>
              <Text style={styles.rosaryLabel}>{t("friends.rosaries")}</Text>
            </View>
            <Feather color={theme.colors.icon.muted} name="chevron-right" size={theme.sizes.iconMedium} />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
}));
