import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme, setActiveAppTheme, setActiveTextScale, type AppTheme } from "@/theme/tokens";
import { logDevelopmentError } from "@/lib/development-logger";

export const APP_THEME_PREFERENCE_STORAGE_KEY = "@doit4jesus/theme-preference:v1";
export const APP_TEXT_SIZE_PREFERENCE_STORAGE_KEY = "@doit4jesus/text-size-preference:v1";
export const TEXT_SIZE_PREFERENCES = [100, 110, 120, 130] as const;

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedColorScheme = "light" | "dark";
export type TextSizePreference = (typeof TEXT_SIZE_PREFERENCES)[number];

export type AppThemeContextValue = {
  colorScheme: ResolvedColorScheme;
  isHydrated: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  setTextSizePreference: (preference: TextSizePreference) => Promise<void>;
  textScale: number;
  textSizePreference: TextSizePreference;
  theme: AppTheme;
};

/** Resolves a persisted value to a supported preference without trusting storage contents. */
export function parseThemePreference(value: string | null): ThemePreference {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

/** Accepts only the four bounded app text sizes supported by the responsive layout system. */
export function parseTextSizePreference(value: string | null): TextSizePreference {
  const parsed = Number(value);
  return TEXT_SIZE_PREFERENCES.find((preference) => preference === parsed) ?? 100;
}

/** Resolves System or an explicit override to the two palettes supported by the app. */
export function resolveColorScheme(
  preference: ThemePreference,
  systemColorScheme: string | null | undefined,
): ResolvedColorScheme {
  if (preference !== "system") return preference;
  return systemColorScheme === "light" ? "light" : "dark";
}

/** Formats the compact value shown beside Appearance in Profile & Settings. */
export function formatAppearancePreference(preference: ThemePreference, colorScheme: ResolvedColorScheme): string {
  if (preference === "system") return `System (${colorScheme === "light" ? "Light" : "Dark"})`;
  return preference === "light" ? "Light" : "Dark";
}

/** Selects status-bar icon contrast for the resolved application canvas. */
export function getStatusBarStyle(colorScheme: ResolvedColorScheme): "light" | "dark" {
  return colorScheme === "light" ? "dark" : "light";
}

const defaultContextValue: AppThemeContextValue = {
  colorScheme: "dark",
  isHydrated: true,
  preference: "system",
  setPreference: async () => undefined,
  setTextSizePreference: async () => undefined,
  textScale: 1,
  textSizePreference: 100,
  theme: darkTheme,
};

const AppThemeContext = createContext<AppThemeContextValue>(defaultContextValue);

/**
 * Hydrates and persists the device-local appearance preference.
 * Storage errors deliberately fall back to System and never interrupt startup.
 */
export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [preference, setStoredPreference] = useState<ThemePreference>("system");
  const [textSizePreference, setStoredTextSizePreference] = useState<TextSizePreference>(100);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    /** Reads the local preference while tolerating unavailable or corrupted storage. */
    async function hydratePreference() {
      let nextPreference: ThemePreference = "system";
      let nextTextSizePreference: TextSizePreference = 100;
      try {
        nextPreference = parseThemePreference(await AsyncStorage.getItem(APP_THEME_PREFERENCE_STORAGE_KEY));
      } catch (error) {
        logDevelopmentError("loading the appearance preference", error);
        nextPreference = "system";
      }

      try {
        nextTextSizePreference = parseTextSizePreference(
          await AsyncStorage.getItem(APP_TEXT_SIZE_PREFERENCE_STORAGE_KEY),
        );
      } catch (error) {
        logDevelopmentError("loading the text size preference", error);
        nextTextSizePreference = 100;
      }

      if (!isMounted) return;
      setStoredPreference(nextPreference);
      setStoredTextSizePreference(nextTextSizePreference);
      setIsHydrated(true);
    }

    void hydratePreference();
    return () => {
      isMounted = false;
    };
  }, []);

  /** Applies a preference synchronously in memory, then attempts best-effort persistence. */
  const setPreference = useCallback(async (nextPreference: ThemePreference) => {
    setStoredPreference(nextPreference);
    try {
      await AsyncStorage.setItem(APP_THEME_PREFERENCE_STORAGE_KEY, nextPreference);
    } catch (error) {
      logDevelopmentError("saving the appearance preference", error);
      // The active session can still honor the choice when local storage is unavailable.
    }
  }, []);

  /** Applies a bounded text size immediately, then attempts device-local persistence. */
  const setTextSizePreference = useCallback(async (nextPreference: TextSizePreference) => {
    setStoredTextSizePreference(nextPreference);
    try {
      await AsyncStorage.setItem(APP_TEXT_SIZE_PREFERENCE_STORAGE_KEY, String(nextPreference));
    } catch (error) {
      logDevelopmentError("saving the text size preference", error);
      // The active session can still honor the choice when local storage is unavailable.
    }
  }, []);

  const colorScheme = resolveColorScheme(preference, systemColorScheme);
  const theme = colorScheme === "light" ? lightTheme : darkTheme;
  const textScale = textSizePreference / 100;
  setActiveAppTheme(theme);
  setActiveTextScale(textScale);
  const value = useMemo<AppThemeContextValue>(
    () => ({
      colorScheme,
      isHydrated,
      preference,
      setPreference,
      setTextSizePreference,
      textScale,
      textSizePreference,
      theme,
    }),
    [colorScheme, isHydrated, preference, setPreference, setTextSizePreference, textScale, textSizePreference, theme],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

/** Returns the active palette plus device-local appearance and bounded text-size controls. */
export function useAppTheme(): AppThemeContextValue {
  return useContext(AppThemeContext);
}
