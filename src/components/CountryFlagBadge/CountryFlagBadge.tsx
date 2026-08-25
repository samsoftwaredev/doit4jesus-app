import { Image } from "expo-image";
import type { ImageStyle, StyleProp } from "react-native";
import { StyleSheet } from "react-native";

import { getCountryFlagSource } from "./countryFlagAssets";

interface CountryFlagBadgeProps {
  countryCode?: string | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function CountryFlagBadge({
  countryCode,
  size = 18,
  style,
}: CountryFlagBadgeProps) {
  const source = getCountryFlagSource(countryCode);

  if (!source) return null;

  return (
    <Image
      accessible={false}
      contentFit="cover"
      source={source}
      style={[
        styles.flag,
        { height: size, width: Math.round(size * 1.5) },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  flag: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 3,
    borderWidth: 1,
  },
});
