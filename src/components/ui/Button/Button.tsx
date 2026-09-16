import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";

import { buttonSizeConfig, buttonVariantConfig, styles as styleSheet } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

/** Renders an accessible, theme-aware button whose centered content fills any assigned height. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  contentStyle,
  textStyle,
  accessibilityLabel,
  accessibilityState,
  accessibilityRole: _accessibilityRole,
  onPress,
  testID,
  ...pressableProps
}: ButtonProps) {
  const styles = useThemedStyles(styleSheet);
  const isUnavailable = disabled || loading;
  const variantConfig = buttonVariantConfig[variant];
  const sizeConfig = buttonSizeConfig[size];
  const isTextLabel = typeof children === "string" || typeof children === "number";
  const defaultAccessibilityLabel = isTextLabel ? String(children) : undefined;

  return (
    <Pressable
      {...pressableProps}
      accessibilityLabel={accessibilityLabel ?? defaultAccessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, busy: loading, disabled: isUnavailable }}
      disabled={isUnavailable}
      onPress={isUnavailable ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantConfig.backgroundColor,
          borderColor: variantConfig.borderColor,
        },
        style,
        fullWidth && styles.fullWidth,
        isUnavailable && styles.disabled,
        pressed && !isUnavailable && styles.pressed,
      ]}
      testID={testID}
    >
      <View style={[styles.content, sizeConfig.contentStyle, contentStyle]}>
        {loading ? <ActivityIndicator color={variantConfig.activityIndicatorColor} size="small" /> : null}
        {!loading ? leftIcon : null}
        {isTextLabel ? (
          <Text style={[styles.label, { color: variantConfig.textColor }, textStyle]}>{children}</Text>
        ) : (
          children
        )}
        {!loading ? rightIcon : null}
      </View>
    </Pressable>
  );
}
