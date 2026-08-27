import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { CountryFlagBadge } from "@/components/CountryFlagBadge";
import { theme } from "@/theme/tokens";

type PrayerIntentionAvatarProps = {
  countryCode?: string | null;
  displayName: string;
  size?: number;
  source?: string | null;
};

const defaultAvatar = require("../../assets/avatar/knight.png");

export function PrayerIntentionAvatar({ countryCode, displayName, size = 38, source }: PrayerIntentionAvatarProps) {
  const initial = displayName.trim().slice(0, 1).toUpperCase() || "?";
  const flagSize = Math.max(12, Math.round(size * 0.35));

  return (
    <View
      accessibilityLabel={`${displayName}'s avatar`}
      accessible
      style={[styles.wrap, { height: size, width: size }]}
    >
      {source ? (
        <Image
          accessible={false}
          contentFit="cover"
          source={source}
          style={[styles.avatar, { height: size, width: size }]}
        />
      ) : defaultAvatar ? (
        <Image
          accessible={false}
          contentFit="cover"
          source={defaultAvatar}
          style={[styles.avatar, { height: size, width: size }]}
        />
      ) : (
        <View style={[styles.fallback, { height: size, width: size }]}>
          <Text style={styles.initial}>{initial}</Text>
        </View>
      )}
      <CountryFlagBadge countryCode={countryCode} size={flagSize} style={styles.flag} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
  },
  fallback: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.teal,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    justifyContent: "center",
  },
  flag: { bottom: -2, position: "absolute", right: -4 },
  initial: { ...theme.typography.bodyMedium, color: theme.colors.text.white },
  wrap: { position: "relative" },
});
