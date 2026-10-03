import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocales } from "expo-localization";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { i18n } from "@/localization/i18n";
import { logDevelopmentError } from "@/lib/development-logger";

export const APP_LANGUAGE_PREFERENCE_STORAGE_KEY = "@doit4jesus/language-preference:v1";

export type SupportedLanguage = "en" | "es";
export type AppLocale = "en-US" | "es-419";

export type AppLanguageContextValue = {
  isHydrated: boolean;
  language: SupportedLanguage;
  locale: AppLocale;
  preference: SupportedLanguage | null;
  setAccountPreference: (language: SupportedLanguage) => Promise<void>;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
};

const localeByLanguage: Record<SupportedLanguage, AppLocale> = {
  en: "en-US",
  es: "es-419",
};

/** Accepts only the two explicit language choices supported by this release. */
export function parseLanguagePreference(value: string | null): SupportedLanguage | null {
  return value === "en" || value === "es" ? value : null;
}

/** Resolves an explicit preference before a supported device language and otherwise uses English. */
export function resolveAppLanguage(
  preference: SupportedLanguage | null,
  deviceLanguageCode: string | null | undefined,
): SupportedLanguage {
  if (preference) return preference;
  if (deviceLanguageCode?.toLowerCase() === "es") return "es";
  return "en";
}

const defaultContextValue: AppLanguageContextValue = {
  isHydrated: true,
  language: "en",
  locale: "en-US",
  preference: null,
  setAccountPreference: async () => undefined,
  setLanguage: async () => undefined,
};

const AppLanguageContext = createContext<AppLanguageContextValue>(defaultContextValue);

/** Hydrates the local language choice and follows the device locale until local or account preference is available. */
export function AppLanguageProvider({ children }: PropsWithChildren) {
  const locales = useLocales();
  const [preference, setPreference] = useState<SupportedLanguage | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const preferenceRef = useRef<SupportedLanguage | null>(null);

  useEffect(() => {
    let isMounted = true;

    /** Reads a trusted preference without allowing storage failures to block startup. */
    async function hydrateLanguage() {
      let nextPreference: SupportedLanguage | null = null;
      try {
        nextPreference = parseLanguagePreference(await AsyncStorage.getItem(APP_LANGUAGE_PREFERENCE_STORAGE_KEY));
      } catch (error) {
        logDevelopmentError("loading the app language preference", error);
        nextPreference = null;
      }

      if (!isMounted) return;
      preferenceRef.current = nextPreference;
      setPreference(nextPreference);
      setIsHydrated(true);
    }

    void hydrateLanguage();
    return () => {
      isMounted = false;
    };
  }, []);

  const language = resolveAppLanguage(preference, locales[0]?.languageCode);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  /** Applies an explicit language immediately and persists it on a best-effort basis. */
  const setLanguage = useCallback(async (nextLanguage: SupportedLanguage) => {
    preferenceRef.current = nextLanguage;
    setPreference(nextLanguage);
    try {
      await AsyncStorage.setItem(APP_LANGUAGE_PREFERENCE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      logDevelopmentError("saving the app language preference", error);
      // The active session still honors the selection when storage is unavailable.
    }
  }, []);

  /**
   * Uses an authenticated account preference only when this device has no explicit choice.
   * The restored preference is persisted locally so it remains available while offline.
   */
  const setAccountPreference = useCallback(async (nextLanguage: SupportedLanguage) => {
    if (preferenceRef.current) return;

    preferenceRef.current = nextLanguage;
    setPreference(nextLanguage);
    try {
      await AsyncStorage.setItem(APP_LANGUAGE_PREFERENCE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      logDevelopmentError("saving the account language preference", error);
      // The account preference still applies during this session when storage is unavailable.
    }
  }, []);

  const value = useMemo<AppLanguageContextValue>(
    () => ({
      isHydrated,
      language,
      locale: localeByLanguage[language],
      preference,
      setAccountPreference,
      setLanguage,
    }),
    [isHydrated, language, preference, setAccountPreference, setLanguage],
  );

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

/** Returns the resolved language, formatting locale, hydration state, and persistence control. */
export function useAppLanguage(): AppLanguageContextValue {
  return useContext(AppLanguageContext);
}
