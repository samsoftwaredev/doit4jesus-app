import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "react-native-reanimated";

import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { resolveBadgeArtwork } from "./badge-assets";
import type { EarnedBadge } from "./progress.types";

type EarnedBadgeRowProps = {
  badge: EarnedBadge;
  isLast: boolean;
};

const badgeIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  FIRST_ROSARY: "cross",
  ROSARY_STREAK_7: "fire",
  ROSARY_STREAK_30: "crown",
};

/** Formats a valid earned timestamp for the active locale or returns the supplied fallback. */
function formatEarnedDate(earnedAt: string, locale: string, unavailable: string) {
  const date = new Date(earnedAt);
  if (Number.isNaN(date.getTime())) return unavailable;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Selects a stable glyph fallback for badge codes without usable artwork. */
function getBadgeIcon(code: string): keyof typeof MaterialCommunityIcons.glyphMap {
  if (badgeIcons[code]) return badgeIcons[code];
  if (code.includes("STREAK")) return "fire";
  if (code.includes("ROSARY")) return "cross";
  return "shield-cross";
}

/** Renders an earned badge with remote artwork and a code-based icon fallback. */
export function EarnedBadgeRow({ badge, isLast }: EarnedBadgeRowProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const reduceMotion = useReducedMotion();
  const styles = useThemedStyles(styleSheet);
  const [failedArtworkKey, setFailedArtworkKey] = useState<string | null>(null);
  const earnedDate = formatEarnedDate(badge.earnedAt, locale, t("progress.dateUnavailable"));
  const artwork = resolveBadgeArtwork(badge.code, badge.iconUrl);
  const artworkKey = typeof artwork === "number" ? String(artwork) : (artwork?.uri ?? badge.code);
  const shouldShowArtwork = artwork !== null && artworkKey !== failedArtworkKey;
  const accessibilityLabel = t("progress.badges.earnedLabel", {
    date: earnedDate,
    description: badge.description,
    name: badge.name,
  });

  /** Marks only the currently resolved artwork URL as failed so later URLs can retry. */
  const handleArtworkError = useCallback(() => {
    setFailedArtworkKey(artworkKey);
  }, [artworkKey]);

  return (
    <View accessibilityLabel={accessibilityLabel} style={[styles.row, !isLast && styles.rowDivider]}>
      <View accessible={false} style={styles.iconContainer}>
        {shouldShowArtwork && artwork ? (
          <Image
            accessible={false}
            cachePolicy="memory-disk"
            contentFit="contain"
            onError={handleArtworkError}
            source={artwork}
            style={styles.badgeImage}
            testID={`badge-artwork-${badge.id}`}
            transition={reduceMotion ? 0 : 150}
          />
        ) : (
          <MaterialCommunityIcons
            accessible={false}
            color={theme.rosary.colors.gold}
            name={getBadgeIcon(badge.code)}
            size={theme.sizes.iconMedium}
            testID={`badge-icon-fallback-${badge.id}`}
          />
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{badge.name}</Text>
        <Text style={styles.description}>{badge.description}</Text>
      </View>
      <Text style={styles.date}>{earnedDate}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  badgeImage: {
    height: "100%",
    width: "100%",
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
    overflow: "hidden",
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
}));
