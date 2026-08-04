// src/theme/tokens.ts

import { Platform, TextStyle, ViewStyle } from "react-native";

/**
 * DoIt4Jesus global design tokens
 *
 * Visual direction:
 * - Deep blue-black application background
 * - Navy navigation and card surfaces
 * - Cool blue borders
 * - Teal and green accents
 * - High-contrast white headings
 * - Muted blue-gray secondary text
 */
export const colors = {
  background: {
    /**
     * Main application canvas.
     * Closest dominant color from the reference dashboard.
     */
    primary: "#0B1A26",

    /**
     * Alternate page section background.
     */
    secondary: "#0C2336",

    /**
     * Elevated background behind cards and overlays.
     */
    elevated: "#102D45",

    /**
     * Darkest background for overlays and navigation framing.
     */
    deep: "#07131D",

    /**
     * Transparent dark overlay for modals and drawers.
     */
    overlay: "rgba(4, 13, 21, 0.78)",
  },

  surface: {
    /**
     * Default dashboard card.
     */
    primary: "#163A57",

    /**
     * Sidebar and emphasized card surface.
     */
    secondary: "#1A4263",

    /**
     * Darker inset areas.
     */
    tertiary: "#102D45",

    /**
     * Main sidebar color from the reference.
     */
    sidebar: "#1B4262",

    /**
     * Header and navigation background.
     */
    navigation: "#0B1A26",

    /**
     * Blue card surface.
     */
    navy: "#0a1e3090",

    /**
     * Deeper blue card surface.
     */
    navyDeep: "#0D2F4A",

    /**
     * Selected or highlighted green surface.
     */
    green: "#144D3D",

    /**
     * Green-blue surface used in hero gradients.
     */
    teal: "#124B48",

    /**
     * Red semantic surface.
     */
    burgundy: "#4B2735",

    /**
     * Purple semantic surface.
     */
    purple: "#343353",

    /**
     * Translucent elevated panel.
     */
    glass: "rgba(21, 59, 91, 0.88)",
  },

  /**
   * Primary brand colors.
   */
  brand: {
    primary: "#4B9B73",
    primaryLight: "#72C58D",
    primaryDark: "#245E48",

    secondary: "#3B85B5",
    secondaryLight: "#70B4DD",
    secondaryDark: "#1C5277",
  },

  /**
   * Accent colors used in badges, charts, active states, and metrics.
   */
  accent: {
    green: "#69C47C",
    greenLight: "#8BD797",
    greenDark: "#245D46",

    teal: "#3B9B91",
    tealLight: "#72C7BC",
    tealDark: "#15544F",

    blue: "#3B8AC4",
    blueLight: "#6AB4E3",
    blueDark: "#174E78",

    cyan: "#65B6D8",

    red: "#C55E65",
    redLight: "#E18489",
    redDark: "#67313B",

    amber: "#DEA646",
    amberLight: "#F1C46A",
    amberDark: "#745424",

    purple: "#8476B6",
    purpleLight: "#A99CD3",
    purpleDark: "#464064",
  },

  /**
   * Semantic feedback colors.
   */
  semantic: {
    success: "#69C47C",
    successSurface: "#174D3A",
    successBorder: "#2C7656",

    warning: "#DEA646",
    warningSurface: "#594520",
    warningBorder: "#8C6A2F",

    danger: "#C55E65",
    dangerSurface: "#562D38",
    dangerBorder: "#81414D",

    info: "#62A9D6",
    infoSurface: "#1C4E70",
    infoBorder: "#39779E",

    disabled: "#526675",
  },

  /**
   * Text hierarchy.
   */
  text: {
    /**
     * Main headings and metric values.
     */
    primary: "#F4F7F8",

    /**
     * Navigation labels and supporting text.
     */
    secondary: "#C0CDD5",

    /**
     * Descriptions, placeholders, and metadata.
     */
    muted: "#91A4B2",

    /**
     * Least prominent readable text.
     */
    subtle: "#718695",

    /**
     * Text rendered over light backgrounds.
     */
    inverse: "#08141E",

    /**
     * Pure white for maximum emphasis.
     */
    white: "#FFFFFF",

    /**
     * Disabled text.
     */
    disabled: "#667987",

    /**
     * Interactive link color.
     */
    link: "#72C58D",

    /**
     * Text used on green active states.
     */
    success: "#7CD48D",

    warning: "#F1C46A",
    danger: "#E18489",
    info: "#79BDE5",
  },

  /**
   * Borders and dividers.
   */
  border: {
    /**
     * Very subtle separators.
     */
    subtle: "#173246",

    /**
     * Default card border.
     */
    default: "#315A78",

    /**
     * More visible panel border.
     */
    strong: "#477494",

    /**
     * Input and interactive outline.
     */
    interactive: "#4C7895",

    /**
     * Keyboard and input focus state.
     */
    focus: "#72C58D",

    /**
     * Green selected border.
     */
    success: "#397B58",

    danger: "#914B57",
    warning: "#987338",
    info: "#4E8CB5",
  },

  /**
   * Icon colors.
   */
  icon: {
    primary: "#E7EEF2",
    secondary: "#B7C8D3",
    muted: "#8398A6",
    active: "#72C58D",
    inverse: "#08141E",
  },

  /**
   * Chart colors derived from the dashboard metric tiles.
   */
  chart: {
    green: "#43A557",
    amber: "#D99A2F",
    red: "#D64C42",
    blue: "#2789D5",
    grid: "#365066",
    axis: "#678091",
  },

  /**
   * Badge styles used by dashboard labels.
   */
  badge: {
    successBackground: "#1D5943",
    successText: "#7DD28A",

    warningBackground: "#574827",
    warningText: "#F0C265",

    infoBackground: "#20557C",
    infoText: "#8AC7E9",

    dangerBackground: "#513743",
    dangerText: "#E49398",

    neutralBackground: "#29475D",
    neutralText: "#C5D2D9",
  },

  transparent: "transparent",
  black: "#000000",
  white: "#FFFFFF",

  /**
   * Compatibility aliases for components that still reference the previous
   * medieval token structure.
   *
   * These can be removed once all components use brand, accent, and border.
   */
  gold: {
    pale: "#F1C46A",
    light: "#DEA646",
    primary: "#C58E38",
    strong: "#987038",
    dark: "#574827",
    shadow: "#332A19",
  },

  bronze: {
    light: "#987038",
    primary: "#745424",
    dark: "#47371F",
  },
} as const;

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  "2xl": 24,
  pill: 999,
} as const;

