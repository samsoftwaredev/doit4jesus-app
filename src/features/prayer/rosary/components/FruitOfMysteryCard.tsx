import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

interface FruitOfMysteryCardProps {
  description?: string;
  fruit?: string;
}

/** Presents the active mystery's spiritual fruit and a short reflection before the vocal prayer. */
export function FruitOfMysteryCard({ description, fruit }: FruitOfMysteryCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const visibleFruit = fruit?.trim() || t("rosary.cards.fruitUnavailable");
  const visibleDescription = description?.trim() || t("rosary.cards.reflectionUnavailable");

  return (
    <View
      accessibilityLabel={t("rosary.cards.fruitAccessibilityLabel", {
        description: visibleDescription,
        fruit: visibleFruit,
      })}
      style={styles.card}
    >
      <View style={styles.labelRow}>
        <Feather
          accessible={false}
          color={theme.rosary.colors.immersiveGold}
          name="heart"
          size={theme.sizes.iconSmall}
        />
        <Text style={styles.label}>{t("rosary.cards.fruitLabel")}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.fruit}>
        {visibleFruit}
      </Text>
      <Text style={styles.description}>{visibleDescription}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    minWidth: 0,
    padding: theme.spacing[4],
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    flexShrink: 1,
    letterSpacing: theme.letterSpacing.widest,
  },
  fruit: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[2],
  },
  description: {
    ...theme.typography.body,
    color: theme.rosary.colors.immersiveSecondary,
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
    marginTop: theme.spacing[2],
  },
}));
