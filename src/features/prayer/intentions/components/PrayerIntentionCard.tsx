import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { getPrayerIntentionTheme } from "@/features/prayer/intentions/data/prayerIntentionTheme";
import type { ApprovedPrayerIntention } from "@/features/prayer/intentions/data/prayerIntentions.types";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { PrayerIntentionAvatar } from "./PrayerIntentionAvatar";

type PrayerIntentionCardProps = {
  intention: ApprovedPrayerIntention;
  onPress: () => void;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function PrayerIntentionCard({ intention, onPress }: PrayerIntentionCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const { isLargeText } = useResponsiveLayout();
  const intentionTheme = getPrayerIntentionTheme(intention.symbol, colorScheme);
  return (
    <Pressable
      accessibilityLabel={t("intentions.openLabel", {
        name: intention.creator.displayName,
        title: intention.title,
      })}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isLargeText && styles.cardLargeText,
        { backgroundColor: intentionTheme.surface, borderColor: intentionTheme.surfaceLight },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <PrayerIntentionAvatar
          countryCode={intention.creator.countryCode}
          displayName={intention.creator.displayName}
          source={intention.creator.avatarUrl}
        />
        <View style={[styles.symbol, { borderColor: intentionTheme.surfaceLight }]}>
          <Feather
            accessible={false}
            color={theme.rosary.colors.goldBright}
            name={intentionTheme.icon}
            size={theme.sizes.iconSmall}
          />
        </View>
      </View>
      <Text numberOfLines={isLargeText ? undefined : 2} style={styles.title}>
        {intention.title}
      </Text>
      <Text numberOfLines={isLargeText ? undefined : 3} style={styles.description}>
        {intention.description}
      </Text>
      <Text numberOfLines={1} style={styles.creator}>
        {intention.creator.displayName}
      </Text>
    </Pressable>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    minHeight: 178,
    padding: theme.spacing[3],
    width: 142,
  },
  cardLargeText: { minHeight: 240, width: 220 },
  creator: {
    ...theme.typography.caption,
    color: theme.rosary.colors.goldBright,
    marginTop: "auto",
    paddingTop: theme.spacing[2],
  },
  description: { ...theme.typography.caption, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.98 }] },
  symbol: {
    alignItems: "center",
    backgroundColor: "rgba(7, 26, 42, 0.38)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.spacing[7],
    justifyContent: "center",
    width: theme.spacing[7],
  },
  title: { ...theme.typography.bodyMedium, color: theme.colors.text.white, marginTop: theme.spacing[3] },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
}));
