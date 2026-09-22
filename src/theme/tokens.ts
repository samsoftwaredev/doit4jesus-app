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
export const darkColors = {
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

  atmosphere: {
    beamEdge: "rgba(255, 223, 157, 0)",
    beamPrimary: "rgba(255, 226, 169, 0.11)",
    beamSecondary: "rgba(255, 226, 169, 0.08)",
    dustCool: "#D6E7D8",
    dustWarm: "#FFE6A6",
    haze: "rgba(239, 224, 194, 0.035)",
    sunInner: "rgba(255, 225, 169, 0.065)",
    sunMiddle: "rgba(255, 225, 169, 0.04)",
    sunOuter: "rgba(255, 225, 169, 0.025)",
  },
  gradients: {
    onboarding: ["#071824", "#0A2A3A", "#071824"],
    landing: ["rgba(3, 11, 18, 0.75)", "rgba(4, 17, 27, 0.88)", "#07131D"],
    prayerHome: ["#071A2A", "#0B263A", "#071A2A"],
    prayerImage: ["rgba(7, 26, 42, 0.24)", "rgba(7, 26, 42, 0.86)"],
    celebrationHero: ["rgba(29, 62, 91, 0.88)", "rgba(10, 30, 48, 0.98)"],
    intentionImage: ["rgba(7, 26, 42, 0.06)", "rgba(7, 26, 42, 0.78)"],
    garden: ["#071B2A", "#0A2C3A", "#071B2A"],
    holyProgress: ["rgba(23, 53, 73, 0.98)", "rgba(9, 25, 38, 0.98)"],
    mysteryImage: ["rgba(3, 13, 24, 0.22)", "rgba(3, 13, 24, 0.68)", "rgba(3, 13, 24, 0.96)"],
    prayButton: ["#276EEA", "#154FAE"],
    gardenHero: ["#153F4C", "#0F3144", "#0A2338"],
    gardenHeroImage: ["transparent", "rgba(10, 35, 56, 0.94)"],
    leaderboard: ["#142B3E", "#091923"],
    conscience: ["#1D203F", "#111B32", "#24213F"],
    dailyRosary: ["#132C42", "#0B1A26"],
    dailyRosaryComplete: ["#183D35", "#0D2530"],
    dailyRosaryReset: ["#233044", "#111E2D"],
    countdownFinal: ["#573129", "#25191C"],
    countdownHour: ["#614321", "#261C16"],
    countdownDefault: ["#4B3827", "#182331"],
    gardenRays: ["rgba(230, 186, 100, 0.26)", "transparent"],
  },
} as const;

type WidenThemeValues<T> = {
  readonly [Key in keyof T]: T[Key] extends string ? string : WidenThemeValues<T[Key]>;
};

export type ThemeColors = WidenThemeValues<typeof darkColors>;

