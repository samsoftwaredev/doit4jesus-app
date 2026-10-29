import type {
  CurrentUserProfile,
  Gender,
  LegalAcceptanceStatus,
  ProfileSetup,
  UpdateCurrentUserProfile,
} from "./profile.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { getSupabaseAccessToken } from "@/lib/supabase";

export class ProfileApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly reason?: string,
    public readonly suggestions: string[] = [],
  ) {
    super(message);
    this.name = "ProfileApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`The profile endpoint returned an invalid ${field}.`);
  }

  return value;
}

function readNullableString(value: unknown, field: string): string | null {
  if (value === null) {
    return null;
  }

  return readString(value, field);
}

function readNullableGender(value: unknown): Gender | null {
  if (value === null) return null;

  if (value === "female" || value === "male") {
    return value;
  }

  throw new Error("The profile endpoint returned an invalid gender.");
}

function parseProfileSetup(value: unknown): ProfileSetup {
  if (!isRecord(value) || !Array.isArray(value.missingFields)) {
    throw new Error("The profile endpoint returned an invalid profile setup status.");
  }

  const missingFields = value.missingFields.map((field) => readString(field, "missing profile field"));
  if (typeof value.complete !== "boolean") {
    throw new Error("The profile endpoint returned an invalid profile completion state.");
  }

  return {
    complete: value.complete,
    completedAt: readNullableString(value.completedAt, "profile completion date"),
    missingFields,
    nextStep: readNullableString(value.nextStep, "next profile setup step"),
  };
}

function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new Error(`The profile endpoint returned an invalid ${field}.`);
  return value;
}

export function parseLegalAcceptanceStatus(value: unknown): LegalAcceptanceStatus {
  if (!isRecord(value)) throw new Error("The profile endpoint returned an invalid legal acceptance status.");

  return {
    accepted: readBoolean(value.accepted, "legal acceptance state"),
    acceptedAt: readNullableString(value.acceptedAt, "legal acceptance date"),
    communityGuidelinesVersion: readString(value.communityGuidelinesVersion, "Community Guidelines version"),
    grandfathered: readBoolean(value.grandfathered, "legal grandfather state"),
    privacyVersion: readString(value.privacyVersion, "Privacy Policy version"),
    required: readBoolean(value.required, "legal acceptance requirement"),
    termsVersion: readString(value.termsVersion, "Terms version"),
  };
}

export function parseCurrentUserProfileData(value: unknown): CurrentUserProfile {
  if (!isRecord(value)) throw new Error("The profile endpoint returned an unexpected response.");

  return {
    avatarUrl: readNullableString(value.avatarUrl, "avatar URL"),
    countryCode: readNullableString(value.countryCode, "country code"),
    countryName: readNullableString(value.countryName, "country name"),
    createdAt: readString(value.createdAt, "creation date"),
    displayName: readNullableString(value.displayName, "display name"),
    gender: readNullableGender(value.gender),
    leaderboardVisibility: readString(value.leaderboardVisibility, "leaderboard visibility"),
    legalAcceptance: parseLegalAcceptanceStatus(value.legalAcceptance),
    preferredLanguage: readString(value.preferredLanguage, "preferred language"),
    profileSetup: parseProfileSetup(value.profileSetup),
    prayerMapVisibility: readString(value.prayerMapVisibility, "prayer map visibility"),
    saintAvatarId: readNullableString(value.saintAvatarId, "saint avatar ID"),
    timezone: readString(value.timezone, "timezone"),
    title: readNullableString(value.title, "title"),
    updatedAt: readString(value.updatedAt, "update date"),
    userId: readString(value.userId, "user ID"),
    username: readNullableString(value.username, "username"),
  };
}

function parseCurrentUserProfile(value: unknown): CurrentUserProfile {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The profile endpoint returned an unexpected response.");
  }

  return parseCurrentUserProfileData(value.data);
}

async function readProfileApiError(
  response: Response,
  action: "accept legal documents" | "delete" | "load" | "revoke Apple credentials" | "update",
) {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    logDevelopmentError("parsing a profile API error response", error);
    payload = undefined;
  }

  const body = isRecord(payload) && isRecord(payload.data) ? payload.data : isRecord(payload) ? payload : undefined;
  const reason = body && typeof body.reason === "string" ? body.reason : undefined;
  const suggestions =
    body && Array.isArray(body.suggestions)
      ? body.suggestions.filter((suggestion): suggestion is string => typeof suggestion === "string")
      : [];

  return new ProfileApiError(
    `Unable to ${action} the profile (${response.status}).`,
    response.status,
    reason,
    suggestions,
  );
}

function getProfileApiUrl(): string {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Set EXPO_PUBLIC_API_URL before loading the profile.");
  }

  return `${apiUrl.replace(/\/$/, "")}/api/v1/me`;
}

async function getProfileHeaders(): Promise<HeadersInit> {
  const accessToken = await getSupabaseAccessToken();

  return {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function fetchCurrentUserProfile(): Promise<CurrentUserProfile> {
  const apiUrl = getProfileApiUrl();
  const headers = await getProfileHeaders();

  const response = await fetch(apiUrl, {
    headers,
    method: "GET",
  });

  if (!response.ok) {
    throw await readProfileApiError(response, "load");
  }

  return parseCurrentUserProfile((await response.json()) as unknown);
}

export async function updateCurrentUserProfile(update: UpdateCurrentUserProfile): Promise<CurrentUserProfile> {
  if (Object.keys(update).length === 0) throw new Error("At least one profile field is required.");

  const apiUrl = getProfileApiUrl();
  const headers = await getProfileHeaders();

  const response = await fetch(apiUrl, {
    body: JSON.stringify(update),
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    throw await readProfileApiError(response, "update");
  }

  return parseCurrentUserProfile((await response.json()) as unknown);
}

export async function deleteCurrentUserProfile(): Promise<void> {
  const apiUrl = getProfileApiUrl();
  const headers = await getProfileHeaders();

  const response = await fetch(apiUrl, {
    headers,
    method: "DELETE",
  });

  if (!response.ok) {
    throw await readProfileApiError(response, "delete");
  }
}

export async function revokeAppleCredential(authorizationCode: string): Promise<void> {
  const response = await fetch(`${getProfileApiUrl()}/apple-credential-revocation`, {
    body: JSON.stringify({ authorizationCode }),
    headers: { ...(await getProfileHeaders()), "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw await readProfileApiError(response, "revoke Apple credentials");
}

export async function acceptLegalDocuments(locale: "en" | "es"): Promise<LegalAcceptanceStatus> {
  const apiUrl = `${getProfileApiUrl()}/legal-acceptance`;
  const headers = await getProfileHeaders();
  const response = await fetch(apiUrl, {
    body: JSON.stringify({ locale, adultConfirmed: true, usResidentConfirmed: true }),
    headers: { ...headers, "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) throw await readProfileApiError(response, "accept legal documents");
  const payload = (await response.json()) as unknown;
  if (!isRecord(payload)) throw new Error("The legal acceptance endpoint returned an unexpected response.");
  return parseLegalAcceptanceStatus(payload.data);
}
