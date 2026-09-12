import type { ReactNode } from "react";
import { useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export type IconButtonTone = "neutral" | "accent" | "danger";

export interface IconButtonProps extends Omit<
  PressableProps,
  "accessibilityLabel" | "children" | "disabled" | "style"
> {
  accessibilityLabel: string;
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: NonNullable<PressableProps["onPress"]>;
  style?: StyleProp<ViewStyle>;
  tone?: IconButtonTone;
}

/** Renders a theme-aware icon-only action with consistent sizing and interaction states. */
export function IconButton({
  accessibilityLabel,
  children,
  disabled = false,
  loading = false,
  onPress,
  style,
  tone = "neutral",
  ...pressableProps
}: IconButtonProps) {
  const styles = useThemedStyles(styleSheet);
  const [focused, setFocused] = useState(false);
  const unavailable = disabled || loading;

  return (
    <Pressable
      {...pressableProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: unavailable }}
      disabled={unavailable}
      hitSlop={theme.spacing[2]}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={unavailable ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "accent" && styles.accent,
        tone === "danger" && styles.danger,
        focused && styles.focused,
        unavailable && styles.disabled,
        pressed && !unavailable && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={theme.colors.icon.primary} size="small" /> : children}
    </Pressable>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  accent: {
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.colors.border.interactive,
  },
  danger: {
    backgroundColor: theme.colors.semantic.dangerSurface,
    borderColor: theme.colors.semantic.dangerBorder,
  },
  disabled: { opacity: theme.opacity.disabled },
  focused: {
    borderColor: theme.colors.border.focus,
    ...theme.shadows.focus,
  },
  pressed: {
    opacity: theme.opacity.pressed,
    transform: [{ scale: 0.98 }],
  },
}));
