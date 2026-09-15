import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, ActivityIndicator, Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { Button } from "@/components/ui";
import { AvatarWithCountryBadge } from "@/components/identity";
import { searchUsers, sendFriendRequest } from "@/features/friends/friends.api";
import type { UserSearchResult } from "@/features/friends/friends.types";
import { findSaintAvatar } from "@/features/profile/saints";
import type { RosaryPresenceUser } from "@/features/prayer/rosary/presence.types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type RelationshipState = UserSearchResult["relationshipState"] | "error" | "loading" | "self";

export type PrayingUserProfileModalProps = {
  currentUserId: string;
  knownFriend?: boolean;
  onClose: () => void;
  user: RosaryPresenceUser | null;
  visible: boolean;
};

/** Shows a live participant's public identity and the friendship action available to the viewer. */
export function PrayingUserProfileModal({
  currentUserId,
  knownFriend,
  onClose,
  user,
  visible,
}: PrayingUserProfileModalProps) {
  const styles = useThemedStyles(styleSheet);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [actionError, setActionError] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const [relationshipState, setRelationshipState] = useState<RelationshipState>("loading");
  const relationshipRequestId = useRef(0);

  /** Resolves the viewer-specific relationship using the existing exact-username search contract. */
  const resolveRelationship = useCallback(async () => {
    if (!user) return;
    const requestId = ++relationshipRequestId.current;
    setActionError(undefined);
    if (user.userId === currentUserId) {
      setRelationshipState("self");
      return;
    }
    if (knownFriend) {
      setRelationshipState("friends");
      return;
    }

    setRelationshipState("loading");
    try {
      const page = await searchUsers(user.username);
      const match = page.data.find((candidate) => candidate.username.toLowerCase() === user.username.toLowerCase());
      if (requestId === relationshipRequestId.current) {
        setRelationshipState(match?.relationshipState ?? "none");
      }
    } catch {
      if (requestId === relationshipRequestId.current) setRelationshipState("error");
    }
  }, [currentUserId, knownFriend, user]);

  useEffect(() => {
    if (visible && user) void resolveRelationship();
    return () => {
      relationshipRequestId.current += 1;
    };
  }, [resolveRelationship, user, visible]);

  if (!user) return null;
  const selectedUser = user;

  /** Sends a request to the selected participant and keeps the successful state visible in this dialog. */
  async function addFriend() {
    setActionError(undefined);
    setIsSending(true);
    try {
      await sendFriendRequest(selectedUser.username);
      setRelationshipState("outgoingPending");
      AccessibilityInfo.announceForAccessibility(`Friend request sent to ${selectedUser.displayName}.`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to send this friend request.");
    } finally {
      setIsSending(false);
    }
  }

  /** Closes the quick profile before opening the established friend-profile route. */
  function viewFriendProfile() {
    onClose();
    router.push(`/friends/${selectedUser.userId}`);
  }

  /** Closes the quick profile before opening the incoming friend-request list. */
  function reviewIncomingRequest() {
    onClose();
    router.push("/friends/requests");
  }

  return (
    <Modal
      animationType={reduceMotion ? "none" : "fade"}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View
          accessibilityLabel={`${user.displayName}'s prayer profile`}
          accessibilityViewIsModal
          style={[styles.dialog, { maxWidth: width >= theme.breakpoints.tablet ? 460 : 410 }]}
        >
          <Pressable
            accessibilityLabel="Close prayer profile"
            accessibilityRole="button"
            hitSlop={theme.spacing[2]}
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Feather accessible={false} color={theme.colors.text.primary} name="x" size={theme.sizes.iconMedium} />
          </Pressable>
          <View style={styles.avatarWrap}>
            <AvatarWithCountryBadge
              accessibilityLabel={`${user.displayName}'s profile image, online and praying`}
              countryCode={user.countryCode}
              name={user.displayName}
              size={theme.sizes.iconHero + theme.spacing[8]}
              source={findSaintAvatar(user.saintAvatarId)?.image ?? user.avatarUrl}
            />
            <View accessible={false} style={styles.onlineDot} />
          </View>
          <Text accessibilityRole="header" style={styles.name}>
            {user.displayName}
          </Text>
          <Text style={styles.username}>{`@${user.username}`}</Text>
          {user.title ? <Text style={styles.userTitle}>{user.title}</Text> : null}
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>PRAYING NOW</Text>
          </View>

          <View style={styles.actionArea}>
            {relationshipState === "loading" ? (
              <View accessibilityLabel="Checking friendship" accessibilityRole="progressbar" style={styles.loading}>
                <ActivityIndicator color={theme.rosary.colors.gold} />
                <Text style={styles.loadingText}>Checking friendship…</Text>
              </View>
            ) : null}
            {relationshipState === "self" ? <Text style={styles.selfText}>This is you</Text> : null}
            {relationshipState === "friends" ? (
              <Button
                accessibilityLabel={`View ${user.displayName}'s friend profile`}
                fullWidth
                onPress={viewFriendProfile}
              >
                View Friend Profile
              </Button>
            ) : null}
            {relationshipState === "none" ? (
              <Button
                accessibilityLabel={`Add ${user.displayName} as a friend`}
                fullWidth
                loading={isSending}
                onPress={() => void addFriend()}
                variant="warning"
              >
                Add Friend
              </Button>
            ) : null}
            {relationshipState === "outgoingPending" ? (
              <Button
                accessibilityLabel={`Friend request sent to ${user.displayName}`}
                disabled
                fullWidth
                variant="outline"
              >
                Requested
              </Button>
            ) : null}
            {relationshipState === "incomingPending" ? (
              <Button fullWidth onPress={reviewIncomingRequest} variant="secondary">
                Review Request
              </Button>
            ) : null}
            {relationshipState === "error" ? (
              <View style={styles.relationshipError}>
                <Text accessibilityRole="alert" style={styles.errorText}>
                  Friendship status could not be loaded.
                </Text>
                <Button
                  accessibilityLabel="Retry friendship status"
                  onPress={() => void resolveRelationship()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </View>
            ) : null}
            {actionError ? (
              <Text accessibilityRole="alert" style={styles.errorText}>
                {actionError}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  actionArea: { marginTop: theme.spacing[5], width: "100%" },
  avatarWrap: { position: "relative" },
  closeButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  dialog: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.rosary.borderWidths.goldHairline,
    padding: theme.spacing[5],
    width: "100%",
  },
  errorText: { ...theme.typography.bodySmall, color: theme.colors.text.danger, textAlign: "center" },
  liveBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.successSurface,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    marginTop: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  liveDot: {
    backgroundColor: theme.colors.semantic.success,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2],
    width: theme.spacing[2],
  },
  liveText: { ...theme.typography.labelSmall, color: theme.colors.text.success },
  loading: { alignItems: "center", gap: theme.spacing[2], minHeight: theme.sizes.buttonHeight },
  loadingText: { ...theme.typography.bodySmall, color: theme.rosary.colors.scripture },
  name: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  onlineDot: {
    backgroundColor: theme.colors.semantic.success,
    borderColor: theme.rosary.colors.cardInset,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    height: 14,
    position: "absolute",
    right: 0,
    top: 0,
    width: 14,
  },
  pressed: { opacity: theme.opacity.pressed },
  relationshipError: { alignItems: "center", gap: theme.spacing[3] },
  selfText: { ...theme.typography.bodyMedium, color: theme.rosary.colors.scripture, textAlign: "center" },
  username: { ...theme.typography.body, color: theme.rosary.colors.gold, marginTop: theme.spacing[1] },
  userTitle: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
}));
