import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type SettingsSectionProps = PropsWithChildren<{
  title: string;
}>;

/** Renders this feature with colors from the currently resolved app appearance. */
export function SettingsSection({ children, title }: SettingsSectionProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
}));
