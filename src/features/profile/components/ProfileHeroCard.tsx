import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CurrentUserProfile } from "@/features/profile";
import { findSaintAvatar, saintAvatars } from "@/features/profile/saints";
import { theme } from "@/theme/tokens";

type ProfileHeroCardProps = {
  location: string;
  onAvatarPress: () => void;
  profile: CurrentUserProfile;
};

export function ProfileHeroCard({ location, onAvatarPress, profile }: ProfileHeroCardProps) {
  const selectedSaint = findSaintAvatar(profile.saintAvatarId);
  const avatarSource = selectedSaint?.image ?? profile.avatarUrl ?? saintAvatars[8].image;

  return (
    <View style={styles.card}>
      <View pointerEvents="none" style={styles.glow} />
      <Pressable
        accessibilityLabel="Change profile avatar"
        accessibilityRole="button"
        hitSlop={theme.spacing[1]}
        onPress={onAvatarPress}
        style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
      >
        <View style={styles.avatarRing}>
          <Image accessible={false} contentFit="cover" source={avatarSource} style={styles.avatar} />
        </View>
        <View pointerEvents="none" style={styles.editBadge}>
          <Feather accessible={false} color={theme.colors.text.inverse} name="edit-2" size={theme.sizes.iconXs} />
        </View>
      </Pressable>

      <Text accessibilityRole="header" style={styles.name}>
        {profile.displayName}
      </Text>
      <View style={styles.locationRow}>
        <Feather accessible={false} color={theme.colors.gold.pale} name="map-pin" size={theme.sizes.iconXs} />
        <Text numberOfLines={1} style={styles.location}>
          {location}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="Change profile avatar"
        accessibilityRole="button"
        onPress={onAvatarPress}
        style={({ pressed }) => [styles.changeAvatar, pressed && styles.pressed]}
      >
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: "100%",
    width: "100%",
  },
  avatarButton: {
    height: 124,
    marginTop: theme.spacing[1],
    position: "relative",
    width: 124,
  },
  avatarRing: {
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: 112,
    overflow: "hidden",
    padding: theme.spacing[1],
    width: 112,
  },
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    marginTop: theme.spacing[2],
    overflow: "hidden",
    padding: theme.spacing[5],
    ...theme.shadows.small,
  },
  changeAvatar: {
    marginTop: theme.spacing[4],
    minHeight: theme.sizes.touchTarget,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[3],
  },
  changeAvatarText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gold.pale,
  },
  editBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.gold.pale,
    borderColor: theme.colors.background.deep,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    bottom: theme.spacing[2],
    height: theme.spacing[8],
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing[0],
    width: theme.spacing[8],
  },
  glow: {
    backgroundColor: "rgba(222, 166, 70, 0.08)",
    borderRadius: theme.radii.pill,
    height: 230,
    position: "absolute",
    right: -90,
    top: -112,
    width: 230,
  },
  location: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    flexShrink: 1,
    marginLeft: theme.spacing[1],
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: theme.spacing[2],
    maxWidth: "100%",
  },
  name: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
});
