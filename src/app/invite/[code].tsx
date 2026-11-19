import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/features/auth";
import { FriendInviteScreen } from "@/features/friends/screens/FriendInviteScreen";
import { isFriendInviteCode, savePendingFriendInvite } from "@/features/friends/pendingFriendInvite";
import { getProfileAccessState, useCurrentProfile } from "@/features/profile";

/**
 * Handles shared friend-invite links.
 *
 * Signed-in users with a finished profile confirm the invite. Everyone else has the code remembered and is sent to
 * the regular sign-in/sign-up/onboarding flow, after which the invite is redeemed.
 */
export default function InviteRoute() {
  const { code } = useLocalSearchParams<{ code?: string | string[] }>();
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const profileState = useCurrentProfile();
  const access = getProfileAccessState(profileState);
  const inviteCode = typeof code === "string" && isFriendInviteCode(code) ? code : undefined;
  const canConfirm = Boolean(session) && access === "complete";
  const isResolving = isLoading || (Boolean(session) && access === "loading");

  useEffect(() => {
    if (isResolving) return;
    if (!inviteCode) {
      router.replace("/");
      return;
    }
    if (canConfirm) return;
    void savePendingFriendInvite(inviteCode).then(() => router.replace("/"));
  }, [canConfirm, inviteCode, isResolving, router]);

  if (!inviteCode || !canConfirm) return null;
  return <FriendInviteScreen code={inviteCode} />;
}
