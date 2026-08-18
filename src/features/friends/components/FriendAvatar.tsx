import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type FriendAvatarProps = {
  accessibilityLabel: string;
  name: string;
  size?: "lg" | "md" | "sm" | "xl";
  source: string | null;
};

const sizeByVariant = {
  lg: theme.sizes.iconLarge,
  md: theme.sizes.iconMedium + theme.spacing[2],
  sm: theme.sizes.iconMedium,
  xl: theme.sizes.iconHero + theme.spacing[8],
} as const;

export function FriendAvatar({ accessibilityLabel, name, size = "md", source }: FriendAvatarProps) {
  const avatarSize = sizeByVariant[size];
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";

  if (source) {
    return (
      <Image
        accessibilityLabel={accessibilityLabel}
        accessible
        contentFit="cover"
        source={source}
        style={[styles.image, { height: avatarSize, width: avatarSize }]}
      />
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} accessible style={[styles.fallback, { height: avatarSize, width: avatarSize }]}>
      <Text style={styles.initial}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.teal,
    borderColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
  },
  image: {
    borderColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
  },
  initial: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.white,
  },
});
