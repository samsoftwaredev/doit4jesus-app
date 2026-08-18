import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type CompareStatsRowProps = {
  friendValue: number;
  label: string;
  userValue: number;
};

export function CompareStatsRow({ friendValue, label, userValue }: CompareStatsRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.value, userValue > friendValue && styles.leading]}>{userValue}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, friendValue > userValue && styles.leading]}>{friendValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    flex: 1,
    textAlign: "center",
  },
  leading: {
    color: theme.colors.text.warning,
  },
  row: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget + theme.spacing[2],
  },
  value: {
    ...theme.typography.bodyMedium,
    flex: 1,
    textAlign: "center",
  },
});
