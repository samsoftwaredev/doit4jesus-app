import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { useAppTheme } from "@/theme/AppThemeProvider";
import { darkTheme, getActiveAppTheme, getActiveTextScale, lightTheme, type AppTheme } from "@/theme/tokens";

type NamedStyles = Record<string, ImageStyle | TextStyle | ViewStyle>;
type ThemedFactory<T> = (theme: AppTheme) => T;

const lightColorByDarkColor = new Map<string, string>();
const textScales = [1, 1.1, 1.2, 1.3] as const;
type StyleScaleVariants = Map<number, NamedStyles>;
const themedStyleVariants = new WeakMap<object, { dark: StyleScaleVariants; light: StyleScaleVariants }>();

/** Pairs every dark semantic leaf with the matching light semantic leaf. */
function indexPalettePairs(darkValue: unknown, lightValue: unknown): void {
  if (typeof darkValue === "string" && typeof lightValue === "string") {
    lightColorByDarkColor.set(darkValue.toLowerCase(), lightValue);
    return;
  }

  if (!darkValue || !lightValue || typeof darkValue !== "object" || typeof lightValue !== "object") return;

  for (const key of Object.keys(darkValue)) {
    indexPalettePairs((darkValue as Record<string, unknown>)[key], (lightValue as Record<string, unknown>)[key]);
  }
}

indexPalettePairs(darkTheme.colors, lightTheme.colors);
indexPalettePairs(darkTheme.rosary.colors, lightTheme.rosary.colors);

