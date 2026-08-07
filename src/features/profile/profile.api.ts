import type { CurrentUserProfile } from "./profile.types";

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

function parseCurrentUserProfile(value: unknown): CurrentUserProfile {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The profile endpoint returned an unexpected response.");
  }

  const profile = value.data;

  return {
    avatarUrl: readNullableString(profile.avatarUrl, "avatar URL"),
    cityId: readNullableString(profile.cityId, "city ID"),
    countryCode: readString(profile.countryCode, "country code"),
    createdAt: readString(profile.createdAt, "creation date"),
    displayName: readString(profile.displayName, "display name"),
    leaderboardVisibility: readString(
      profile.leaderboardVisibility,
      "leaderboard visibility",
    ),
    preferredLanguage: readString(profile.preferredLanguage, "preferred language"),
    prayerMapVisibility: readString(
      profile.prayerMapVisibility,
      "prayer map visibility",
    ),
    timezone: readString(profile.timezone, "timezone"),
    title: readString(profile.title, "title"),
    updatedAt: readString(profile.updatedAt, "update date"),
    userId: readString(profile.userId, "user ID"),
    username: readString(profile.username, "username"),
  };
}

export async function fetchCurrentUserProfile(): Promise<CurrentUserProfile> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const accessToken = process.env.EXPO_PUBLIC_DEMONS_CATALOG_TOKEN;

  if (!apiUrl) {
    throw new Error("Set EXPO_PUBLIC_API_URL before loading the profile.");
  }

  if (!accessToken) {
    throw new Error(
      "Set EXPO_PUBLIC_DEMONS_CATALOG_TOKEN before loading the profile.",
    );
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Unable to load the profile (${response.status}).`);
  }

  return parseCurrentUserProfile((await response.json()) as unknown);
}
