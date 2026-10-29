export type Gender = "female" | "male";

export interface ProfileSetup {
  complete: boolean;
  completedAt: string | null;
  missingFields: string[];
  nextStep: string | null;
}

export interface LegalAcceptanceStatus {
  accepted: boolean;
  acceptedAt: string | null;
  communityGuidelinesVersion: string;
  grandfathered: boolean;
  privacyVersion: string;
  required: boolean;
  termsVersion: string;
}

export interface CurrentUserProfile {
  avatarUrl: string | null;
  countryCode: string | null;
  countryName: string | null;
  createdAt: string;
  displayName: string | null;
  gender: Gender | null;
  leaderboardVisibility: string;
  legalAcceptance: LegalAcceptanceStatus;
  preferredLanguage: string;
  profileSetup: ProfileSetup;
  prayerMapVisibility: string;
  saintAvatarId: string | null;
  timezone: string;
  title: string | null;
  updatedAt: string;
  userId: string;
  username: string | null;
}

export type UpdateCurrentUserProfile = Partial<{
  countryCode: string;
  displayName: string;
  gender: Gender;
  preferredLanguage: "en" | "es";
  saintAvatarId: string | null;
  username: string;
}>;
