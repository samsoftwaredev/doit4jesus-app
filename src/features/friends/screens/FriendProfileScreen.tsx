import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card } from "@/components/ui";
import {
  FriendAvatar,
  FriendsHeader,
  FriendsState,
} from "@/features/friends/components";
import { removeFriend } from "@/features/friends/friends.api";
import { useFriendProfile } from "@/features/friends/friends.hooks";
import { theme } from "@/theme/tokens";

export function FriendProfileScreen({
  friendId,
}: {
  friendId: string | undefined;
}) {
  const router = useRouter();
  const profile = useFriendProfile(friendId);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const confirmRemove = () => {
    console.log("confirmRemove", friendId, profile.friend);
    if (!friendId || !profile.friend) return;
    Alert.alert(
      "Remove friend?",
      `Remove ${profile.friend.friend.displayName} from your friends? You can send a new request later.`,
      [
        { style: "cancel", text: "Cancel" },
        {
          onPress: () => {
            void (async () => {
              setIsRemoving(true);
              try {
                await removeFriend(friendId);
                setShowOptions(false);
                router.replace("/community");
              } catch {
                Alert.alert("Couldn't remove friend", "Please try again.");
              } finally {
                setIsRemoving(false);
              }
            })();
          },
          style: "destructive",
          text: "Remove Friend",
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <FriendsHeader
        onBack={() => router.back()}
        rightAction={
          <Pressable
            accessibilityLabel="Friend options"
            accessibilityRole="button"
            onPress={() => setShowOptions(true)}
            style={styles.optionsButton}
          >
            <Feather
              color={theme.colors.icon.primary}
              name="more-horizontal"
              size={theme.sizes.iconMedium}
            />
          </Pressable>
        }
        title="Friend Profile"
      />
      {profile.isLoading ? (
        <View style={styles.state}>
          <FriendsState
            message="Loading this friend's profile…"
            title="Friend Profile"
            type="loading"
          />
        </View>
      ) : null}
      {profile.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel="Try again"
            message={profile.error}
            onAction={() => void profile.reload()}
            title="Couldn't load friend profile"
            type="error"
          />
        </View>
      ) : null}
      {profile.friend && !profile.isLoading && !profile.error ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Card padding="lg" variant="elevated">
            <View style={styles.hero}>
              <FriendAvatar
                accessibilityLabel={`${profile.friend.friend.displayName}'s profile image`}
                name={profile.friend.friend.displayName}
                size="xl"
                source={profile.friend.friend.avatarUrl}
              />
              <Text style={styles.name}>
                {profile.friend.friend.displayName}
              </Text>
              {profile.friend.friend.title ? (
                <Text style={styles.title}>{profile.friend.friend.title}</Text>
              ) : null}
              <Text
                style={styles.level}
              >{`Level ${profile.friend.progress.currentLevel.levelNumber}`}</Text>
              <Text
                style={styles.xp}
              >{`${profile.friend.progress.totalXp.toLocaleString("en-US")} XP`}</Text>
            </View>
          </Card>

          <View style={styles.stats}>
            <ProfileStat
              label="TOTAL ROSARIES"
              value={profile.friend.rosaryTotal.toLocaleString("en-US")}
            />
            {profile.friend.rosaryStreak ? (
              <ProfileStat
                label="DAY STREAK"
                value={profile.friend.rosaryStreak.currentStreak.toLocaleString(
                  "en-US",
                )}
              />
            ) : null}
            <ProfileStat
              label="BADGES"
              value={profile.friend.badges.length.toLocaleString("en-US")}
            />
          </View>

          <Card padding="md" title="Progress">
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current level</Text>
              <Text style={styles.detailValue}>
                {profile.friend.progress.currentLevel.name ??
                  `Level ${profile.friend.progress.currentLevel.levelNumber}`}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total XP</Text>
              <Text style={styles.detailValue}>
                {profile.friend.progress.totalXp.toLocaleString("en-US")}
              </Text>
            </View>
            {profile.friend.rosaryStreak ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Longest Rosary streak</Text>
                <Text
                  style={styles.detailValue}
                >{`${profile.friend.rosaryStreak.longestStreak} days`}</Text>
              </View>
            ) : null}
          </Card>
        </ScrollView>
      ) : null}
      <FriendOptionsModal
        isRemoving={isRemoving}
        onClose={() => setShowOptions(false)}
        onCompare={() => {
          setShowOptions(false);
          if (friendId) router.push(`/friends/${friendId}/compare`);
        }}
        onRemove={confirmRemove}
        visible={showOptions}
      />
    </SafeAreaView>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="sm" style={styles.stat} variant="outlined">
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function FriendOptionsModal({
  isRemoving,
  onClose,
  onCompare,
  onRemove,
  visible,
}: {
  isRemoving: boolean;
  onClose: () => void;
  onCompare: () => void;
  onRemove: () => void;
  visible: boolean;
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <Card padding="md" style={styles.optionsCard} variant="elevated">
          <Text
            accessibilityRole="header"
            style={[styles.optionsTitle, { marginBottom: theme.spacing[3] }]}
          >
            Friend options
          </Text>
          <Button
            fullWidth
            onPress={onClose}
            variant="secondary"
            style={{ marginBottom: theme.spacing[3] }}
          >
            View Profile
          </Button>
          <Button
            fullWidth
            onPress={onCompare}
            variant="outline"
            style={{ marginBottom: theme.spacing[3] }}
          >
            Compare Stats
          </Button>
          <Button
            fullWidth
            loading={isRemoving}
            onPress={onRemove}
            variant="danger"
            style={{ marginBottom: theme.spacing[3] }}
          >
            Remove Friend
          </Button>
          <Button fullWidth onPress={onClose} variant="ghost">
            Cancel
          </Button>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: theme.sizes.contentMaxWidth,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    width: "100%",
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  detailRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: theme.sizes.touchTarget,
  },
  detailValue: {
    ...theme.typography.bodyMedium,
    maxWidth: "50%",
    textAlign: "right",
  },
  hero: {
    alignItems: "center",
  },
  level: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[3],
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  name: {
    ...theme.typography.heading2,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  optionsButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  optionsCard: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing[3],
    maxWidth: theme.sizes.contentMaxWidth,
    width: "100%",
  },
  optionsTitle: {
    ...theme.typography.heading3,
    textAlign: "center",
  },
  safeArea: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
  },
  stat: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minWidth: theme.spacing[20],
  },
  statLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  statValue: {
    ...theme.typography.metric,
    color: theme.colors.text.warning,
    textAlign: "center",
  },
  state: {
    paddingHorizontal: theme.spacing[4],
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[3],
  },
  title: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  xp: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.warning,
    marginTop: theme.spacing[1],
  },
});
