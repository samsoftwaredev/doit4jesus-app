import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth";
import { getProfileAccessState, useCurrentProfile } from "@/features/profile";
import { logDevelopmentError } from "@/lib/development-logger";

import { acceptFriendInvite } from "./friends.api";
import { clearPendingFriendInvite, readPendingFriendInvite } from "./pendingFriendInvite";

/**
 * Redeems a friend invite that was opened before sign-in.
 *
 * A brand-new account (one that went through onboarding in this session) is friended with the inviter
 * automatically. An existing account that merely signed in is sent to the confirmation screen instead.
 */
export function PendingFriendInviteRedeemer() {
  const router = useRouter();
  const { session } = useAuth();
  const profileState = useCurrentProfile();
  const access = getProfileAccessState(profileState);
  const sawSetupRef = useRef(false);
  const handledRef = useRef(false);

  useEffect(() => {
    if (!session) {
      sawSetupRef.current = false;
      handledRef.current = false;
      return;
    }
    if (access === "onboarding" || access === "legal") sawSetupRef.current = true;
    if (access !== "complete" || handledRef.current) return;
    handledRef.current = true;

    void (async () => {
      const code = await readPendingFriendInvite();
      if (!code) return;

      if (!sawSetupRef.current) {
        router.push({ pathname: "/invite/[code]", params: { code } });
        return;
      }

      try {
        await acceptFriendInvite(code);
        await clearPendingFriendInvite();
        router.replace("/community");
      } catch (error) {
        logDevelopmentError("accepting a pending friend invite", error);
        // Keep the code so the confirmation screen can retry or explain an invalid link.
        router.push({ pathname: "/invite/[code]", params: { code } });
      }
    })();
  }, [access, router, session]);

  return null;
}
