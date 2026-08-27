import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

export type CardVariant = "default" | "elevated" | "outlined" | "success" | "info" | "warning" | "danger";

export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  headerRight?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}
