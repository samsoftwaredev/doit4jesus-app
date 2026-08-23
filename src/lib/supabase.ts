import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigurationError =
  !supabaseUrl || !supabasePublishableKey
    ? "Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable sign-in."
    : null;

// A placeholder keeps the app renderable long enough to show the configuration
// error instead of failing during module initialization.
export const supabase = createClient(
  supabaseUrl ?? "https://unconfigured.supabase.co",
  supabasePublishableKey ?? "unconfigured-publishable-key",
  {
    auth: {
      ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      detectSessionInUrl: false,
      lock: processLock,
      persistSession: true,
    },
  },
);

export async function getSupabaseAccessToken(): Promise<string> {
  if (supabaseConfigurationError) {
    throw new Error(supabaseConfigurationError);
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error("Unable to restore your sign-in session.");
  }

  if (!data.session?.access_token) {
    throw new Error("Sign in before accessing this content.");
  }

  return data.session.access_token;
}

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
