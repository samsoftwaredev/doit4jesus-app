import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { CountryFlagBadge } from "@/components/CountryFlagBadge";
import { theme } from "@/theme/tokens";

type FriendAvatarProps = {
  accessibilityLabel: string;
  countryCode?: string | null;
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

export function FriendAvatar({
  accessibilityLabel,
  countryCode,
  name,
  size = "md",
  source,
}: FriendAvatarProps) {
  const avatarSize = sizeByVariant[size];
  const flagSize = Math.max(14, Math.round(avatarSize * 0.42));
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessible
      style={[styles.container, { height: avatarSize, width: avatarSize }]}
    >
      {source ? (
        <Image
          accessible={false}
          contentFit="cover"
          source={source}
          style={[styles.image, { height: avatarSize, width: avatarSize }]}
        />
      ) : (
        <View style={[styles.fallback, { height: avatarSize, width: avatarSize }]}>
          <Text style={styles.initial}>{initial}</Text>
        </View>
      )}
      <CountryFlagBadge
        countryCode={countryCode}
        size={flagSize}
        style={styles.flag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  fallback: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.teal,
    borderColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
  },
  flag: {
    bottom: -2,
    position: "absolute",
    right: -4,
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
