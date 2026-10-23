import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { RosaryPrayer } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

interface PrayerCardProps {
  prayer?: RosaryPrayer;
}

/** Renders the complete active prayer at natural height for the page-level Rosary scroll. */
export function PrayerCard({ prayer }: PrayerCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const hasText = Boolean(prayer?.text.trim());

  return (
    <View key={prayer?.id} style={styles.card}>
      <Text style={styles.label}>{prayer?.name?.toUpperCase() ?? t("rosary.cards.prayer").toUpperCase()}</Text>
      {hasText ? (
        <View
          accessibilityLabel={t("rosary.cards.prayerText", { prayer: prayer?.name ?? t("rosary.cards.prayer") })}
          style={styles.prayerBody}
        >
          <Text style={styles.prayerText}>{prayer?.text}</Text>
        </View>
      ) : (
        <View accessibilityLabel={t("rosary.cards.prayerTextUnavailable")} style={styles.emptyPrayer}>
          <Text style={styles.emptyPrayerText}>{t("rosary.cards.prayerTextUnavailableCopy")}</Text>
        </View>
      )}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    letterSpacing: theme.letterSpacing.widest,
  },
  prayerBody: {
    marginTop: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
  prayerText: {
    ...theme.typography.body,
    color: theme.rosary.colors.immersivePrimary,
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
    textAlign: "left",
  },
  emptyPrayer: {
    marginTop: theme.spacing[2],
  },
  emptyPrayerText: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
  },
}));
