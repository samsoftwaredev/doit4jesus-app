import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/features/auth";
import type { NotificationPreferences } from "@/features/onboarding/onboarding.types";

import { fetchCurrentUserProfile } from "./profile.api";
import type { CurrentUserProfile } from "./profile.types";

type ProfileContextValue = {
  error: string | null;
  isLoading: boolean;
  notificationPreferences: NotificationPreferences | null;
  profile: CurrentUserProfile | null;
  refreshProfile: () => Promise<void>;
  replaceNotificationPreferences: (preferences: NotificationPreferences) => void;
  replaceProfile: (profile: CurrentUserProfile) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { isPasswordRecovery, session } = useAuth();
  const userId = session?.user.id ?? null;
  const requestIdRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!userId || isPasswordRecovery) return;

    const requestId = ++requestIdRef.current;
    setError(null);
    setIsFetching(true);

    try {
      const nextProfile = await fetchCurrentUserProfile();
      if (requestId !== requestIdRef.current) return;
      setProfile(nextProfile);
      setLoadedUserId(userId);
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return;
      setError(requestError instanceof Error ? requestError.message : "We couldn't load your profile.");
      setLoadedUserId(userId);
      setProfile(null);
    } finally {
      if (requestId === requestIdRef.current) setIsFetching(false);
    }
  }, [isPasswordRecovery, userId]);

  useEffect(() => {
    if (!userId || isPasswordRecovery) {
      requestIdRef.current += 1;
      setError(null);
      setIsFetching(false);
      setLoadedUserId(null);
      setNotificationPreferences(null);
      setProfile(null);
      return;
    }

    void refreshProfile();
  }, [isPasswordRecovery, refreshProfile, userId]);

  const isLoading = Boolean(userId && !isPasswordRecovery) && (isFetching || loadedUserId !== userId);
  const value = useMemo<ProfileContextValue>(
    () => ({
      error,
      isLoading,
      notificationPreferences,
      profile,
      refreshProfile,
      replaceNotificationPreferences: setNotificationPreferences,
      replaceProfile: (nextProfile) => {
        setError(null);
        setLoadedUserId(nextProfile.userId);
        setProfile(nextProfile);
      },
    }),
    [error, isLoading, notificationPreferences, profile, refreshProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useCurrentProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useCurrentProfile must be used inside ProfileProvider.");
  return context;
}
