import type { CurrentUserProfile } from "./profile.types";

export type ProfileAccessState = "complete" | "error" | "loading" | "onboarding";

export function getProfileAccessState({
  error,
  isLoading,
  profile,
}: {
  error: string | null;
  isLoading: boolean;
  profile: CurrentUserProfile | null;
}): ProfileAccessState {
  if (isLoading) return "loading";
  if (profile?.profileSetup.complete === true) return "complete";
  if (profile?.profileSetup.complete === false) return "onboarding";
  return error ? "error" : "loading";
}
