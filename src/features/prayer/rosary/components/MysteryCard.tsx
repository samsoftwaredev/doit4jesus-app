import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { RosaryMystery } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

interface MysteryCardProps {
  mystery?: RosaryMystery;
}

/**
 * Renders the current mystery's title and category while its devotional artwork appears behind the Rosary page.
 */
export function MysteryCard({ mystery }: MysteryCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  if (!mystery) {
    return (
      <View accessibilityLabel={t("rosary.cards.noMysteryLabel")} style={styles.card}>
        <Text style={styles.emptyTitle}>{t("rosary.cards.noMystery")}</Text>
        <Text style={styles.emptyCopy}>{t("rosary.cards.noMysteryCopy")}</Text>
      </View>
    );
  }

  return (
    <View key={mystery.id} style={styles.card}>
      <Text style={styles.label}>{t("rosary.cards.currentMystery")}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {mystery.title}
      </Text>
      <Text style={styles.category}>{mystery.category}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    overflow: "hidden",
    padding: theme.spacing[4],
    ...theme.shadows.medium,
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    letterSpacing: theme.letterSpacing.widest,
  },
  title: {
    ...theme.typography.heading2,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[1],
  },
  category: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
    marginTop: theme.spacing[0.5],
  },
  emptyTitle: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.immersivePrimary,
  },
  emptyCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
    marginTop: theme.spacing[1],
  },
}));
