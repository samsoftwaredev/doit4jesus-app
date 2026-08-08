import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

interface RosaryHeaderProps {
  onOpenGarden?: () => void;
}

export function RosaryHeader({ onOpenGarden }: RosaryHeaderProps) {
  return (
    <View accessibilityRole="header" style={styles.header}>
      <View style={styles.rule} />
      <View style={styles.titleWrap}>
        <Text style={styles.eyebrow}>A MOMENT OF PRAYER</Text>
        <Text style={styles.title}>iRosary</Text>
      </View>
      <View style={styles.rule} />
      {onOpenGarden ? (
        <Pressable
          accessibilityHint="Opens your monthly Rosary Garden."
          accessibilityLabel="Open Rosary Garden"
          accessibilityRole="button"
          hitSlop={theme.spacing[2]}
          onPress={onOpenGarden}
          style={({ pressed }) => [styles.gardenButton, pressed && styles.pressed]}
          testID="open-rosary-garden"
        >
          <Feather accessible={false} color={theme.rosary.colors.goldBright} name="calendar" size={theme.sizes.iconSmall} />
        </Pressable>
      ) : null}
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
  gardenButton: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: "rgba(230, 186, 100, 0.72)",
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing[0],
    width: theme.sizes.touchTarget,
  },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.96 }] },
});
