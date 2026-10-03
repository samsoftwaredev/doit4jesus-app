import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme, setActiveAppTheme, type AppTheme } from "@/theme/tokens";
import { logDevelopmentError } from "@/lib/development-logger";

export const APP_THEME_PREFERENCE_STORAGE_KEY = "@doit4jesus/theme-preference:v1";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedColorScheme = "light" | "dark";

export type AppThemeContextValue = {
  colorScheme: ResolvedColorScheme;
  isHydrated: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  theme: AppTheme;
};

/** Resolves a persisted value to a supported preference without trusting storage contents. */
export function parseThemePreference(value: string | null): ThemePreference {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    /** Reads the local preference while tolerating unavailable or corrupted storage. */
    async function hydratePreference() {
      let nextPreference: ThemePreference = "system";
      try {
        nextPreference = parseThemePreference(await AsyncStorage.getItem(APP_THEME_PREFERENCE_STORAGE_KEY));
      } catch (error) {
        logDevelopmentError("loading the appearance preference", error);
        nextPreference = "system";
      }

      if (!isMounted) return;
      setStoredPreference(nextPreference);
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

  const colorScheme = resolveColorScheme(preference, systemColorScheme);
  const theme = colorScheme === "light" ? lightTheme : darkTheme;
  setActiveAppTheme(theme);
  const value = useMemo<AppThemeContextValue>(
    () => ({ colorScheme, isHydrated, preference, setPreference, theme }),
    [colorScheme, isHydrated, preference, setPreference, theme],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

/** Returns the active palette, stored preference, resolved scheme, and hydration controls. */
export function useAppTheme(): AppThemeContextValue {
  return useContext(AppThemeContext);
}
