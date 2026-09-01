import type { CurrentUserProfile, Gender, ProfileSetup } from "@/features/profile/profile.types";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export const onboardingStepMap: Readonly<Record<string, OnboardingStep>> = {
  allSet: 6,
  complete: 6,
  country: 4,
  countryCode: 4,
  displayName: 1,
  gender: 3,
  name: 1,
  notifications: 5,
  username: 2,
};

export function getResumeStep(profileSetup: ProfileSetup): OnboardingStep {
  const serverStep = profileSetup.nextStep ? onboardingStepMap[profileSetup.nextStep] : undefined;
  if (serverStep) return serverStep;

  const missingStep = profileSetup.missingFields.map((field) => onboardingStepMap[field]).find(Boolean);
  return missingStep ?? (profileSetup.missingFields.length === 0 ? 6 : 1);
}

export interface NotificationPreferences {
  confessionReminder: boolean;
  dailyRosaryReminder: boolean;
  eucharisticAdoration: boolean;
}

export interface Country {
  code: string;
  latitude: number | null;
  longitude: number | null;
  name: string;
}

export interface OffsetPageMeta {
  hasMore: boolean;
  limit: number;
  nextOffset: number | null;
  offset: number;
}

export interface CountryPage {
  countries: Country[];
  meta: OffsetPageMeta;
}

export type UsernameValidationReason =
  "INVALID_CHARACTERS" | "INVALID_LENGTH" | "PROHIBITED_TERM" | "USERNAME_TAKEN" | string;

export interface UsernameValidation {
  available: boolean;
  normalizedUsername: string;
  reason: UsernameValidationReason | null;
  suggestions: string[];
  username: string;
  valid: boolean;
}

export interface ProfileSetupState {
  countryCode: string | null;
  countryName: string | null;
  displayName: string;
  gender: Gender | null;
  notificationPreferences: NotificationPreferences | null;
  username: string;
}

export interface CompleteOnboardingPayload {
  countryCode: string;
  displayName: string;
  gender: Gender;
  notificationPreferences: NotificationPreferences;
  username: string;
}

export interface CompleteOnboardingResult {
  notificationPreferences: NotificationPreferences;
  profile: CurrentUserProfile;
}