const hairlineWidth = Platform.select({
  ios: 0.5,
  android: 1,
  default: 1,
});

export const borderWidths = {
  hairline: hairlineWidth,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

/**
 * React Native's StyleSheet.hairlineWidth cannot be accessed before importing
 * StyleSheet. A stable fractional value works predictably for tokens.
 */
function getHairlineWidth(): number {
  return Platform.select({
    ios: 0.5,
    android: 1,
    default: 1,
  });
}

const StyleSheetHairlineWidth = getHairlineWidth();

export const fontFamilies = {
  display: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),

  heading: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),

  body: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),

  bodyMedium: Platform.select({
    ios: "System",
    android: "sans-serif-medium",
    default: "System",
  }),

  bodySemibold: Platform.select({
    ios: "System",
    android: "sans-serif-medium",
    default: "System",
  }),

  monospace: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }),
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 44,
} as const;

export const lineHeights = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
  "2xl": 32,
  "3xl": 38,
  "4xl": 44,
  "5xl": 52,
} as const;

export const letterSpacing = {
  tight: -0.4,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
} as const satisfies Record<string, TextStyle["fontWeight"]>;

export const typography = {
  displayLarge: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes["5xl"],
    lineHeight: lineHeights["5xl"],
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
    color: colors.text.primary,
  },

  displayMedium: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes["4xl"],
    lineHeight: lineHeights["4xl"],
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
    color: colors.text.primary,
  },

  heading1: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes["3xl"],
    lineHeight: lineHeights["3xl"],
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.tight,
    color: colors.text.primary,
  },

  heading2: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes["2xl"],
    lineHeight: lineHeights["2xl"],
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },

  heading3: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },

  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.regular,
    color: colors.text.primary,
  },

  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
    color: colors.text.primary,
  },

  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
    color: colors.text.secondary,
  },

  label: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    color: colors.text.secondary,
  },

  labelSmall: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    color: colors.text.secondary,
  },

  button: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacing.wide,
    color: colors.text.primary,
  },

  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.regular,
    color: colors.text.muted,
  },

  metric: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
} as const satisfies Record<string, TextStyle>;

export const shadows = {
  none: {} satisfies ViewStyle,

  small: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }),

  medium: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 8,
    },
    android: {
      elevation: 5,
    },
    default: {},
  }),

  large: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 16,
    },
    android: {
      elevation: 10,
    },
    default: {},
  }),

  focus: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.brand.primaryLight,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.28,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),

  /**
   * Backward-compatible name for components created with the previous tokens.
   */
  goldGlow: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.accent.amber,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.22,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
} as const;

export const opacity = {
  invisible: 0,
  disabled: 0.42,
  muted: 0.64,
  secondary: 0.78,
  pressed: 0.84,
  hover: 0.92,
  full: 1,
} as const;

export const sizes = {
  touchTarget: 44,

  buttonHeightSmall: 36,
  buttonHeight: 44,
  buttonHeightLarge: 52,

  inputHeightSmall: 36,
  inputHeight: 44,
  inputHeightLarge: 52,

  iconXs: 14,
  iconSmall: 18,
  iconMedium: 22,
  iconLarge: 28,
  iconHero: 40,
  iconXL: 80,

  badge: 20,

  headerHeight: 72,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 72,
  bottomNavigationHeight: 68,

  cardMinWidth: 220,
  contentMaxWidth: 1200,
} as const;

export const breakpoints = {
  tablet: 768,
  desktop: 1024,
} as const;

export const zIndex = {
  base: 0,
  card: 10,
  sticky: 100,
  dropdown: 200,
  drawer: 300,
  modalBackdrop: 400,
  modal: 500,
  toast: 600,
  tooltip: 700,
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  borderWidths,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  fontWeights,
  typography,
  shadows,
  opacity,
  sizes,
  breakpoints,
  zIndex,
} as const;

export type AppTheme = typeof theme;
export type ThemeColors = typeof colors;
