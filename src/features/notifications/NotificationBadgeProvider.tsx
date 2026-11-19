import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";

import { useAuth } from "@/features/auth";
import { logDevelopmentError } from "@/lib/development-logger";

import { getUnreadNotificationCount, markAllNotificationsRead } from "./notifications.api";

type NotificationBadgeContextValue = {
  /** Number of unread notifications, including friend requests. */
  count: number;
  /** Marks everything read on the server and resets the badge to zero immediately. */
  markAllSeen: () => Promise<void>;
  /** Re-reads the unread count from the server. */
  refresh: () => Promise<void>;
};

const NotificationBadgeContext = createContext<NotificationBadgeContextValue>({
  count: 0,
  markAllSeen: async () => undefined,
  refresh: async () => undefined,
});

/** Keeps the bell's unread count fresh while a user is signed in. */
export function NotificationBadgeProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const isSignedIn = Boolean(session);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      setCount(await getUnreadNotificationCount());
    } catch (error) {
      logDevelopmentError("loading the notification count", error);
    }
  }, [isSignedIn]);

  const markAllSeen = useCallback(async () => {
    setCount(0);
    try {
      await markAllNotificationsRead();
    } catch (error) {
      logDevelopmentError("marking notifications as read", error);
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    if (!isSignedIn) {
      setCount(0);
      return;
    }
    void refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, [isSignedIn, refresh]);

  const value = useMemo(() => ({ count, markAllSeen, refresh }), [count, markAllSeen, refresh]);

  return <NotificationBadgeContext.Provider value={value}>{children}</NotificationBadgeContext.Provider>;
}

/** Returns the shared bell badge state. */
export function useNotificationBadge(): NotificationBadgeContextValue {
  return useContext(NotificationBadgeContext);
}