const lightOverrides = new Map<string, string>([
  ["#0b1a26", lightTheme.colors.background.primary],
  ["#07131d", lightTheme.colors.background.deep],
  ["#72c58d", lightTheme.colors.text.link],
  ["#071b2a", lightTheme.rosary.colors.canvas],
  ["#193c52", lightTheme.colors.surface.tertiary],
  ["#123d43", lightTheme.colors.surface.green],
  ["#d0e0d9", lightTheme.colors.text.secondary],
  ["#d3e2dd", lightTheme.colors.text.secondary],
  ["#5d5989", lightTheme.colors.accent.purple],
  ["#75aaff", lightTheme.colors.border.info],
  ["#b5c0c7", "#4F606C"],
  ["#657783", "#647482"],
  ["#d4dee3", "#405261"],
  ["#77c98b", "#2F7A59"],
  ["#3f855c", "#2F7A59"],
  ["#94d7a3", "#205E43"],
  ["#e17a7a", "#A43B46"],
  ["#9b4d58", "#A43B46"],
  ["#eda0a0", "#8B2F39"],
  ["#eaa1ad", "#9A4D61"],
  ["#a55d70", "#9A4D61"],
  ["#f2bbc4", "#7D3548"],
  ["#b198d7", "#66518B"],
  ["#715a9c", "#66518B"],
  ["#c6b4e5", "#493967"],
  ["#b99858", "#8A6425"],
  ["#f6d891", "#684814"],
  ["rgba(157, 174, 183, 0.16)", "rgba(64, 82, 97, 0.08)"],
  ["rgba(91, 177, 112, 0.18)", "rgba(47, 122, 89, 0.1)"],
  ["rgba(198, 82, 95, 0.18)", "rgba(164, 59, 70, 0.1)"],
  ["rgba(215, 120, 140, 0.18)", "rgba(154, 77, 97, 0.1)"],
  ["rgba(132, 99, 185, 0.2)", "rgba(102, 81, 139, 0.1)"],
  ["rgba(241, 196, 106, 0.16)", "rgba(138, 100, 37, 0.1)"],
  ["rgba(7, 19, 29, 0.56)", "rgba(255, 253, 248, 0.82)"],
  ["rgba(7, 26, 42, 0.38)", "rgba(237, 226, 209, 0.62)"],
  ["rgba(7, 26, 42, 0.62)", "rgba(255, 253, 248, 0.88)"],
  ["rgba(7, 26, 42, 0.76)", "rgba(255, 253, 248, 0.94)"],
  ["rgba(8, 31, 47, 0.64)", "rgba(255, 249, 240, 0.94)"],
  ["rgba(9, 31, 42, 0.42)", "rgba(237, 226, 209, 0.72)"],
  ["rgba(10, 38, 55, 0.92)", "rgba(255, 253, 248, 0.96)"],
  ["rgba(14, 44, 60, 0.92)", "rgba(255, 253, 248, 0.96)"],
  ["rgba(15, 42, 62, 0.82)", "rgba(255, 253, 248, 0.9)"],
  ["rgba(20, 57, 70, 0.8)", "rgba(221, 236, 227, 0.92)"],
  ["rgba(21, 49, 67, 0.9)", "rgba(255, 253, 248, 0.96)"],
  ["rgba(62, 45, 36, 0.92)", "rgba(255, 249, 240, 0.96)"],
  ["rgba(86, 45, 56, 0.36)", "rgba(245, 224, 225, 0.72)"],
  ["rgba(197, 94, 101, 0.14)", "rgba(164, 59, 70, 0.1)"],
  ["rgba(230, 186, 100, 0.08)", "rgba(138, 100, 37, 0.08)"],
  ["rgba(230, 186, 100, 0.12)", "rgba(138, 100, 37, 0.1)"],
  ["rgba(230, 186, 100, 0.14)", "rgba(138, 100, 37, 0.1)"],
  ["rgba(230, 186, 100, 0.05)", "rgba(118, 83, 31, 0.05)"],
  ["rgba(230, 186, 100, 0.18)", "rgba(118, 83, 31, 0.1)"],
  ["rgba(230, 186, 100, 0.22)", "rgba(118, 83, 31, 0.12)"],
  ["rgba(230, 186, 100, 0.25)", "rgba(118, 83, 31, 0.18)"],
  ["rgba(230, 186, 100, 0.28)", "rgba(118, 83, 31, 0.28)"],
  ["rgba(230, 186, 100, 0.32)", "rgba(118, 83, 31, 0.32)"],
  ["rgba(230, 186, 100, 0.34)", "rgba(118, 83, 31, 0.34)"],
  ["rgba(230, 186, 100, 0.35)", "rgba(118, 83, 31, 0.35)"],
  ["rgba(230, 186, 100, 0.36)", "rgba(118, 83, 31, 0.36)"],
  ["rgba(230, 186, 100, 0.38)", "rgba(118, 83, 31, 0.38)"],
  ["rgba(230, 186, 100, 0.45)", "rgba(118, 83, 31, 0.45)"],
  ["rgba(230, 186, 100, 0.48)", "rgba(118, 83, 31, 0.48)"],
  ["rgba(230, 186, 100, 0.5)", "rgba(118, 83, 31, 0.5)"],
  ["rgba(230, 186, 100, 0.55)", "rgba(118, 83, 31, 0.55)"],
  ["rgba(230, 186, 100, 0.62)", "rgba(118, 83, 31, 0.62)"],
  ["rgba(230, 186, 100, 0.68)", "rgba(118, 83, 31, 0.68)"],
  ["rgba(241, 196, 106, 0.12)", "rgba(118, 83, 31, 0.12)"],
  ["rgba(241, 196, 106, 0.42)", "rgba(118, 83, 31, 0.42)"],
  ["rgba(241, 196, 106, 0.5)", "rgba(118, 83, 31, 0.5)"],
  ["rgba(241, 196, 106, 0.56)", "rgba(118, 83, 31, 0.56)"],
  ["rgba(241, 196, 106, 0.8)", "rgba(118, 83, 31, 0.8)"],
  ["rgba(255, 224, 154, 0.85)", "rgba(118, 83, 31, 0.72)"],
  ["rgba(197, 142, 56, 0.09)", "rgba(138, 100, 37, 0.09)"],
  ["rgba(197, 142, 56, 0.1)", "rgba(138, 100, 37, 0.1)"],
  ["rgba(222, 166, 70, 0.08)", "rgba(138, 100, 37, 0.08)"],
  ["rgba(7, 19, 29, 0.68)", "rgba(255, 253, 248, 0.88)"],
  ["rgba(7, 19, 29, 0.72)", "rgba(255, 253, 248, 0.9)"],
  ["rgba(7, 19, 29, 0.78)", "rgba(255, 253, 248, 0.92)"],
  ["rgba(7, 19, 29, 0.88)", "rgba(255, 253, 248, 0.96)"],
  ["rgba(7, 16, 27, 0.78)", "rgba(255, 253, 248, 0.94)"],
  ["rgba(8, 20, 30, 0.24)", "rgba(237, 226, 209, 0.54)"],
  ["rgba(13, 47, 74, 0.32)", "rgba(237, 226, 209, 0.58)"],
  ["rgba(98, 71, 29, 0.4)", "rgba(242, 229, 200, 0.72)"],
  ["rgba(72, 129, 154, 0.74)", "rgba(90, 129, 155, 0.74)"],
  ["rgba(105, 196, 124, 0.12)", "rgba(47, 122, 89, 0.1)"],
  ["rgba(132, 118, 182, 0.12)", "rgba(102, 81, 139, 0.09)"],
  ["rgba(231, 238, 242, 0.1)", "rgba(19, 37, 54, 0.06)"],
  ["rgba(231, 238, 242, 0.16)", "rgba(19, 37, 54, 0.09)"],
  ["rgba(255,255,255,0.07)", "rgba(19, 37, 54, 0.05)"],
  ["rgba(255,255,255,0.08)", "rgba(19, 37, 54, 0.05)"],
  ["rgba(255, 255, 255, 0.28)", "rgba(19, 37, 54, 0.14)"],
  ["rgba(255, 255, 255, 0.55)", "rgba(19, 37, 54, 0.28)"],
]);

