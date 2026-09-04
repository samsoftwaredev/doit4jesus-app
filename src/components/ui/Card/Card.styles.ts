import type { ViewStyle } from "react-native";

import { createThemedStyles, createThemedValue } from "@/theme/createThemedStyles";

import type { CardPadding, CardVariant } from "./Card.types";

type CardVariantConfig = {
  backgroundColor: string;
  borderColor: string;
  shadow: ViewStyle;
};

export const cardVariantConfig = createThemedValue(
  (theme) =>
    ({
      default: {
        backgroundColor: theme.colors.surface.navy,
        borderColor: theme.colors.border.default,
        shadow: theme.shadows.none,
      },
      elevated: {
        backgroundColor: theme.colors.surface.navy,
        borderColor: theme.colors.border.default,
        shadow: theme.shadows.small,
      },
      outlined: {
        backgroundColor: theme.colors.surface.tertiary,
        borderColor: theme.colors.border.strong,
        shadow: theme.shadows.none,
      },
      success: {
        backgroundColor: theme.colors.surface.navy,
        borderColor: theme.colors.semantic.successBorder,
        shadow: theme.shadows.none,
      },
      info: {
        backgroundColor: theme.colors.surface.navy,
        borderColor: theme.colors.semantic.infoBorder,
        shadow: theme.shadows.none,
      },
      warning: {
        backgroundColor: theme.colors.surface.navy,
        borderColor: theme.colors.semantic.warningBorder,
        shadow: theme.shadows.none,
      },
      danger: {
        backgroundColor: theme.colors.surface.navy,
        borderColor: theme.colors.semantic.dangerBorder,
        shadow: theme.shadows.none,
      },
    }) as const satisfies Record<CardVariant, CardVariantConfig>,
);

export const cardPaddingStyles = createThemedStyles((theme) => ({
  none: {
    padding: theme.spacing[0],
  },
  sm: {
    padding: theme.spacing[3],
  },
  md: {
    padding: theme.spacing[4],
  },
  lg: {
    padding: theme.spacing[6],
  },
})) satisfies Record<CardPadding, object>;

export const styles = createThemedStyles((theme) => ({
  card: {
    alignSelf: "stretch",
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "100%",
    minWidth: theme.spacing[0],
  },
  fullWidth: {
    flexBasis: "100%",
    width: "100%",
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  header: {
    margin: theme.spacing[3],
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
  },
  standardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerCopy: {
    flex: 1,
    margin: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  title: {
    ...theme.typography.heading3,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  headerRight: {
    marginLeft: theme.spacing[3],
  },
  content: {
    flexGrow: 1,
  },
  footer: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
}));
