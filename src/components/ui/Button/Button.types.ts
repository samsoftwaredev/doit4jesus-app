import type { ReactNode } from "react";
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "outline" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "children" | "disabled" | "style"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}
