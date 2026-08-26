import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type SettingsSectionProps = PropsWithChildren<{
  title: string;
}>;

export function SettingsSection({ children, title }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
  },
  section: {
    marginTop: theme.spacing[6],
  },
  title: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    letterSpacing: theme.letterSpacing.widest,
    marginBottom: theme.spacing[2],
    paddingHorizontal: theme.spacing[1],
  },
});
