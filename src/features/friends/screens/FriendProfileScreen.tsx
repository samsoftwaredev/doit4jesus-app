import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { blockAccount, ReportContentModal } from "@/features/community-safety";
import {
  CompareStatsSection,
  FriendAvatar,
  FriendsState,
  RemoveFriendConfirmationModal,
} from "@/features/friends/components";
import { removeFriend } from "@/features/friends/friends.api";
import { useFriendProfile } from "@/features/friends/friends.hooks";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

/** Renders a selected friend's profile within the shared atmosphere. */
export function FriendProfileScreen({ friendId }: { friendId: string | undefined }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const router = useRouter();
  const profile = useFriendProfile(friendId);
  const removalInFlight = useRef(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRemoveConfirmationVisible, setIsRemoveConfirmationVisible] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [safetyError, setSafetyError] = useState(false);

  /** Opens a fresh removal confirmation for the loaded friend. */
  const openRemoveConfirmation = () => {
    setRemoveError(false);
    setIsRemoveConfirmationVisible(true);
  };

  /** Dismisses removal confirmation when no destructive request is active. */
  const dismissRemoveConfirmation = () => {
    if (isRemoving) return;
    setRemoveError(false);
    setIsRemoveConfirmationVisible(false);
  };

  /** Removes the loaded friend once, retaining the modal with an inline error on failure. */
  const confirmRemove = async () => {
    if (!friendId || !profile.friend || removalInFlight.current) return;
    removalInFlight.current = true;
    setIsRemoving(true);
    setRemoveError(false);
    try {
      await removeFriend(friendId);
      setIsRemoveConfirmationVisible(false);
      router.replace("/community");
    } catch (error) {
      logDevelopmentError("removing a friend", error);
      setRemoveError(true);
    } finally {
      removalInFlight.current = false;
      setIsRemoving(false);
    }
  };

  const confirmBlock = () => {
    if (!friendId) return;
    Alert.alert(t("safety.blockTitle"), t("safety.blockDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("safety.block"),
        style: "destructive",
        onPress: () => {
          void blockAccount(friendId)
            .then(() => router.replace("/community"))
            .catch((error) => {
              logDevelopmentError("blocking an account", error);
              setSafetyError(true);
            });
        },
      },
    ]);
  };

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.profile.description")}
        onBack={() => router.back()}
        title={t("friends.profile.title")}
      />
      {profile.isLoading ? (
        <View style={styles.state}>
          <FriendsState message={t("friends.profile.loading")} title={t("friends.profile.title")} type="loading" />
        </View>
      ) : null}
      {profile.error ? (
        <View style={styles.state}>
          <FriendsState
            actionLabel={t("profile.tryAgain")}
            message={profile.error}
            onAction={() => void profile.reload()}
            title={t("friends.profile.loadError")}
            type="error"
          />
        </View>
      ) : null}
      {profile.friend && !profile.isLoading && !profile.error ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View testID="friend-profile-section-identity">
            <Card padding="lg" variant="elevated">
              <View style={styles.hero}>
                <FriendAvatar
                  accessibilityLabel={t("friends.avatarLabel", { name: profile.friend.friend.displayName })}
                  countryCode={profile.friend.friend.countryCode}
                  name={profile.friend.friend.displayName}
                  size="xl"
                  source={profile.friend.friend.avatarUrl}
                />
                <Text style={styles.name}>{profile.friend.friend.displayName}</Text>
                {profile.friend.friend.title ? <Text style={styles.title}>{profile.friend.friend.title}</Text> : null}
                <Text style={styles.level}>
                  {t("friends.level", { level: profile.friend.progress.currentLevel.levelNumber })}
                </Text>
                <Text style={styles.xp}>{`${profile.friend.progress.totalXp.toLocaleString(locale)} XP`}</Text>
              </View>
            </Card>
          </View>

          <View style={styles.stats} testID="friend-profile-section-stats">
            <ProfileStat label={t("friends.totalRosaries")} value={profile.friend.rosaryTotal.toLocaleString(locale)} />
            {profile.friend.rosaryStreak ? (
              <ProfileStat
                label={t("friends.dayStreak")}
                value={profile.friend.rosaryStreak.currentStreak.toLocaleString(locale)}
              />
            ) : null}
            <ProfileStat label={t("friends.badges")} value={profile.friend.badges.length.toLocaleString(locale)} />
          </View>

          <View testID="friend-profile-section-progress">
            <Card padding="md" title={t("friends.profile.progress")}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t("friends.currentLevel")}</Text>
                <Text style={styles.detailValue}>
                  {profile.friend.progress.currentLevel.name ??
                    t("friends.level", { level: profile.friend.progress.currentLevel.levelNumber })}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t("friends.profile.totalXp")}</Text>
                <Text style={styles.detailValue}>{profile.friend.progress.totalXp.toLocaleString(locale)}</Text>
              </View>
              {profile.friend.rosaryStreak ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t("friends.profile.longestStreak")}</Text>
                  <Text style={styles.detailValue}>
                    {t("friends.profile.days", { count: profile.friend.rosaryStreak.longestStreak })}
                  </Text>
                </View>
              ) : null}
            </Card>
          </View>

          <View testID="friend-profile-section-comparison">
            <CompareStatsSection friendId={friendId} />
          </View>

          <View testID="friend-profile-section-remove">
            {safetyError ? (
              <Text accessibilityRole="alert" style={styles.safetyError}>
                {t("safety.actionError")}
              </Text>
            ) : null}
            <Button fullWidth onPress={() => setReportVisible(true)} variant="outline">
              {t("safety.reportUser")}
            </Button>
            <Button fullWidth onPress={confirmBlock} variant="danger">
              {t("safety.block")}
            </Button>
            <Button fullWidth onPress={openRemoveConfirmation} variant="danger">
              {t("friends.profile.remove")}
            </Button>
          </View>
        </ScrollView>
      ) : null}
      <RemoveFriendConfirmationModal
        error={removeError}
        friendName={profile.friend?.friend.displayName ?? ""}
        isRemoving={isRemoving}
        onConfirm={() => void confirmRemove()}
        onDismiss={dismissRemoveConfirmation}
        visible={isRemoveConfirmationVisible}
      />
      {friendId ? (
        <ReportContentModal
          onDismiss={() => setReportVisible(false)}
          targetId={friendId}
          targetType="user"
          visible={reportVisible}
        />
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

/** Renders ProfileStat with styles resolved from the active appearance. */
function ProfileStat({ label, value }: { label: string; value: string }) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card padding="sm" style={styles.stat} variant="outlined">
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safetyError: { ...theme.typography.bodySmall, color: theme.colors.text.danger, marginBottom: theme.spacing[2] },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 760,
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
  name: {
    ...theme.typography.heading2,
    marginTop: theme.spacing[3],
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
}));