/** Rewrites color leaves while preserving React Native style arrays and transforms. */
function mapStyleValue(value: unknown): unknown {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    return lightOverrides.get(normalized) ?? lightColorByDarkColor.get(normalized) ?? value;
  }
  if (Array.isArray(value)) return value.map(mapStyleValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, mapStyleValue(child)]));
}

/** Multiplies only text metrics so layout spacing, artwork, icons, and touch targets remain stable. */
function scaleTextMetrics(value: unknown, scale: number, property?: string): unknown {
  if (typeof value === "number" && (property === "fontSize" || property === "lineHeight")) {
    return value * scale;
  }
  if (Array.isArray(value)) return value.map((child) => scaleTextMetrics(child, scale));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, scaleTextMetrics(child, scale, key)]));
}

/** Creates native style sheets for every supported bounded text multiplier. */
function createScaleVariants<T extends NamedStyles>(definitions: T): StyleScaleVariants {
  return new Map(textScales.map((scale) => [scale, StyleSheet.create(scaleTextMetrics(definitions, scale) as T)]));
}

/** Creates cached dark and light configuration values from a theme factory or legacy dark value. */
export function createThemedValue<T extends object>(valueOrFactory: T | ThemedFactory<T>): T {
  const isFactory = typeof valueOrFactory === "function";
  const darkValue = isFactory ? (valueOrFactory as ThemedFactory<T>)(darkTheme) : valueOrFactory;
  const lightValue = isFactory ? (valueOrFactory as ThemedFactory<T>)(lightTheme) : (mapStyleValue(darkValue) as T);
  return new Proxy(darkValue, {
    get(target, property: string | symbol) {
      const selectedValue = getActiveAppTheme() === lightTheme ? lightValue : target;
      return Reflect.get(selectedValue, property);
    },
  });
}

/**
 * Creates and caches dark and light React Native style sheets. Theme factories
 * build exact variants; legacy dark objects continue to use palette mapping.
 */
export function createThemedStyles<T extends NamedStyles>(stylesOrFactory: T | ThemedFactory<T>): T {
  const isFactory = typeof stylesOrFactory === "function";
  const darkDefinitions = isFactory ? (stylesOrFactory as ThemedFactory<T>)(darkTheme) : stylesOrFactory;
  const lightDefinitions = isFactory
    ? (stylesOrFactory as ThemedFactory<T>)(lightTheme)
    : (mapStyleValue(darkDefinitions) as T);
  const darkStyles = createScaleVariants(darkDefinitions);
  const lightStyles = createScaleVariants(lightDefinitions);

  const baselineDarkStyles = darkStyles.get(1) as T;
  const styleSheet = new Proxy(baselineDarkStyles, {
    get(target, property: string | symbol) {
      const paletteVariants = getActiveAppTheme() === lightTheme ? lightStyles : darkStyles;
      const selectedStyles = paletteVariants.get(getActiveTextScale()) ?? target;
      return Reflect.get(selectedStyles, property);
    },
  }) as T;

  themedStyleVariants.set(styleSheet, { dark: darkStyles, light: lightStyles });
  return styleSheet;
}

/**
 * Resolves a cached style sheet through React context so render compilers can
 * observe and invalidate styles when the selected appearance changes.
 */
export function useThemedStyles<T extends NamedStyles>(styleSheet: T): T {
  const { colorScheme, textScale } = useAppTheme();
  const variants = themedStyleVariants.get(styleSheet);

  if (!variants) return styleSheet;
  return (variants[colorScheme].get(textScale) ?? variants[colorScheme].get(1)) as T;
}
