import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { useCurrentProfile } from "@/features/profile";
import { updateCurrentUserProfile } from "@/features/profile/profile.api";

import { parseLanguagePreference, useAppLanguage } from "./AppLanguageProvider";

/**
 * Keeps an authenticated account's language preference aligned with the local language choice.
 * Local selections apply immediately; failed account updates remain pending until a later retry trigger.
 */
export function AccountLanguagePreferenceSync({ children }: PropsWithChildren) {
  const { profile, replaceProfile } = useCurrentProfile();
  const { isHydrated, preference, setAccountPreference } = useAppLanguage();
  const [syncAttempt, setSyncAttempt] = useState(0);
  const inFlightKeyRef = useRef<string | null>(null);
  const latestKeyRef = useRef<string | null>(null);
  const targetKey = profile && preference ? `${profile.userId}:${preference}` : null;
  latestKeyRef.current = targetKey;

  useEffect(() => {
    if (!isHydrated || !profile || preference) return;

    const accountPreference = parseLanguagePreference(profile.preferredLanguage);
    if (accountPreference) void setAccountPreference(accountPreference);
  }, [isHydrated, preference, profile, setAccountPreference]);

  useEffect(() => {
    if (!isHydrated || !profile || !preference || profile.preferredLanguage === preference) return;

    const requestKey = `${profile.userId}:${preference}`;
    if (inFlightKeyRef.current) return;

    let isActive = true;
    inFlightKeyRef.current = requestKey;

    void updateCurrentUserProfile({ preferredLanguage: preference })
      .then((updatedProfile) => {
        if (isActive) replaceProfile(updatedProfile);
      })
      .catch(() => {
        // Keep the local selection and retry after the next foreground, profile refresh, or new selection.
      })
      .finally(() => {
        if (inFlightKeyRef.current !== requestKey) return;
        inFlightKeyRef.current = null;
        if (latestKeyRef.current !== requestKey) setSyncAttempt((attempt) => attempt + 1);
      });

    return () => {
      isActive = false;
    };
  }, [isHydrated, preference, profile, replaceProfile, syncAttempt]);

  useEffect(() => {
    /** Retries a pending account update whenever the application returns to the foreground. */
    function retryOnForeground(nextState: string) {
      if (nextState === "active") setSyncAttempt((attempt) => attempt + 1);
    }

    const subscription = AppState.addEventListener("change", retryOnForeground);
    return () => subscription.remove();
  }, []);

  return <>{children}</>;
}
