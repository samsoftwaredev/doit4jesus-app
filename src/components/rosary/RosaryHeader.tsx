import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

export function RosaryHeader() {
  return (
    <View accessibilityRole="header" style={styles.header}>
      <View style={styles.rule} />
      <View style={styles.titleWrap}>
        <Text style={styles.eyebrow}>A MOMENT OF PRAYER</Text>
        <Text style={styles.title}>iRosary</Text>
      </View>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
    justifyContent: "center",
    paddingBottom: theme.spacing[3],
    paddingTop: theme.spacing[2],
  },
  rule: {
    backgroundColor: theme.rosary.colors.goldMuted,
    height: theme.borderWidths.hairline,
    maxWidth: theme.spacing[16],
    opacity: theme.opacity.muted,
    width: "18%",
  },
  titleWrap: {
    alignItems: "center",
  },
  eyebrow: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    fontSize: theme.fontSizes.xs,
    letterSpacing: theme.letterSpacing.widest,
  },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    fontSize: theme.fontSizes["3xl"],
    lineHeight: theme.lineHeights["3xl"],
    marginTop: theme.spacing[0.5],
  },
});
