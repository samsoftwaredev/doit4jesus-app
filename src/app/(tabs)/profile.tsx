import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import type { CurrentUserProfile } from "@/features/profile";
import { fetchCurrentUserProfile } from "@/features/profile";
import { theme } from "@/theme/tokens";

const profileItems = [
  { icon: "book-open", label: "Saved verses" },
  { icon: "bell", label: "Prayer reminders" },
  { icon: "settings", label: "Settings" },
] as const;

export default function ProfileScreen() {
  const [profile, setProfile] = useState<CurrentUserProfile>();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string>();

  const loadProfile = useCallback(async () => {
    setProfileError(undefined);
    setIsLoadingProfile(true);

    try {
      setProfile(await fetchCurrentUserProfile());
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Unable to load the profile.",
      );
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const profileInitial = profile?.displayName.slice(0, 1).toUpperCase() ?? "Y";

  return (
    <ScreenShell
      eyebrow="YOUR JOURNEY"
      title="Profile"
      subtitle="Keep showing up. Small steps become a faithful life."
    >
      <Card
        headerRight={
          <Feather
            color={theme.colors.icon.secondary}
            name="edit-2"
            size={theme.sizes.iconSmall}
          />
        }
        subtitle={profile?.title ?? "Your faith journey"}
        title={profile?.displayName ?? "Your profile"}
        variant="elevated"
      >
        {isLoadingProfile ? (
          <View style={styles.profileState}>
            <ActivityIndicator color={theme.colors.brand.primaryLight} />
            <Text style={styles.profileCaption}>
              Loading your faith journey.
            </Text>
          </View>
        ) : null}

        {profileError ? (
          <View style={styles.profileState}>
            <Text style={styles.profileCaption}>{profileError}</Text>
            <Button
              onPress={() => void loadProfile()}
              size="sm"
              variant="secondary"
            >
              Retry
            </Button>
          </View>
        ) : null}

        {profile && !isLoadingProfile && !profileError ? (
          <View style={styles.profileRow}>
            {profile.avatarUrl ? (
              <Image
                accessibilityLabel={`${profile.displayName}'s profile picture`}
                contentFit="cover"
                source={profile.avatarUrl}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{profileInitial}</Text>
              </View>
            )}
            <View style={styles.profileCopy}>
              <Text
                style={styles.profileUsername}
              >{`@${profile.username}`}</Text>
              <Text style={styles.profileCaption}>{profile.title}</Text>
              <Text style={styles.profileMetadata}>{profile.timezone}</Text>
            </View>
          </View>
        ) : null}
      </Card>

      <View style={styles.statsGrid}>
        <Card padding="sm" title="Day streak" variant="success">
          <Text style={styles.statValue}>7</Text>
        </Card>
        <Card padding="sm" title="Prayers shared" variant="info">
          <Text style={styles.statValue}>12</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <Card
        footer={
          <Button fullWidth onPress={() => undefined} variant="ghost">
            Manage profile
          </Button>
        }
        padding="none"
        title="Preferences"
      >
        <View style={styles.list}>
          {profileItems.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.listItem,
                index < profileItems.length - 1 && styles.listDivider,
              ]}
            >
              <View style={styles.listIcon}>
                <Feather
                  color={theme.colors.icon.secondary}
                  name={item.icon}
                  size={theme.sizes.iconSmall}
                />
              </View>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Feather
                color={theme.colors.icon.muted}
                name="chevron-right"
                size={theme.sizes.iconMedium}
              />
            </View>
          ))}
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  profileState: {
    alignItems: "center",
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[3],
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.teal,
    borderRadius: theme.radii.pill,
    height: theme.sizes.iconHero,
    justifyContent: "center",
    width: theme.sizes.iconHero,
  },
  avatarImage: {
    borderColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.iconHero + theme.spacing[4],
    width: theme.sizes.iconHero + theme.spacing[4],
  },
  avatarInitial: {
    ...theme.typography.heading3,
    color: theme.colors.text.white,
  },
  profileCaption: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  profileCopy: {
    flex: 1,
    gap: theme.spacing[1],
    marginLeft: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  profileUsername: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  profileMetadata: {
    ...theme.typography.caption,
    color: theme.colors.text.subtle,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  statValue: {
    ...theme.typography.metric,
  },
  sectionTitle: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[7],
  },
  list: {
    paddingHorizontal: theme.spacing[4],
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing[3],
  },
  listDivider: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
  },
  listIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.sm,
    height: theme.sizes.iconMedium + theme.spacing[2],
    justifyContent: "center",
    width: theme.sizes.iconMedium + theme.spacing[2],
  },
  listLabel: {
    ...theme.typography.bodyMedium,
    flex: 1,
    marginHorizontal: theme.spacing[3],
  },
});
