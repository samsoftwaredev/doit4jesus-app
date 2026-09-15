import { useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";

import { useAuth } from "@/features/auth";
import { useCurrentProfile } from "@/features/profile/profile-provider";
import type { RosaryPresenceConnectionState, RosaryPresenceUser } from "@/features/prayer/rosary/presence.types";
import { supabase } from "@/lib/supabase";

const ROSARY_PRESENCE_TOPIC = "rosary-prayer";

/** Returns a nullable string when Presence metadata contains the expected primitive value. */
function nullableString(value: unknown): string | null | undefined {
  return value === null || typeof value === "string" ? value : undefined;
}

/** Validates untrusted Presence metadata before it is rendered as a praying user. */
function parsePresenceUser(value: unknown): RosaryPresenceUser | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const avatarUrl = nullableString(record.avatarUrl);
  const countryCode = nullableString(record.countryCode);
  const saintAvatarId = record.saintAvatarId === undefined ? null : nullableString(record.saintAvatarId);
  const title = nullableString(record.title);

  if (
    avatarUrl === undefined ||
    countryCode === undefined ||
    saintAvatarId === undefined ||
    title === undefined ||
    typeof record.displayName !== "string" ||
    typeof record.joinedAt !== "string" ||
    typeof record.userId !== "string" ||
    typeof record.username !== "string" ||
    !record.displayName.trim() ||
    !record.username.trim() ||
    Number.isNaN(Date.parse(record.joinedAt))
  ) {
    return undefined;
  }

  return {
    avatarUrl,
    countryCode,
    displayName: record.displayName,
    joinedAt: record.joinedAt,
    saintAvatarId,
    title,
    userId: record.userId,
    username: record.username,
  };
}

/** Converts a Presence snapshot into one latest connection per account. */
export function usersFromPresenceState(state: Record<string, unknown[]>): RosaryPresenceUser[] {
  const uniqueUsers = new Map<string, RosaryPresenceUser>();

  Object.values(state).forEach((presences) => {
    presences.forEach((presence) => {
      const user = parsePresenceUser(presence);
      if (!user) return;
      const current = uniqueUsers.get(user.userId);
      if (!current || user.joinedAt > current.joinedAt) uniqueUsers.set(user.userId, user);
    });
  });

  return [...uniqueUsers.values()];
}

/**
 * Tracks the signed-in user in the global Rosary Presence channel while this screen is active.
 * Presence is ephemeral; backgrounding or unmounting removes this device from the shared room.
 */
export function useRosaryPresence(): {
  connectionState: RosaryPresenceConnectionState;
  currentUserId: string | null;
  users: RosaryPresenceUser[];
} {
  const { session } = useAuth();
  const { profile } = useCurrentProfile();
  const currentUserId = session?.user.id ?? null;
  const [connectionState, setConnectionState] = useState<RosaryPresenceConnectionState>("idle");
  const [users, setUsers] = useState<RosaryPresenceUser[]>([]);
  const presencePayload = useMemo<RosaryPresenceUser | null>(() => {
    if (
      !currentUserId ||
      !profile?.profileSetup.complete ||
      profile.userId !== currentUserId ||
      !profile.displayName ||
      !profile.username
    ) {
      return null;
    }

    return {
      avatarUrl: profile.avatarUrl,
      countryCode: profile.countryCode,
      displayName: profile.displayName,
      joinedAt: new Date().toISOString(),
      saintAvatarId: profile.saintAvatarId,
      title: profile.title,
      userId: currentUserId,
      username: profile.username,
    };
  }, [
    currentUserId,
    profile?.avatarUrl,
    profile?.countryCode,
    profile?.displayName,
    profile?.profileSetup.complete,
    profile?.saintAvatarId,
    profile?.title,
    profile?.userId,
    profile?.username,
  ]);

  useEffect(() => {
    if (!presencePayload) {
      setConnectionState("idle");
      setUsers([]);
      return;
    }
    const currentPresence = presencePayload;

    let active = true;
    let subscribed = false;
    let foreground = AppState.currentState !== "background" && AppState.currentState !== "inactive";
    const channel = supabase.channel(ROSARY_PRESENCE_TOPIC, {
      config: { presence: { enabled: true, key: currentPresence.userId } },
    });

    /** Publishes this user's public profile after the Presence socket has connected. */
    async function trackCurrentUser() {
      if (!active || !subscribed || !foreground) return;
      const result = await channel.track(currentPresence);
      if (active && result !== "ok") setConnectionState("error");
    }

    /** Rebuilds the visible user list from Supabase's authoritative Presence snapshot. */
    function synchronizeUsers() {
      if (!active) return;
      const state = channel.presenceState() as Record<string, unknown[]>;
      setUsers(usersFromPresenceState(state));
    }

    /** Responds to Realtime subscription states and starts tracking after a successful join. */
    function handleSubscription(status: string) {
      if (!active) return;
      if (status === "SUBSCRIBED") {
        subscribed = true;
        setConnectionState("connected");
        void trackCurrentUser();
        return;
      }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        subscribed = false;
        setConnectionState("error");
      }
    }

    /** Removes or restores this device's Presence when the application background state changes. */
    function handleAppState(nextState: string) {
      foreground = nextState === "active";
      if (!subscribed) return;
      if (foreground) {
        void trackCurrentUser();
      } else {
        void channel.untrack();
      }
    }

    setConnectionState("connecting");
    channel.on("presence", { event: "sync" }, synchronizeUsers).subscribe(handleSubscription);
    const appStateSubscription = AppState.addEventListener("change", handleAppState);

    return () => {
      active = false;
      appStateSubscription.remove();
      if (subscribed) void channel.untrack();
      void supabase.removeChannel(channel);
    };
  }, [presencePayload]);

  return { connectionState, currentUserId, users };
}
