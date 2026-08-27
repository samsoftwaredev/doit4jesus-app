import { Image } from "expo-image";
import type { ImageProps } from "expo-image";
import type { ImageStyle, StyleProp, TextStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";

import { CountryFlagBadge } from "@/components/CountryFlagBadge";
import { theme } from "@/theme/tokens";

type AvatarWithCountryBadgeProps = {
  accessibilityLabel: string;
  borderColor?: string;
  borderWidth?: number;
  countryCode?: string | null;
  fallbackBackgroundColor?: string;
  fallbackSource?: ImageProps["source"];
  flagSize?: number;
  flagStyle?: StyleProp<ImageStyle>;
  initialTextStyle?: StyleProp<TextStyle>;
  name: string;
  size: number;
  source?: ImageProps["source"] | null;
};

/**
 * Shared identity primitive for avatars that optionally display a country flag.
 * Domain components can keep their own size and visual tokens without duplicating
 * the image, fallback, and flag-badge behavior.
 */
export function AvatarWithCountryBadge({
  accessibilityLabel,
  borderColor = theme.colors.brand.primaryLight,
  borderWidth = theme.borderWidths.thin,
  countryCode,
  fallbackBackgroundColor = theme.colors.surface.teal,
  fallbackSource,
  flagSize,
  flagStyle,
  initialTextStyle,
  name,
  size,
  source,
}: AvatarWithCountryBadgeProps) {
  const imageSource = source ?? fallbackSource;
  const countryFlagSize = flagSize ?? Math.max(14, Math.round(size * 0.42));
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";
  const avatarStyle = {
    borderColor,
    borderRadius: theme.radii.pill,
    borderWidth,
    height: size,
    width: size,
  } as const;

  return (
    <View accessibilityLabel={accessibilityLabel} accessible style={[styles.container, { height: size, width: size }]}>
      {imageSource ? (
        <Image accessible={false} contentFit="cover" source={imageSource} style={avatarStyle} />
      ) : (
        <View style={[styles.fallback, avatarStyle, { backgroundColor: fallbackBackgroundColor }]}>
          <Text style={[styles.initial, initialTextStyle]}>{initial}</Text>
        </View>
      )}
      <CountryFlagBadge countryCode={countryCode} size={countryFlagSize} style={[styles.flag, flagStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  fallback: { alignItems: "center", justifyContent: "center" },
  flag: { bottom: -2, position: "absolute", right: -4 },
  initial: { ...theme.typography.bodyMedium, color: theme.colors.text.white },
});
