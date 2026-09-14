import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

interface ScriptureCardProps {
  reference?: string;
  quotation?: string;
}

/** Renders Scripture in a devotional card with readable colors for the active appearance. */
export function ScriptureCard({ reference, quotation }: ScriptureCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={`Scripture. ${reference ?? "Reference unavailable"}`} style={styles.card}>
      <View style={styles.labelRow}>
        <Feather accessible={false} color={theme.rosary.colors.gold} name="book-open" size={theme.sizes.iconSmall} />
        <Text style={styles.label}>SCRIPTURE</Text>
      </View>
      <Text style={styles.reference}>{reference || "Scripture reference unavailable"}</Text>
      <View style={styles.divider} />
      <Text style={styles.quotation}>{quotation || "Scripture quotation unavailable."}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.card,
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
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
    letterSpacing: theme.letterSpacing.widest,
  },
  reference: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[2],
  },
  divider: {
    backgroundColor: theme.rosary.colors.goldMuted,
    height: theme.rosary.borderWidths.goldHairline,
    marginVertical: theme.spacing[2],
    opacity: theme.opacity.secondary,
    width: "100%",
  },
  quotation: {
    ...theme.typography.body,
    color: theme.rosary.colors.scripture,
    fontStyle: "italic",
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
  },
}));
