import Feather from "@expo/vector-icons/Feather";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type BackHeaderProps = {
  onBack?: () => void;
  rightAction?: ReactNode;
  title: string;
};

/** A centered screen header for feature routes that need a back action. */
export function BackHeader({ onBack, rightAction, title }: BackHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={theme.spacing[2]}
            onPress={onBack}
            style={styles.iconButton}
          >
            <Feather color={theme.colors.icon.primary} name="chevron-left" size={theme.sizes.iconMedium} />
          </Pressable>
        ) : null}
      </View>
      <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <View style={[styles.side, styles.rightAction]}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: theme.sizes.touchTarget + theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
  },
  iconButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  rightAction: { alignItems: "flex-end" },
  side: { minWidth: theme.sizes.touchTarget },
  title: {
    ...theme.typography.heading3,
    left: 0,
    position: "absolute",
    right: 0,
    textAlign: "center",
  },
});
