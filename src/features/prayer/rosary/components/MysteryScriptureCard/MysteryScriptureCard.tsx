import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { RosaryMystery } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

export interface MysteryScriptureCardProps {
  mystery?: RosaryMystery;
}

/** Presents the current mystery within one devotional card; Scripture now lives with the prayer. */
export function MysteryScriptureCard({ mystery }: MysteryScriptureCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const visibleFruit = mystery?.fruit?.trim() || t("rosary.cards.fruitUnavailable");
  const visibleDescription = mystery?.fruitDescription?.trim() || t("rosary.cards.reflectionUnavailable");

  return (
    <View style={styles.card} testID="mystery-scripture-card">
      {mystery ? (
        <View key={mystery.id}>
          <Text style={styles.label}>{t("rosary.cards.currentMystery")}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {mystery.title}
          </Text>
          <Text style={styles.category}>{mystery.category}</Text>
          <View style={styles.fruitDivider} />
          <View
            accessibilityLabel={t("rosary.cards.fruitAccessibilityLabel", {
              description: visibleDescription,
              fruit: visibleFruit,
            })}
            accessible
            testID="mystery-fruit"
          >
            <Text style={styles.label}>{t("rosary.cards.fruitLabel")}</Text>
            <Text style={styles.fruit}>{visibleFruit}</Text>
            <Text style={styles.fruitDescription}>{visibleDescription}</Text>
          </View>
        </View>
      ) : (
        <View accessibilityLabel={t("rosary.cards.noMysteryLabel")}>
          <Text style={styles.emptyTitle}>{t("rosary.cards.noMystery")}</Text>
          <Text style={styles.emptyCopy}>{t("rosary.cards.noMysteryCopy")}</Text>
        </View>
      )}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    minWidth: 0,
    overflow: "hidden",
    padding: theme.spacing[4],
    ...theme.shadows.medium,
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    flexShrink: 1,
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
  fruit: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[1],
  },
  fruitDescription: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
    marginTop: theme.spacing[1],
  },
  fruitDivider: {
    backgroundColor: theme.rosary.colors.goldMuted,
    height: theme.rosary.borderWidths.goldHairline,
    marginVertical: theme.spacing[3],
    opacity: theme.opacity.secondary,
    width: "100%",
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
