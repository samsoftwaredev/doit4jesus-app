import Feather from "@expo/vector-icons/Feather";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type BackHeaderProps = {
  onBack?: () => void;
  rightAction?: ReactNode;
  title: string;
};

/** A centered screen header for feature routes that need a back action. */
export function BackHeader({ onBack, rightAction, title }: BackHeaderProps) {
  const styles = useThemedStyles(styleSheet);
  const { isLargeText } = useResponsiveLayout();

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
      <Text accessibilityRole="header" numberOfLines={isLargeText ? undefined : 2} style={styles.title}>
        {title}
      </Text>
      <View style={[styles.side, styles.rightAction]}>{rightAction}</View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
    flex: 1,
    minWidth: 0,
    paddingHorizontal: theme.spacing[2],
    textAlign: "center",
  },
}));
