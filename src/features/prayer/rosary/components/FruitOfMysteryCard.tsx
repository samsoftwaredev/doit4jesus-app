import Feather from "@expo/vector-icons/Feather";
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
  const visibleFruit = fruit?.trim() || "Fruit unavailable";
  const visibleDescription = description?.trim() || "A reflection for this mystery is not available.";

  return (
    <View accessibilityLabel={`Fruit of the mystery. ${visibleFruit}. ${visibleDescription}`} style={styles.card}>
      <View style={styles.labelRow}>
        <Feather accessible={false} color={theme.rosary.colors.gold} name="heart" size={theme.sizes.iconSmall} />
        <Text style={styles.label}>FRUIT OF THE MYSTERY</Text>
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
    backgroundColor: "rgba(62, 45, 36, 0.92)",
    borderColor: "rgba(230, 186, 100, 0.38)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
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
    color: theme.rosary.colors.gold,
    flexShrink: 1,
    letterSpacing: theme.letterSpacing.widest,
  },
  fruit: {
    ...theme.typography.heading3,
    color: theme.colors.text.white,
    marginTop: theme.spacing[2],
  },
  description: {
    ...theme.typography.body,
    color: theme.rosary.colors.scripture,
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
    marginTop: theme.spacing[2],
  },
}));
