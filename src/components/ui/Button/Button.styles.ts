import type { ViewStyle } from "react-native";

import { createThemedStyles, createThemedValue } from "@/theme/createThemedStyles";

import type { ButtonSize, ButtonVariant } from "./Button.types";

type ButtonVariantConfig = {
  activityIndicatorColor: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export const buttonVariantConfig = createThemedValue(
  (theme) =>
    ({
      primary: {
        activityIndicatorColor: theme.colors.text.white,
        backgroundColor: theme.colors.accent.blue,
        borderColor: theme.colors.accent.blue,
        textColor: theme.colors.text.white,
      },
      secondary: {
        activityIndicatorColor: theme.colors.text.primary,
        backgroundColor: theme.colors.surface.secondary,
        borderColor: theme.colors.border.default,
        textColor: theme.colors.text.primary,
      },
      success: {
        activityIndicatorColor: theme.colors.text.white,
        backgroundColor: theme.colors.semantic.success,
        borderColor: theme.colors.semantic.success,
        textColor: theme.colors.text.white,
      },
      danger: {
        activityIndicatorColor: theme.colors.text.white,
        backgroundColor: theme.colors.semantic.danger,
        borderColor: theme.colors.semantic.danger,
        textColor: theme.colors.text.white,
      },
      warning: {
        activityIndicatorColor: theme.colors.text.inverse,
        backgroundColor: theme.colors.semantic.warning,
        borderColor: theme.colors.semantic.warning,
        textColor: theme.colors.text.inverse,
      },
      info: {
        activityIndicatorColor: theme.colors.text.white,
        backgroundColor: theme.colors.semantic.info,
        borderColor: theme.colors.semantic.info,
        textColor: theme.colors.text.white,
      },
      outline: {
        activityIndicatorColor: theme.colors.semantic.success,
        backgroundColor: theme.colors.transparent,
        borderColor: theme.colors.semantic.success,
        textColor: theme.colors.semantic.success,
      },
      ghost: {
        activityIndicatorColor: theme.colors.text.link,
        backgroundColor: theme.colors.transparent,
        borderColor: theme.colors.transparent,
        textColor: theme.colors.text.link,
      },
    }) as const satisfies Record<ButtonVariant, ButtonVariantConfig>,
);

const buttonContentSizeStyles = createThemedStyles((theme) => ({
  sm: {
    gap: theme.spacing[1.5],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  md: {
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2.5],
  },
  lg: {
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
  },
})) satisfies Record<ButtonSize, ViewStyle>;

export const buttonSizeConfig = {
  sm: {
    contentStyle: buttonContentSizeStyles.sm,
  },
  md: {
    contentStyle: buttonContentSizeStyles.md,
  },
  lg: {
    contentStyle: buttonContentSizeStyles.lg,
  },
} as const satisfies Record<ButtonSize, { contentStyle: ViewStyle }>;

export const styles = createThemedStyles((theme) => ({
  button: {
    alignSelf: "flex-start",
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    minWidth: theme.spacing[0],
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  pressed: {
    opacity: theme.opacity.pressed,
    transform: [{ scale: 0.98 }],
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 1,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  label: {
    flexShrink: 1,
    textAlign: "center",
  },
}));
