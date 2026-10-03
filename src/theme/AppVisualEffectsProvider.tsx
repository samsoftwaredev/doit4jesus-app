import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { logDevelopmentError } from "@/lib/development-logger";

export const APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY = "@doit4jesus/visual-effects-preference:v1";

export type VisualEffectsPreferences = {
  dustEnabled: boolean;
  lightingEnabled: boolean;
};

export type AppVisualEffectsContextValue = VisualEffectsPreferences & {
  isHydrated: boolean;
  setDustEnabled: (enabled: boolean) => Promise<void>;
  setLightingEnabled: (enabled: boolean) => Promise<void>;
};

const defaultPreferences: VisualEffectsPreferences = {
  dustEnabled: false,
  lightingEnabled: false,
};

/** Safely parses stored visual-effect preferences, preserving disabled defaults for invalid values. */
export function parseVisualEffectsPreferences(value: string | null): VisualEffectsPreferences {
  if (!value) return defaultPreferences;

  try {
    const parsed = JSON.parse(value) as Partial<VisualEffectsPreferences> | null;
    if (!parsed || typeof parsed !== "object") return defaultPreferences;
    return {
      dustEnabled: typeof parsed.dustEnabled === "boolean" ? parsed.dustEnabled : defaultPreferences.dustEnabled,
      lightingEnabled:
        typeof parsed.lightingEnabled === "boolean" ? parsed.lightingEnabled : defaultPreferences.lightingEnabled,
    };
  } catch (error) {
    logDevelopmentError("parsing visual effects preferences", error);
    return defaultPreferences;
  }
}

const defaultContextValue: AppVisualEffectsContextValue = {
  ...defaultPreferences,
  isHydrated: true,
  setDustEnabled: async () => undefined,
  setLightingEnabled: async () => undefined,
};

const AppVisualEffectsContext = createContext<AppVisualEffectsContextValue>(defaultContextValue);

/** Hydrates and persists device-local background lighting and dust preferences. */
export function AppVisualEffectsProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<VisualEffectsPreferences>(defaultPreferences);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    /** Loads saved effects while preserving defaults if device storage is unavailable. */
    async function hydratePreferences() {
      let nextPreferences = defaultPreferences;
      try {
        nextPreferences = parseVisualEffectsPreferences(
          await AsyncStorage.getItem(APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY),
        );
      } catch (error) {
        logDevelopmentError("loading visual effects preferences", error);
        nextPreferences = defaultPreferences;
      }

      if (!isMounted) return;
      setPreferences(nextPreferences);
      setIsHydrated(true);
    }

    void hydratePreferences();
    return () => {
      isMounted = false;
    };
  }, []);

  /** Applies one effect preference immediately and persists the complete preference set when possible. */
  const updatePreference = useCallback(
    async (key: keyof VisualEffectsPreferences, enabled: boolean) => {
      const nextPreferences = { ...preferences, [key]: enabled };
      setPreferences(nextPreferences);
      try {
        await AsyncStorage.setItem(APP_VISUAL_EFFECTS_PREFERENCE_STORAGE_KEY, JSON.stringify(nextPreferences));
      } catch (error) {
        logDevelopmentError("saving visual effects preferences", error);
        // The running app can still respect the change when device storage is unavailable.
      }
    },
    [preferences],
  );

  /** Sets whether foreground dust is rendered throughout the app. */
  const setDustEnabled = useCallback(
    async (enabled: boolean) => updatePreference("dustEnabled", enabled),
    [updatePreference],
  );

  /** Sets whether background sunlight, beams, and haze are rendered throughout the app. */
  const setLightingEnabled = useCallback(
    async (enabled: boolean) => updatePreference("lightingEnabled", enabled),
    [updatePreference],
  );

  const value = useMemo<AppVisualEffectsContextValue>(
    () => ({ ...preferences, isHydrated, setDustEnabled, setLightingEnabled }),
    [isHydrated, preferences, setDustEnabled, setLightingEnabled],
  );

  return <AppVisualEffectsContext.Provider value={value}>{children}</AppVisualEffectsContext.Provider>;
}

/** Returns the hydrated app-wide preferences for decorative background effects. */
export function useAppVisualEffects(): AppVisualEffectsContextValue {
  return useContext(AppVisualEffectsContext);
}
