import { Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import type { RosaryMystery } from "@/features/prayer/rosary/types";

interface MysteryCardProps {
  mystery?: RosaryMystery;
}

/**
 * Renders the current mystery's title and category while its devotional artwork appears behind the Rosary page.
 */
export function MysteryCard({ mystery }: MysteryCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  if (!mystery) {
    return (
      <View accessibilityLabel={t("rosary.cards.noMysteryLabel")} style={styles.card}>
        <Text style={styles.emptyTitle}>{t("rosary.cards.noMystery")}</Text>
        <Text style={styles.emptyCopy}>{t("rosary.cards.noMysteryCopy")}</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(220)} key={mystery.id} style={styles.card}>
      <Text style={styles.label}>{t("rosary.cards.currentMystery")}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {mystery.title}
      </Text>
      <Text style={styles.category}>{mystery.category}</Text>
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderColor: "rgba(230, 186, 100, 0.48)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
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
