import type { CurrentUserProfile, Gender, ProfileSetup, UpdateCurrentUserProfile } from "./profile.types";
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

export function parseCurrentUserProfileData(value: unknown): CurrentUserProfile {
  if (!isRecord(value)) throw new Error("The profile endpoint returned an unexpected response.");

  return {
    avatarUrl: readNullableString(value.avatarUrl, "avatar URL"),
    cityId: readNullableString(value.cityId, "city ID"),
    cityName: readNullableString(value.cityName, "city name"),
    countryCode: readNullableString(value.countryCode, "country code"),
    countryName: readNullableString(value.countryName, "country name"),
    createdAt: readString(value.createdAt, "creation date"),
    displayName: readNullableString(value.displayName, "display name"),
    gender: readNullableGender(value.gender),
    leaderboardVisibility: readString(value.leaderboardVisibility, "leaderboard visibility"),
    preferredLanguage: readString(value.preferredLanguage, "preferred language"),
    profileSetup: parseProfileSetup(value.profileSetup),
    prayerMapVisibility: readString(value.prayerMapVisibility, "prayer map visibility"),
    saintAvatarId: readNullableString(value.saintAvatarId, "saint avatar ID"),
    state: readNullableString(value.state, "state"),
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

async function readProfileApiError(response: Response, action: "delete" | "load" | "update") {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
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
