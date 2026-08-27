import type { ComponentProps } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "@/theme/tokens";

interface LiturgicalChipProps {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
}

export function LiturgicalChip({ icon, label, value }: LiturgicalChipProps) {
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={styles.chip}>
      <MaterialCommunityIcons color={theme.colors.gold.light} name={icon} size={15} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    paddingHorizontal: theme.spacing[2.5],
    paddingVertical: theme.spacing[1.5],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing[1],
    textTransform: "uppercase",
  },
  value: { ...theme.typography.label, color: theme.colors.text.primary, marginLeft: theme.spacing[1] },
});
