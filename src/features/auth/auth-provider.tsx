import type { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { logDevelopmentError } from "@/lib/development-logger";
import { supabase, supabaseConfigurationError } from "@/lib/supabase";

type AuthContextValue = {
  configurationError: string | null;
  finishPasswordRecovery: () => void;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function readAuthParameters(url: string): URLSearchParams {
  const [urlWithoutFragment, fragment = ""] = url.split("#");
  const query = urlWithoutFragment.split("?")[1] ?? "";
  return new URLSearchParams([query, fragment].filter(Boolean).join("&"));
}

async function restoreSessionFromUrl(url: string): Promise<{
  isPasswordRecovery: boolean;
  session: Session | null;
}> {
  const parameters = readAuthParameters(url);
  const errorDescription = parameters.get("error_description");
  const errorCode = parameters.get("error_code");

  if (errorCode || errorDescription) {
    throw new Error(errorDescription ?? errorCode ?? "Unable to complete authentication.");
  }

  const code = parameters.get("code");
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return {
      isPasswordRecovery: parameters.get("type") === "recovery",
      session: data.session,
    };
  }

  const accessToken = parameters.get("access_token");
  const refreshToken = parameters.get("refresh_token");
  if (!accessToken || !refreshToken) {
    return { isPasswordRecovery: false, session: null };
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) throw error;

  return {
    isPasswordRecovery: parameters.get("type") === "recovery",
    session: data.session,
  };
}

export function createAuthRedirectUrl(path: string): string {
  return Linking.createURL(path);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (supabaseConfigurationError) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const applyAuthUrl = async (url: string) => {
      try {
        const result = await restoreSessionFromUrl(url);
        if (!isMounted || !result.session) return;
        setIsPasswordRecovery(result.isPasswordRecovery);
        setSession(result.session);
      } catch (error) {
        logDevelopmentError("restoring the Supabase session from a deep link", error);
      }
    };

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        logDevelopmentError("restoring the Supabase session", error);
      } else if (isMounted) {
        setSession(data.session);
      }

      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        await applyAuthUrl(initialUrl);
      }

      if (isMounted) setIsLoading(false);
    };

    void initialize();

    const authSubscription = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      } else if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false);
      }
    });
    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      void applyAuthUrl(url);
    });

    return () => {
      isMounted = false;
      authSubscription.data.subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configurationError: supabaseConfigurationError,
      finishPasswordRecovery: () => setIsPasswordRecovery(false),
      isLoading,
      isPasswordRecovery,
      session,
    }),
    [isLoading, isPasswordRecovery, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