/** Warm devotional palette used when light appearance is active. */
export const lightColors = {
  background: {
    primary: "#F7F1E6",
    secondary: "#F1E8D9",
    elevated: "#FFFDF8",
    deep: "#EDE2D1",
    overlay: "rgba(19, 37, 54, 0.48)",
  },
  surface: {
    primary: "#FFFDF8",
    secondary: "#FFF9F0",
    tertiary: "#EDE2D1",
    sidebar: "#F1E8D9",
    navigation: "#FFF9F0",
    navy: "rgba(255, 253, 248, 0.94)",
    navyDeep: "#EDE2D1",
    green: "#DDECE3",
    teal: "#DCECE8",
    burgundy: "#F5E0E1",
    purple: "#EAE4F2",
    glass: "rgba(255, 253, 248, 0.92)",
  },
  brand: {
    primary: "#2F7A59",
    primaryLight: "#2F7A59",
    primaryDark: "#20583F",
    secondary: "#2D668C",
    secondaryLight: "#3E7699",
    secondaryDark: "#214E6B",
  },
  accent: {
    green: "#2F7A59",
    greenLight: "#3B8766",
    greenDark: "#20583F",
    teal: "#28746B",
    tealLight: "#397F77",
    tealDark: "#1D554F",
    blue: "#2D668C",
    blueLight: "#3E7699",
    blueDark: "#214E6B",
    cyan: "#2B6E86",
    red: "#A43B46",
    redLight: "#B44B55",
    redDark: "#762A33",
    amber: "#8A6425",
    amberLight: "#9A732F",
    amberDark: "#654817",
    purple: "#66518B",
    purpleLight: "#76639A",
    purpleDark: "#493967",
  },
  semantic: {
    success: "#2F7A59",
    successSurface: "#DDECE3",
    successBorder: "#2F7A59",
    warning: "#8A6425",
    warningSurface: "#F2E5C8",
    warningBorder: "#8A6425",
    danger: "#A43B46",
    dangerSurface: "#F5E0E1",
    dangerBorder: "#A43B46",
    info: "#2D668C",
    infoSurface: "#DDE9F0",
    infoBorder: "#2D668C",
    disabled: "#7D898F",
  },
  text: {
    primary: "#132536",
    secondary: "#405261",
    muted: "#647482",
    subtle: "#65737E",
    inverse: "#FFFDF8",
    white: "#FFFFFF",
    disabled: "#737F86",
    link: "#76531F",
    success: "#205E43",
    warning: "#684814",
    danger: "#8B2F39",
    info: "#235B7E",
  },
  border: {
    subtle: "#E5D8C4",
    default: "#D8C8AF",
    strong: "#BFA986",
    interactive: "#B69B72",
    focus: "#2F7A59",
    success: "#5D8C72",
    danger: "#B65E66",
    warning: "#A98449",
    info: "#5A819B",
  },
  icon: {
    primary: "#243847",
    secondary: "#4F606C",
    muted: "#6B7A84",
    active: "#2F7A59",
    inverse: "#FFFDF8",
  },
  chart: {
    green: "#2F7A59",
    amber: "#8A6425",
    red: "#A43B46",
    blue: "#2D668C",
    grid: "#D8C8AF",
    axis: "#647482",
  },
  badge: {
    successBackground: "#DDECE3",
    successText: "#205E43",
    warningBackground: "#F2E5C8",
    warningText: "#684814",
    infoBackground: "#DDE9F0",
    infoText: "#235B7E",
    dangerBackground: "#F5E0E1",
    dangerText: "#8B2F39",
    neutralBackground: "#E8E0D4",
    neutralText: "#405261",
  },
  transparent: "transparent",
  black: "#000000",
  white: "#FFFFFF",
  gold: {
    pale: "#76531F",
    light: "#8A6425",
    primary: "#8A6425",
    strong: "#76531F",
    dark: "#5F4319",
    shadow: "#D8C8AF",
  },
  bronze: {
    light: "#9A7847",
    primary: "#765A31",
    dark: "#594220",
  },
  atmosphere: {
    beamEdge: "rgba(138, 100, 37, 0)",
    beamPrimary: "rgba(138, 100, 37, 0.045)",
    beamSecondary: "rgba(138, 100, 37, 0.03)",
    dustCool: "rgba(19, 37, 54, 0.42)",
    dustWarm: "rgba(118, 83, 31, 0.5)",
    haze: "rgba(138, 100, 37, 0.025)",
    sunInner: "rgba(230, 186, 100, 0.04)",
    sunMiddle: "rgba(230, 186, 100, 0.025)",
    sunOuter: "rgba(230, 186, 100, 0.015)",
  },
  gradients: {
    onboarding: ["#F7F1E6", "#F1E8D9", "#F7F1E6"],
    landing: ["rgba(247, 241, 230, 0.72)", "rgba(247, 241, 230, 0.9)", "#F7F1E6"],
    prayerHome: ["#F7F1E6", "#EDE2D1", "#F7F1E6"],
    prayerImage: ["rgba(255, 253, 248, 0.18)", "rgba(255, 253, 248, 0.9)"],
    celebrationHero: ["rgba(255, 249, 240, 0.92)", "rgba(237, 226, 209, 0.98)"],
    intentionImage: ["rgba(255, 253, 248, 0.12)", "rgba(255, 253, 248, 0.88)"],
    garden: ["#F7F1E6", "#E8EDDF", "#F7F1E6"],
    holyProgress: ["rgba(255, 253, 248, 0.98)", "rgba(237, 226, 209, 0.98)"],
    mysteryImage: ["rgba(7, 26, 42, 0.18)", "rgba(7, 26, 42, 0.66)", "rgba(7, 26, 42, 0.96)"],
    prayButton: ["#3B8766", "#20583F"],
    gardenHero: ["#E3EEE6", "#DDECE3", "#CFE2D5"],
    gardenHeroImage: ["transparent", "rgba(221, 236, 227, 0.96)"],
    leaderboard: ["#FFFDF8", "#EDE2D1"],
    conscience: ["#F1ECF6", "#FFFDF8", "#EAE4F2"],
    dailyRosary: ["#FFFDF8", "#EDE2D1"],
    dailyRosaryComplete: ["#E3EEE6", "#DDECE3"],
    dailyRosaryReset: ["#F1E8D9", "#EDE2D1"],
    countdownFinal: ["#F5E0E1", "#F7E9E9"],
    countdownHour: ["#F2E5C8", "#F8EDD8"],
    countdownDefault: ["#F1E8D9", "#E8E0D4"],
    gardenRays: ["rgba(138, 100, 37, 0.12)", "transparent"],
  },
} as const satisfies ThemeColors;

/** Backward-compatible name for the unchanged dark palette. */
export const colors = darkColors;

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

export const fontFamilies = {
  devotional: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "Georgia",
  }),

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

