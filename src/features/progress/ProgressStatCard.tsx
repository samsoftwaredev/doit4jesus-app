import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import { Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export type ProgressStatCardProps = {
  icon: ReactNode;
  label: string;
  suffix?: string;
  value: number | string;
  style?: StyleProp<ViewStyle>;
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function ProgressStatCard({ icon, label, suffix, value, style }: ProgressStatCardProps) {
  const styles = useThemedStyles(styleSheet);
  const accessibilityLabel = `${label}, ${value}${suffix ? ` ${suffix}` : ""}`;

  return (
    <Card
      accessibilityLabel={accessibilityLabel}
      contentStyle={styles.content}
      padding="none"
      style={[styles.card, style]}
      variant="outlined"
    >
      <LinearGradient
        colors={[theme.rosary.colors.card, theme.rosary.colors.cardInset]}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View accessible={false} style={styles.icon}>
          {icon}
        </View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </LinearGradient>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    minHeight: 136,
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
  },
  gradient: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 136,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[3],
  },
  icon: {
    height: theme.sizes.iconLarge,
    justifyContent: "center",
    marginBottom: theme.spacing[1],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    fontSize: 10,
    letterSpacing: theme.letterSpacing.wider,
    textAlign: "center",
  },
  suffix: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0],
    textAlign: "center",
  },
  value: {
    color: theme.rosary.colors.goldBright,
    fontFamily: theme.fontFamilies.devotional,
    fontSize: 32,
    lineHeight: 38,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
}));
