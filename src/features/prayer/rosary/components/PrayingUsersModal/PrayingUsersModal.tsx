import Feather from "@expo/vector-icons/Feather";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { AvatarWithCountryBadge } from "@/components/identity";
import { getFriends } from "@/features/friends/friends.api";
import { findSaintAvatar } from "@/features/profile/saints";
import type { RosaryPresenceUser } from "@/features/prayer/rosary/presence.types";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const PAGE_SIZE = 20;

export type PrayingUsersModalProps = {
  currentUserId: string;
  onClose: () => void;
  onSelectUser: (user: RosaryPresenceUser, isFriend: boolean) => void;
  users: RosaryPresenceUser[];
  visible: boolean;
};

/** Loads every friendship ID so live users can be grouped without changing the existing API contract. */
async function loadAllFriendIds(): Promise<Set<string>> {
  const friendIds = new Set<string>();
  const visitedOffsets = new Set<number>();
  let offset = 0;

  while (!visitedOffsets.has(offset)) {
    visitedOffsets.add(offset);
    const page = await getFriends({ includeRosaryStreak: false, limit: 100, offset });
    page.data.forEach((friend) => friendIds.add(friend.id));
    if (!page.meta.hasMore || page.meta.nextOffset === null) break;
    offset = page.meta.nextOffset;
  }

  return friendIds;
}

/** Orders live participants as the viewer, friends, then the remaining community alphabetically. */
function orderPrayingUsers(
  users: RosaryPresenceUser[],
  currentUserId: string,
  friendIds: ReadonlySet<string>,
): RosaryPresenceUser[] {
  return [...users].sort((left, right) => {
    const leftGroup = left.userId === currentUserId ? 0 : friendIds.has(left.userId) ? 1 : 2;
    const rightGroup = right.userId === currentUserId ? 0 : friendIds.has(right.userId) ? 1 : 2;
    if (leftGroup !== rightGroup) return leftGroup - rightGroup;
    return left.displayName.localeCompare(right.displayName) || left.userId.localeCompare(right.userId);
  });
}

/**
 * Shows all users currently in the Rosary Presence channel, loading relationships only while open.
 * The live snapshot is paged locally because Supabase Presence already synchronizes the full room.
 */
