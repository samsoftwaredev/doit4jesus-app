import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

interface ScriptureCardProps {
  reference?: string;
  quotation?: string;
}

export function ScriptureCard({ reference, quotation }: ScriptureCardProps) {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(21, 49, 67, 0.9)",
    borderColor: "rgba(230, 186, 100, 0.28)",
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
    color: theme.colors.text.white,
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
});
