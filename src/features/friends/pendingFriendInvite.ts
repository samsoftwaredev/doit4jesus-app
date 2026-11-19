import AsyncStorage from "@react-native-async-storage/async-storage";

import { logDevelopmentError } from "@/lib/development-logger";

const STORAGE_KEY = "@doit4jesus/pending-friend-invite/v1";
const INVITE_CODE_PATTERN = /^[A-Za-z0-9_-]{12,64}$/u;

/** Returns whether a value looks like a friend-invite code, guarding against malformed deep links. */
export function isFriendInviteCode(value: unknown): value is string {
  return typeof value === "string" && INVITE_CODE_PATTERN.test(value);
}

/** Remembers an invite opened before sign-in so it survives account creation and onboarding. */
export async function savePendingFriendInvite(code: string): Promise<void> {
  if (!isFriendInviteCode(code)) return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, code);
  } catch (error) {
    logDevelopmentError("saving a pending friend invite", error);
  }
}

/** Reads the remembered invite code, if any. */
export async function readPendingFriendInvite(): Promise<string | null> {
  try {
    const code = await AsyncStorage.getItem(STORAGE_KEY);
    return isFriendInviteCode(code) ? code : null;
  } catch (error) {
    logDevelopmentError("reading a pending friend invite", error);
    return null;
  }
}

/** Forgets the remembered invite once it is accepted or no longer valid. */
export async function clearPendingFriendInvite(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logDevelopmentError("clearing a pending friend invite", error);
  }
}
