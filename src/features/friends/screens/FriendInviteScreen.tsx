import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendAvatar, FriendsState } from "@/features/friends/components";
import { acceptFriendInvite, getFriendInvitePreview } from "@/features/friends/friends.api";
import type { FriendInvitePreview } from "@/features/friends/friends.types";
import { clearPendingFriendInvite } from "@/features/friends/pendingFriendInvite";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

/** Asks a signed-in user to confirm a friend invite, then makes the inviter a friend immediately. */
export function FriendInviteScreen({ code }: { code: string }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const [preview, setPreview] = useState<FriendInvitePreview>();
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(false);

  useEffect(() => {
    let active = true;
    getFriendInvitePreview(code)
      .then((result) => {
        if (active) setPreview(result);
      })
      .catch((error) => {
        logDevelopmentError("loading a friend invite", error);
        if (active) setIsInvalid(true);
        void clearPendingFriendInvite();
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [code]);

  /** Leaves the invite, returning to the previous screen or Community when opened from a link. */
  function leave() {
    void clearPendingFriendInvite();
    if (router.canGoBack()) router.back();
    else router.replace("/community");
  }

  /** Accepts the invite and shows the new friend in Community. */
  async function accept() {
    if (isAccepting) return;
    setIsAccepting(true);
    setAcceptError(false);
    try {
      await acceptFriendInvite(code);
      await clearPendingFriendInvite();
      router.replace("/community");
    } catch (error) {
      logDevelopmentError("accepting a friend invite", error);
      setAcceptError(true);
    } finally {
      setIsAccepting(false);
    }
  }

  const inviter = preview?.inviter;
  const name = inviter?.displayName ?? "";

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.invite.confirm.description")}
        onBack={leave}
        title={t("friends.invite.title")}
      />
      <View style={styles.content}>
        {isLoading ? (
          <FriendsState
            message={t("friends.invite.confirm.loading")}
            title={t("friends.invite.title")}
            type="loading"
          />
        ) : null}
        {isInvalid ? (
          <FriendsState message={t("friends.invite.confirm.invalid")} title={t("friends.invite.title")} type="empty" />
        ) : null}
        {inviter ? (
          <Card padding="lg" variant="elevated">
            <View style={styles.hero}>
              <FriendAvatar
                accessibilityLabel={t("friends.avatarLabel", { name })}
                name={name}
                size="xl"
                source={inviter.avatarUrl}
              />
              <Text accessibilityRole="header" style={styles.title}>
                {t("friends.invite.confirm.title", { name })}
              </Text>
              {inviter.username ? <Text style={styles.username}>{`@${inviter.username}`}</Text> : null}
            </View>
            {acceptError ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {t("friends.invite.confirm.error")}
              </Text>
            ) : null}
            <View style={styles.actions}>
              {preview.relationshipState === "friends" ? null : (
                <Button fullWidth loading={isAccepting} onPress={() => void accept()} variant="warning">
                  {t("friends.invite.confirm.accept")}
                </Button>
              )}
              {inviter.username ? (
                <Button
                  fullWidth
                  onPress={() =>
                    router.push({ pathname: "/friends/user/[username]", params: { username: inviter.username ?? "" } })
                  }
                  variant="outline"
                >
                  {t("friends.userProfile.open", { username: inviter.username })}
                </Button>
              ) : null}
              <Button fullWidth onPress={leave} variant="ghost">
                {t("friends.invite.confirm.notNow")}
              </Button>
            </View>
          </Card>
        ) : null}
      </View>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  actions: { gap: theme.spacing[3], marginTop: theme.spacing[5] },
  content: { alignSelf: "center", maxWidth: 560, paddingHorizontal: theme.spacing[4], width: "100%" },
  error: { ...theme.typography.bodySmall, color: theme.colors.text.danger, marginTop: theme.spacing[3] },
  hero: { alignItems: "center" },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  title: { ...theme.typography.heading2, marginTop: theme.spacing[3], textAlign: "center" },
  username: { ...theme.typography.body, color: theme.colors.text.muted, marginTop: theme.spacing[1] },
}));
