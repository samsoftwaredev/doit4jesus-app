import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import type { EarnedBadge } from "./progress.types";
import { theme } from "@/theme/tokens";

type EarnedBadgeRowProps = {
  badge: EarnedBadge;
  isLast: boolean;
};

const badgeIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  FIRST_ROSARY: "cross",
  ROSARY_STREAK_7: "fire",
  ROSARY_STREAK_30: "crown",
};

function formatEarnedDate(earnedAt: string) {
  const date = new Date(earnedAt);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getBadgeIcon(code: string): keyof typeof MaterialCommunityIcons.glyphMap {
  if (badgeIcons[code]) return badgeIcons[code];
  if (code.includes("STREAK")) return "fire";
  if (code.includes("ROSARY")) return "cross";
  return "shield-cross";
}

function resolveBadgeIconUrl(iconUrl: string | null) {
  if (!iconUrl || /^https?:\/\//i.test(iconUrl)) return iconUrl;

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) return null;

  return new URL(iconUrl, `${apiUrl.replace(/\/$/, "")}/`).toString();
}

export function EarnedBadgeRow({ badge, isLast }: EarnedBadgeRowProps) {
  const earnedDate = formatEarnedDate(badge.earnedAt);
  const iconUrl = resolveBadgeIconUrl(badge.iconUrl);
  const accessibilityLabel = `Badge earned: ${badge.name}. ${badge.description} Earned ${earnedDate}.`;

  return (
    <View accessibilityLabel={accessibilityLabel} style={[styles.row, !isLast && styles.rowDivider]}>
      <View accessible={false} style={styles.iconContainer}>
        {iconUrl ? (
          <Image accessible={false} contentFit="contain" source={{ uri: iconUrl }} style={styles.badgeImage} />
        ) : (
          <MaterialCommunityIcons
            accessible={false}
            color={theme.rosary.colors.gold}
            name={getBadgeIcon(badge.code)}
            size={theme.sizes.iconMedium}
          />
        )}
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.name}>
          {badge.name}
        </Text>
        <Text numberOfLines={2} style={styles.description}>
          {badge.description}
        </Text>
      </View>
      <Text style={styles.date}>{earnedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeImage: {
    height: theme.sizes.iconMedium,
    width: theme.sizes.iconMedium,
  },
  copy: {
    flex: 1,
    minWidth: theme.spacing[0],
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing[2],
    maxWidth: 76,
    textAlign: "right",
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0],
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    height: 48,
    justifyContent: "center",
    marginRight: theme.spacing[3],
    width: 48,
  },
  name: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.bodySemibold,
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
  },
  rowDivider: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
  },
});
