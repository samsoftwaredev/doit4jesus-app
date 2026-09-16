import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components";
import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { Button, Card } from "@/components/ui";
import { FriendAvatar, FriendsState } from "@/features/friends/components";
import { removeFriend } from "@/features/friends/friends.api";
import { useFriendProfile } from "@/features/friends/friends.hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders a selected friend's profile within the shared atmosphere. */
export function FriendProfileScreen({ friendId }: { friendId: string | undefined }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const router = useRouter();
  const profile = useFriendProfile(friendId);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const confirmRemove = () => {
    if (!friendId || !profile.friend) return;
    Alert.alert(
      t("friends.profile.removeTitle"),
      t("friends.profile.removeDescription", { name: profile.friend.friend.displayName }),
      [
        { style: "cancel", text: t("common.cancel") },
        {
          onPress: () => {
            void (async () => {
              setIsRemoving(true);
              try {
                await removeFriend(friendId);
                setShowOptions(false);
                router.replace("/community");
              } catch {
                Alert.alert(t("friends.profile.removeError"), t("profile.tryAgain"));
              } finally {
                setIsRemoving(false);
              }
            })();
          },
          style: "destructive",
          text: t("friends.profile.remove"),
        },
      ],
    );
  };

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("friends.profile.description")}
        onBack={() => router.back()}
        rightAction={
          <IconButton accessibilityLabel={t("friends.profile.optionsLabel")} onPress={() => setShowOptions(true)}>
            <Feather
              accessible={false}
              color={theme.colors.icon.primary}
              name="more-horizontal"
              size={theme.sizes.iconMedium}
            />
          </IconButton>
        }
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

          <View style={styles.stats}>
            <ProfileStat label={t("friends.totalRosaries")} value={profile.friend.rosaryTotal.toLocaleString(locale)} />
            {profile.friend.rosaryStreak ? (
              <ProfileStat
                label={t("friends.dayStreak")}
                value={profile.friend.rosaryStreak.currentStreak.toLocaleString(locale)}
              />
            ) : null}
            <ProfileStat label={t("friends.badges")} value={profile.friend.badges.length.toLocaleString(locale)} />
          </View>

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

/** Renders FriendOptionsModal with styles resolved from the active appearance. */
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
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <Card padding="md" style={styles.optionsCard} variant="elevated">
          <Text accessibilityRole="header" style={[styles.optionsTitle, { marginBottom: theme.spacing[3] }]}>
            {t("friends.profile.friendOptions")}
          </Text>
          <Button fullWidth onPress={onClose} variant="secondary" style={{ marginBottom: theme.spacing[3] }}>
            {t("friends.profile.view")}
          </Button>
          <Button fullWidth onPress={onCompare} variant="outline" style={{ marginBottom: theme.spacing[3] }}>
            {t("friends.compare.title")}
          </Button>
          <Button
            fullWidth
            loading={isRemoving}
            onPress={onRemove}
            variant="danger"
            style={{ marginBottom: theme.spacing[3] }}
          >
            {t("friends.profile.remove")}
          </Button>
          <Button fullWidth onPress={onClose} variant="ghost">
            {t("common.cancel")}
          </Button>
        </Card>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
  optionsCard: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing[3],
    maxWidth: 560,
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
}));
