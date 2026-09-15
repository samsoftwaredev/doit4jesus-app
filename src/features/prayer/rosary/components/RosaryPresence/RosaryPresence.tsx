import { useMemo, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

import { AvatarWithCountryBadge } from "@/components/identity";
import { findSaintAvatar } from "@/features/profile/saints";
import { useRosaryPresence } from "@/features/prayer/rosary/hooks/useRosaryPresence";
import type { RosaryPresenceUser } from "@/features/prayer/rosary/presence.types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { PrayingUserProfileModal } from "../PrayingUserProfileModal";
import { PrayingUsersModal } from "../PrayingUsersModal";

type SelectedUser = {
  knownFriend?: boolean;
  user: RosaryPresenceUser;
};

/** Coordinates the compact Rosary Presence preview with its participant and quick-profile dialogs. */
export function RosaryPresence() {
  const styles = useThemedStyles(styleSheet);
  const { fontScale, width } = useWindowDimensions();
  const { connectionState, currentUserId, users } = useRosaryPresence();
  const [listVisible, setListVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const compact = width < theme.breakpoints.largePhone || fontScale > 1.25;
  const avatarSize = compact ? 26 : 30;
  const previewUsers = useMemo(() => {
    const otherUsers = users.filter((user) => user.userId !== currentUserId);
    if (otherUsers.length > 0) return otherUsers.slice(0, 3);
    const currentUser = users.find((user) => user.userId === currentUserId);
    return currentUser ? [currentUser] : [];
  }, [currentUserId, users]);

  if (connectionState !== "connected" || !currentUserId || users.length === 0) return null;

  const countCopy =
    users.length === 1 ? "You’re praying now" : `${users.length.toLocaleString("en-US")} people praying now`;
  const visibleCountCopy = compact
    ? users.length === 1
      ? countCopy
      : `${users.length.toLocaleString("en-US")} praying`
    : countCopy;

  /** Opens the complete live participant list. */
  function openList() {
    setListVisible(true);
  }

  /** Opens the selected participant from either the preview or complete list. */
  function openProfile(user: RosaryPresenceUser, knownFriend?: boolean) {
    setListVisible(false);
    setSelectedUser({ knownFriend, user });
  }

  /** Clears the selected participant when the quick profile is dismissed. */
  function closeProfile() {
    setSelectedUser(null);
  }

  return (
    <>
      <View accessibilityLabel={countCopy} style={styles.container}>
        <View style={styles.avatars}>
          {previewUsers.map((user) => (
            <Pressable
              accessibilityLabel={
                user.userId === currentUserId
                  ? "View your prayer profile, online and praying"
                  : `View ${user.displayName}'s prayer profile, online and praying`
              }
              accessibilityRole="button"
              key={user.userId}
              onPress={() => openProfile(user)}
              style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
            >
              <AvatarWithCountryBadge
                accessibilityLabel={`${user.displayName}'s profile image`}
                borderColor={theme.rosary.colors.gold}
                borderWidth={theme.rosary.borderWidths.goldHairline}
                fallbackBackgroundColor={theme.rosary.colors.canvasLight}
                name={user.displayName}
                size={avatarSize}
                source={findSaintAvatar(user.saintAvatarId)?.image ?? user.avatarUrl}
              />
              <View
                accessible={false}
                style={[
                  styles.onlineDot,
                  {
                    right: (theme.sizes.touchTarget - avatarSize) / 2 - 1,
                    top: (theme.sizes.touchTarget - avatarSize) / 2 - 1,
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityLabel={`View all ${users.length.toLocaleString("en-US")} ${users.length === 1 ? "person" : "people"} praying now`}
          accessibilityRole="button"
          onPress={openList}
          style={({ pressed }) => [styles.countButton, pressed && styles.pressed]}
        >
          <Text numberOfLines={1} style={styles.countText}>
            {visibleCountCopy}
          </Text>
        </Pressable>
      </View>

      <PrayingUsersModal
        currentUserId={currentUserId}
        onClose={() => setListVisible(false)}
        onSelectUser={openProfile}
        users={users}
        visible={listVisible}
      />
      <PrayingUserProfileModal
        currentUserId={currentUserId}
        knownFriend={selectedUser?.knownFriend}
        onClose={closeProfile}
        user={selectedUser?.user ?? null}
        visible={selectedUser !== null}
      />
    </>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  avatarButton: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  avatars: { flexDirection: "row", flexShrink: 0 },
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    justifyContent: "flex-end",
    minHeight: theme.sizes.touchTarget,
    minWidth: 0,
  },
  onlineDot: {
    backgroundColor: theme.colors.semantic.success,
    borderColor: theme.rosary.colors.canvas,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    height: 11,
    position: "absolute",
    width: 11,
  },
  countButton: {
    alignItems: "flex-end",
    flexShrink: 1,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    minWidth: 0,
    paddingLeft: theme.spacing[1],
  },
  countText: {
    ...theme.typography.caption,
    color: theme.rosary.colors.goldBright,
    flexShrink: 1,
    textAlign: "right",
  },
  pressed: { opacity: theme.opacity.pressed },
}));
