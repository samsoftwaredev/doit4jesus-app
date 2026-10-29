import type { Session } from "@supabase/supabase-js";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { APP_CONFIG } from "@/config/app-config";
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
const GOOGLE_AUTH_REDIRECT_URL = `${APP_CONFIG.appUrl}/`;

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

/** Builds a platform-specific callback for email confirmation and password recovery. */
export function createAuthRedirectUrl(path: string): string {
  return Linking.createURL(path);
}

/** Starts Google OAuth in a browser that finishes at the canonical production web app. */
export async function startGoogleOAuth(): Promise<void> {
  if (supabaseConfigurationError) throw new Error(supabaseConfigurationError);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: GOOGLE_AUTH_REDIRECT_URL,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("Google sign-in could not be started.");

  await WebBrowser.openBrowserAsync(data.url);
}

function randomNonce(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

/** Completes native Sign in with Apple using a one-time SHA-256 nonce. */
export async function startAppleSignIn(): Promise<boolean> {
  if (supabaseConfigurationError) throw new Error(supabaseConfigurationError);
  try {
    const rawNonce = randomNonce(await Crypto.getRandomBytesAsync(32));
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
    const credential = await AppleAuthentication.signInAsync({
      nonce: hashedNonce,
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) throw new Error("Apple did not return an identity token.");
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
      nonce: rawNonce,
    });
    if (error) throw error;

    const fullName = [credential.fullName?.givenName, credential.fullName?.familyName].filter(Boolean).join(" ");
    if (fullName) await supabase.auth.updateUser({ data: { full_name: fullName } });
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ERR_REQUEST_CANCELED") return false;
    throw error;
  }
}

/** Requests a fresh Apple authorization code so the API can revoke it before deletion. */
export async function getAppleDeletionAuthorizationCode(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  const usesApple = data.user?.identities?.some((identity) => identity.provider === "apple");
  if (!usesApple) return null;
  try {
    const credential = await AppleAuthentication.signInAsync({ requestedScopes: [] });
    return credential.authorizationCode;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ERR_REQUEST_CANCELED") {
      throw new Error("Apple reauthentication is required before deleting this account.");
    }
    throw error;
  }
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
