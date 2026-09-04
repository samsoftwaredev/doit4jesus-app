import { Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type CompareStatsRowProps = {
  friendValue: number;
  label: string;
  userValue: number;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function CompareStatsRow({ friendValue, label, userValue }: CompareStatsRowProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.row}>
      <Text style={[styles.value, userValue > friendValue && styles.leading]}>{userValue}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, friendValue > userValue && styles.leading]}>{friendValue}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
}));
