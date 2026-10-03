import AsyncStorage from "@react-native-async-storage/async-storage";

import { logDevelopmentError } from "@/lib/development-logger";

const LANGUAGE_ONBOARDING_COMPLETE = "complete";

/** Creates a device-local completion key scoped to one authenticated user. */
export function languageOnboardingStorageKey(userId: string): string {
  return `@doit4jesus/onboarding-language:${userId}:v1`;
}

/** Reads whether this user has already confirmed a language on this device. */
export async function hasCompletedLanguageOnboarding(userId: string): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(languageOnboardingStorageKey(userId))) === LANGUAGE_ONBOARDING_COMPLETE;
  } catch (error) {
    logDevelopmentError("loading language onboarding completion", error);
    return false;
  }
}

/** Marks the local language screen complete without allowing storage failure to block onboarding. */
export async function completeLanguageOnboarding(userId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(languageOnboardingStorageKey(userId), LANGUAGE_ONBOARDING_COMPLETE);
  } catch (error) {
    logDevelopmentError("saving language onboarding completion", error);
    // The user can continue and will be asked again if persistence is unavailable.
  }
}
