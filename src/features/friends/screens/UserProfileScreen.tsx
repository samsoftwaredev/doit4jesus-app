import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendAvatar, FriendsState } from "@/features/friends/components";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/features/friends/friends.api";
import { useUserProfile } from "@/features/friends/friends.hooks";
import type { RelationshipState, UserPublicProfile } from "@/features/friends/friends.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

/** Renders any user's public profile with a relationship-aware primary action such as Add friend. */
export function UserProfileScreen({ username }: { username: string | undefined }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const router = useRouter();
  const { error, isLoading, profile, reload, setProfile } = useUserProfile(username);
  const [isMutating, setIsMutating] = useState(false);
  const [actionError, setActionError] = useState(false);

  /** Runs one relationship change, then reflects the new state without reloading the profile. */
  async function mutate(action: () => Promise<void>, nextState: RelationshipState, nextRequestId: string | null) {
    if (!profile || isMutating) return;
    setIsMutating(true);
    setActionError(false);
    try {
      await action();
      setProfile({ ...profile, relationshipState: nextState, requestId: nextRequestId });
    } catch (mutationError) {
      logDevelopmentError("changing a friend relationship from a profile", mutationError);
      setActionError(true);
    } finally {
      setIsMutating(false);
    }
  }

  /** Re-fetches after sending a request so the cancel action receives the real request id. */
  async function addFriend(current: UserPublicProfile) {
    if (isMutating) return;
    setIsMutating(true);
    setActionError(false);
    try {
      await sendFriendRequest(current.user.username ?? "");
      await reload();
    } catch (mutationError) {
      logDevelopmentError("sending a friend request from a profile", mutationError);
      setActionError(true);
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.userProfile.description")}
        onBack={() => router.back()}
        title={t("friends.userProfile.title")}
      />
      {isLoading && !profile ? (
        <View style={styles.state}>
          <FriendsState message={t("friends.profile.loading")} title={t("friends.userProfile.title")} type="loading" />
        </View>
      ) : null}
      {error && !profile ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel={t("profile.tryAgain")}
            message={error}
            onAction={() => void reload()}
            title={t("friends.profile.loadError")}
            type="error"
          />
        </View>
      ) : null}
      {profile ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Card padding="lg" variant="elevated">
            <View style={styles.hero}>
              <FriendAvatar
                accessibilityLabel={t("friends.avatarLabel", { name: profile.user.displayName })}
                countryCode={profile.user.countryCode}
                name={profile.user.displayName}
                size="xl"
                source={profile.user.avatarUrl}
              />
              <Text style={styles.name}>{profile.user.displayName}</Text>
              {profile.user.username ? <Text style={styles.username}>{`@${profile.user.username}`}</Text> : null}
              {profile.user.title ? <Text style={styles.title}>{profile.user.title}</Text> : null}
              <Text style={styles.level}>
                {t("friends.level", { level: profile.progress.currentLevel.levelNumber })}
              </Text>
              <Text style={styles.xp}>{`${profile.progress.totalXp.toLocaleString(locale)} XP`}</Text>
            </View>
          </Card>

          <View style={styles.stats}>
            <Card padding="sm" style={styles.stat} variant="outlined">
              <Text style={styles.statValue}>{profile.rosaryTotal.toLocaleString(locale)}</Text>
              <Text style={styles.statLabel}>{t("friends.totalRosaries")}</Text>
            </Card>
            <Card padding="sm" style={styles.stat} variant="outlined">
              <Text style={styles.statValue}>{profile.badges.length.toLocaleString(locale)}</Text>
              <Text style={styles.statLabel}>{t("friends.badges")}</Text>
            </Card>
          </View>

          {actionError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {t("friends.errors.sendRequest")}
            </Text>
          ) : null}

          <View style={styles.actions} testID="user-profile-actions">
            {profile.relationshipState === "none" ? (
              <Button fullWidth loading={isMutating} onPress={() => void addFriend(profile)} variant="warning">
                {t("friends.sendRequest")}
              </Button>
            ) : null}
            {profile.relationshipState === "outgoingPending" ? (
              <>
                <Text style={styles.status}>{t("friends.requested")}</Text>
                {profile.requestId ? (
                  <Button
                    fullWidth
                    loading={isMutating}
                    onPress={() => void mutate(() => cancelFriendRequest(profile.requestId ?? ""), "none", null)}
                    variant="outline"
                  >
                    {t("friends.cancelRequest")}
                  </Button>
                ) : null}
              </>
            ) : null}
            {profile.relationshipState === "incomingPending" && profile.requestId ? (
              <>
                <Text style={styles.status}>{t("friends.requestReceived")}</Text>
                <Button
                  fullWidth
                  loading={isMutating}
                  onPress={() => void mutate(() => acceptFriendRequest(profile.requestId ?? ""), "friends", null)}
                  variant="warning"
                >
                  {t("friends.accept")}
                </Button>
                <Button
                  fullWidth
                  loading={isMutating}
                  onPress={() => void mutate(() => rejectFriendRequest(profile.requestId ?? ""), "none", null)}
                  variant="outline"
                >
                  {t("friends.decline")}
                </Button>
              </>
            ) : null}
            {profile.relationshipState === "friends" ? (
              <Button
                fullWidth
                onPress={() =>
                  router.replace({ pathname: "/friends/[friendId]", params: { friendId: profile.user.id } })
                }
                variant="outline"
              >
                {t("friends.userProfile.viewFriend")}
              </Button>
            ) : null}
          </View>
        </ScrollView>
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  actions: { gap: theme.spacing[3] },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 760,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    width: "100%",
  },
  error: { ...theme.typography.bodySmall, color: theme.colors.text.danger },
  hero: { alignItems: "center" },
  level: { ...theme.typography.bodyMedium, color: theme.colors.text.secondary, marginTop: theme.spacing[3] },
  name: { ...theme.typography.heading2, marginTop: theme.spacing[3], textAlign: "center" },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  stat: { alignItems: "center", flex: 1, justifyContent: "center", minWidth: theme.spacing[20] },
  state: { paddingHorizontal: theme.spacing[4] },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[3] },
  statLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  statValue: { ...theme.typography.metric, color: theme.colors.text.warning, textAlign: "center" },
  status: { ...theme.typography.bodyMedium, color: theme.colors.text.secondary, textAlign: "center" },
  title: { ...theme.typography.body, color: theme.colors.text.muted, marginTop: theme.spacing[1], textAlign: "center" },
  username: { ...theme.typography.body, color: theme.colors.text.muted, marginTop: theme.spacing[1] },
  xp: { ...theme.typography.bodyMedium, color: theme.colors.text.warning, marginTop: theme.spacing[1] },
}));