export function PrayingUsersModal({ currentUserId, onClose, onSelectUser, users, visible }: PrayingUsersModalProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const reduceMotion = useReducedMotion();
  const { height, width } = useWindowDimensions();
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [friendLoadError, setFriendLoadError] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const friendRequestId = useRef(0);
  const isTablet = width >= theme.breakpoints.tablet;

  /** Loads friendship membership and leaves the live list usable when that secondary request fails. */
  const loadFriends = useCallback(async () => {
    const requestId = ++friendRequestId.current;
    setFriendLoadError(false);
    setIsLoadingFriends(true);
    try {
      const nextFriendIds = await loadAllFriendIds();
      if (requestId === friendRequestId.current) setFriendIds(nextFriendIds);
    } catch {
      if (requestId === friendRequestId.current) {
        setFriendIds(new Set());
        setFriendLoadError(true);
      }
    } finally {
      if (requestId === friendRequestId.current) setIsLoadingFriends(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    setVisibleCount(PAGE_SIZE);
    void loadFriends();
    return () => {
      friendRequestId.current += 1;
    };
  }, [loadFriends, visible]);

  const orderedUsers = useMemo(
    () => orderPrayingUsers(users, currentUserId, friendIds),
    [currentUserId, friendIds, users],
  );
  const visibleUsers = orderedUsers.slice(0, visibleCount);

  /** Adds the next local page when the participant list approaches its end. */
  const loadNextPage = useCallback(() => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, orderedUsers.length));
  }, [orderedUsers.length]);

  /** Renders one accessible participant row and reports whether the person is already a friend. */
  const renderUser = useCallback(
    ({ item }: { item: RosaryPresenceUser }) => {
      const isCurrentUser = item.userId === currentUserId;
      const isFriend = friendIds.has(item.userId);

      /** Opens the selected participant's quick profile. */
      function openProfile() {
        onSelectUser(item, isFriend);
      }

      return (
        <Pressable
          accessibilityLabel={
            isCurrentUser
              ? t("rosary.presence.viewYourProfile")
              : t("rosary.presence.viewProfile", { name: item.displayName })
          }
          accessibilityRole="button"
          onPress={openProfile}
          style={({ pressed }) => [styles.userRow, pressed && styles.pressed]}
        >
          <View style={styles.avatarWrap}>
            <AvatarWithCountryBadge
              accessibilityLabel={t("rosary.presence.avatarLabel", { name: item.displayName })}
              countryCode={item.countryCode}
              name={item.displayName}
              size={theme.sizes.iconMedium + theme.spacing[2]}
              source={findSaintAvatar(item.saintAvatarId)?.image ?? item.avatarUrl}
            />
            <View accessible={false} style={styles.onlineDot} />
          </View>
          <View style={styles.userCopy}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={styles.userName}>
                {isCurrentUser ? t("rosary.presence.you") : item.displayName}
              </Text>
              {isFriend ? <Text style={styles.friendBadge}>{t("rosary.presence.friend")}</Text> : null}
            </View>
            <Text numberOfLines={1} style={styles.userMeta}>
              {`@${item.username}${item.title ? ` • ${item.title}` : ""}`}
            </Text>
          </View>
          <Feather accessible={false} color={theme.rosary.colors.goldMuted} name="chevron-right" size={20} />
        </Pressable>
      );
    },
    [currentUserId, friendIds, onSelectUser, styles, t],
  );

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
          accessibilityLabel={t("rosary.presence.listLabel")}
          accessibilityViewIsModal
          style={[
            styles.dialog,
            {
              maxHeight: Math.max(320, Math.min(isTablet ? 720 : height * 0.86, height - theme.spacing[8])),
              maxWidth: isTablet ? 620 : 520,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text accessibilityRole="header" style={styles.title}>
                {t("rosary.presence.title")}
              </Text>
              <Text style={styles.subtitle}>
                {t("rosary.presence.count", {
                  count: users.length,
                  formattedCount: users.length.toLocaleString(locale),
                })}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={t("rosary.presence.closeList")}
              accessibilityRole="button"
              hitSlop={theme.spacing[2]}
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <Feather accessible={false} color={theme.colors.text.primary} name="x" size={theme.sizes.iconMedium} />
            </Pressable>
          </View>

          {isLoadingFriends ? (
            <View
              accessibilityLabel={t("rosary.presence.orderingLabel")}
              accessibilityRole="progressbar"
              style={styles.loading}
            >
              <ActivityIndicator color={theme.rosary.colors.gold} />
              <Text style={styles.loadingText}>{t("rosary.presence.ordering")}</Text>
            </View>
          ) : (
            <>
              {friendLoadError ? (
                <View style={styles.errorRow}>
                  <Text accessibilityRole="alert" style={styles.errorText}>
                    {t("rosary.presence.friendError")}
                  </Text>
                  <Button
                    accessibilityLabel={t("rosary.presence.retryOrdering")}
                    onPress={() => void loadFriends()}
                    size="sm"
                    variant="ghost"
                  >
                    {t("common.retry")}
                  </Button>
                </View>
              ) : null}
              <FlatList
                accessibilityLabel={t("rosary.presence.list")}
                data={visibleUsers}
                initialNumToRender={PAGE_SIZE}
                keyExtractor={(item) => item.userId}
                maxToRenderPerBatch={PAGE_SIZE}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.35}
                renderItem={renderUser}
                showsVerticalScrollIndicator={false}
                testID="praying-users-list"
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  avatarWrap: { position: "relative" },
  closeButton: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  dialog: {
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.rosary.borderWidths.goldHairline,
    overflow: "hidden",
    width: "100%",
  },
  errorRow: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.warningSurface,
    flexDirection: "row",
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.text.warning,
    flex: 1,
  },
  friendBadge: {
    ...theme.typography.labelSmall,
    backgroundColor: theme.colors.semantic.successSurface,
    borderRadius: theme.radii.pill,
    color: theme.colors.text.success,
    overflow: "hidden",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[0.5],
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.rosary.colors.goldMuted,
    borderBottomWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  headerCopy: { flex: 1, minWidth: 0 },
  loading: {
    alignItems: "center",
    gap: theme.spacing[3],
    justifyContent: "center",
    minHeight: 220,
    padding: theme.spacing[6],
  },
  loadingText: { ...theme.typography.bodySmall, color: theme.rosary.colors.scripture, textAlign: "center" },
  nameRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2], minWidth: 0 },
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
    height: 11,
    position: "absolute",
    right: -2,
    top: -2,
    width: 11,
  },
  pressed: { opacity: theme.opacity.pressed },
  subtitle: { ...theme.typography.bodySmall, color: theme.rosary.colors.scripture, marginTop: theme.spacing[0.5] },
  title: { ...theme.typography.heading3, color: theme.colors.text.white },
  userCopy: { flex: 1, minWidth: 0 },
  userMeta: { ...theme.typography.caption, color: theme.colors.text.muted, marginTop: theme.spacing[0.5] },
  userName: { ...theme.typography.bodyMedium, color: theme.colors.text.white, flexShrink: 1 },
  userRow: {
    alignItems: "center",
    borderBottomColor: theme.rosary.colors.goldMuted,
    borderBottomWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget + theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
}));