const lightTypography = {
  displayLarge: { ...typography.displayLarge, color: lightColors.text.primary },
  displayMedium: { ...typography.displayMedium, color: lightColors.text.primary },
  heading1: { ...typography.heading1, color: lightColors.text.primary },
  heading2: { ...typography.heading2, color: lightColors.text.primary },
  heading3: { ...typography.heading3, color: lightColors.text.primary },
  bodyLarge: { ...typography.bodyLarge, color: lightColors.text.primary },
  body: { ...typography.body, color: lightColors.text.primary },
  bodyMedium: { ...typography.bodyMedium, color: lightColors.text.primary },
  bodySmall: { ...typography.bodySmall, color: lightColors.text.secondary },
  label: { ...typography.label, color: lightColors.text.secondary },
  labelSmall: { ...typography.labelSmall, color: lightColors.text.secondary },
  button: { ...typography.button, color: lightColors.text.primary },
  caption: { ...typography.caption, color: lightColors.text.muted },
  metric: { ...typography.metric, color: lightColors.text.primary },
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

const lightShadows = {
  none: {} satisfies ViewStyle,
  small: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#594220",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }),
  medium: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#594220",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 8,
    },
    android: { elevation: 5 },
    default: {},
  }),
  large: Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#594220",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
    android: { elevation: 10 },
    default: {},
  }),
  focus: Platform.select<ViewStyle>({
    ios: {
      shadowColor: lightColors.brand.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    android: { elevation: 4 },
    default: {},
  }),
  goldGlow: Platform.select<ViewStyle>({
    ios: {
      shadowColor: lightColors.gold.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.14,
      shadowRadius: 6,
    },
    android: { elevation: 4 },
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
  sidebarWidth: 240,
  sidebarCollapsedWidth: 72,
  bottomNavigationHeight: 68,

  cardMinWidth: 220,
  contentMaxWidth: 1200,
} as const;

export const breakpoints = {
  smallPhone: 360,
  largePhone: 480,
  tablet: 768,
  desktop: 1024,
} as const;

/** Tokens shared by devotional surfaces, bead controls, and their restrained motion. */
export const rosaryTokens = {
  colors: {
    canvas: "#071A2A",
    canvasLight: "#0E2D44",
    card: "rgba(15, 42, 62, 0.94)",
    cardInset: "#0B263A",
    pearl: "#F5F0E5",
    pearlShadow: "#BFC6C8",
    gold: "#E6BA64",
    goldBright: "#FFE09A",
    goldMuted: "#987A3E",
    chain: "#B58C42",
    blueMuted: "#55758B",
    scripture: "#C9D7DF",
  },
  borderWidths: {
    goldHairline: hairlineWidth,
    gold: 1,
    goldEmphasis: 2,
  },
  glow: {
    opacity: 0.42,
    radius: 14,
    activeScale: 1.16,
  },
  shadows: {
    activeBead: Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#FFE09A",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.68,
        shadowRadius: 12,
      },
      android: { elevation: 9 },
      default: {},
    }),
  },
} as const;

const lightRosaryTokens = {
  colors: {
    canvas: "#F7F1E6",
    canvasLight: "#FFFDF8",
    card: "rgba(255, 253, 248, 0.96)",
    cardInset: "#EDE2D1",
    pearl: "#F5F0E5",
    pearlShadow: "#A89D8B",
    gold: "#8A6425",
    goldBright: "#76531F",
    goldMuted: "#9B8057",
    chain: "#8A6425",
    blueMuted: "#557083",
    scripture: "#405261",
  },
  borderWidths: rosaryTokens.borderWidths,
  glow: {
    ...rosaryTokens.glow,
    opacity: 0.2,
  },
  shadows: {
    activeBead: Platform.select<ViewStyle>({
      ios: {
        shadowColor: "#8A6425",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 7 },
      default: {},
    }),
  },
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

const structuralTheme = {
  spacing,
  radii,
  borderWidths,
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  fontWeights,
  opacity,
  sizes,
  breakpoints,
  zIndex,
} as const;

/** The existing visual baseline, preserved byte-for-byte for dark appearance. */
export const darkTheme = {
  ...structuralTheme,
  colors: darkColors,
  rosary: rosaryTokens,
  shadows,
  typography,
} as const;

/** Warm ivory, navy, green, and gold palette for light appearance. */
export const lightTheme = {
  ...structuralTheme,
  colors: lightColors,
  rosary: lightRosaryTokens,
  shadows: lightShadows,
  typography: lightTypography,
} as const;

export type AppTheme = typeof darkTheme | typeof lightTheme;

let activeTheme: AppTheme = darkTheme;

/** Updates the compatibility palette used by legacy modules during their incremental migration. */
export function setActiveAppTheme(nextTheme: AppTheme): void {
  activeTheme = nextTheme;
}

/** Returns the currently resolved palette for cached theme-aware styles. */
export function getActiveAppTheme(): AppTheme {
  return activeTheme;
}

/**
 * Backward-compatible live token view. New components should use useAppTheme.
 * Structural values stay shared while color-dependent values follow the provider.
 */
export const theme = new Proxy(darkTheme, {
  get(_target, property: keyof AppTheme) {
    return activeTheme[property];
  },
}) as AppTheme;
