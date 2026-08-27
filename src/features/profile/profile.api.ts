import type { CurrentUserProfile, Gender, UpdateCurrentUserProfile } from "./profile.types";
import { getSupabaseAccessToken } from "@/lib/supabase";

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

function readGender(value: unknown): Gender {
  if (value === "female" || value === "male") {
    return value;
  }

  throw new Error("The profile endpoint returned an invalid gender.");
}

function parseCurrentUserProfile(value: unknown): CurrentUserProfile {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The profile endpoint returned an unexpected response.");
  }

  const profile = value.data;

  return {
    avatarUrl: readNullableString(profile.avatarUrl, "avatar URL"),
    cityId: readNullableString(profile.cityId, "city ID"),
    cityName: readNullableString(profile.cityName, "city name"),
    countryCode: readString(profile.countryCode, "country code"),
    createdAt: readString(profile.createdAt, "creation date"),
    displayName: readString(profile.displayName, "display name"),
    gender: readGender(profile.gender),
    leaderboardVisibility: readString(profile.leaderboardVisibility, "leaderboard visibility"),
    preferredLanguage: readString(profile.preferredLanguage, "preferred language"),
    prayerMapVisibility: readString(profile.prayerMapVisibility, "prayer map visibility"),
    saintAvatarId: readNullableString(profile.saintAvatarId, "saint avatar ID"),
    state: readNullableString(profile.state, "state"),
    timezone: readString(profile.timezone, "timezone"),
    title: readString(profile.title, "title"),
    updatedAt: readString(profile.updatedAt, "update date"),
    userId: readString(profile.userId, "user ID"),
    username: readString(profile.username, "username"),
  };
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
    throw new Error(`Unable to load the profile (${response.status}).`);
  }

  return parseCurrentUserProfile((await response.json()) as unknown);
}

export async function updateCurrentUserProfile(update: Partial<UpdateCurrentUserProfile>): Promise<CurrentUserProfile> {
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
    throw new Error(`Unable to update the profile (${response.status}).`);
  }

  return parseCurrentUserProfile((await response.json()) as unknown);
}
