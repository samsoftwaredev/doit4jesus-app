import { parseCurrentUserProfileData } from "@/features/profile/profile.api";
import { logDevelopmentError } from "@/lib/development-logger";
import { getSupabaseAccessToken } from "@/lib/supabase";

import type {
  CompleteOnboardingPayload,
  CompleteOnboardingResult,
  Country,
  CountryPage,
  NotificationPreferences,
  OffsetPageMeta,
  UsernameValidation,
} from "./onboarding.types";

type RequestOptions = {
  body?: unknown;
  method?: "GET" | "PATCH" | "POST";
  signal?: AbortSignal;
};

export class OnboardingApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly reason?: string,
    public readonly suggestions: string[] = [],
  ) {
    super(message);
    this.name = "OnboardingApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`The onboarding API returned an invalid ${field}.`);
  return value;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(`The onboarding API returned an invalid ${field}.`);
  return value;
}

function readNullableString(value: unknown, field: string): string | null {
  return value === null ? null : readString(value, field);
}

function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") throw new Error(`The onboarding API returned an invalid ${field}.`);
  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The onboarding API returned an invalid ${field}.`);
  }
  return value;
}

function readNullableNumber(value: unknown, field: string): number | null {
  return value === null ? null : readNumber(value, field);
}

function readStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) throw new Error(`The onboarding API returned invalid ${field}.`);
  return value.map((item) => readString(item, field));
}

function parseMeta(value: unknown): OffsetPageMeta {
  const meta = readRecord(value, "pagination metadata");
  return {
    hasMore: readBoolean(meta.hasMore, "has-more value"),
    limit: readNumber(meta.limit, "page limit"),
    nextOffset: meta.nextOffset === null ? null : readNumber(meta.nextOffset, "next offset"),
    offset: readNumber(meta.offset, "page offset"),
  };
}

function parseCountry(value: unknown): Country {
  const country = readRecord(value, "country");
  return {
    code: readString(country.code, "country code"),
    latitude: readNullableNumber(country.latitude, "country latitude"),
    longitude: readNullableNumber(country.longitude, "country longitude"),
    name: readString(country.name, "country name"),
  };
}

export function parseNotificationPreferences(value: unknown): NotificationPreferences {
  const preferences = readRecord(value, "notification preferences");
  return {
    confessionReminder: readBoolean(preferences.confessionReminder, "confession reminder"),
    dailyRosaryReminder: readBoolean(preferences.dailyRosaryReminder, "daily Rosary reminder"),
    eucharisticAdoration: readBoolean(preferences.eucharisticAdoration, "Eucharistic Adoration reminder"),
  };
}

async function request(path: string, options: RequestOptions = {}): Promise<unknown> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading onboarding data.");

  const accessToken = await getSupabaseAccessToken();
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    body,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    method: options.method ?? "GET",
    signal: options.signal,
  });

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      logDevelopmentError("parsing an onboarding API error response", error);
      payload = undefined;
    }
    const details =
      isRecord(payload) && isRecord(payload.data) ? payload.data : isRecord(payload) ? payload : undefined;
    const reason = details && typeof details.reason === "string" ? details.reason : undefined;
    const suggestions = details ? readOptionalSuggestions(details.suggestions) : [];
    throw new OnboardingApiError(
      `Unable to complete onboarding request (${response.status}).`,
      response.status,
      reason,
      suggestions,
    );
  }

  return response.json() as Promise<unknown>;
}

function readOptionalSuggestions(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function validateUsername(username: string, signal?: AbortSignal): Promise<UsernameValidation> {
  const search = new URLSearchParams({ username });
  const payload = readRecord(await request(`/api/v1/usernames/validate?${search}`, { signal }), "username response");
  const data = readRecord(payload.data, "username validation");

  return {
    available: readBoolean(data.available, "username availability"),
    normalizedUsername: readString(data.normalizedUsername, "normalized username"),
    reason: readNullableString(data.reason, "username validation reason"),
    suggestions: readStringArray(data.suggestions, "username suggestions"),
    username: readString(data.username, "username"),
    valid: readBoolean(data.valid, "username validity"),
  };
}

function pageParts(payloadValue: unknown, itemKey: "countries") {
  const payload = readRecord(payloadValue, `${itemKey} response`);
  if (Array.isArray(payload.data)) return { items: payload.data, meta: parseMeta(payload.meta) };

  const data = readRecord(payload.data, itemKey);
  const items = data[itemKey];
  if (!Array.isArray(items)) throw new Error(`The onboarding API returned invalid ${itemKey}.`);
  return { items, meta: parseMeta(data.meta ?? data.pagination ?? payload.meta) };
}

export async function getCountries(
  { limit = 20, offset = 0, q }: { limit?: number; offset?: number; q?: string } = {},
  signal?: AbortSignal,
): Promise<CountryPage> {
  const search = new URLSearchParams();
  if (q?.trim()) search.set("q", q.trim());
  search.set("limit", String(limit));
  search.set("offset", String(offset));
  const { items, meta } = pageParts(await request(`/api/v1/locations/countries?${search}`, { signal }), "countries");
  return { countries: items.map(parseCountry), meta };
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const payload = readRecord(await request("/api/v1/me/notification-preferences"), "notification response");
  return parseNotificationPreferences(payload.data);
}

export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const payload = readRecord(
    await request("/api/v1/me/notification-preferences", { body: preferences, method: "PATCH" }),
    "notification response",
  );
  return parseNotificationPreferences(payload.data);
}

/** Posts the four required profile fields that complete onboarding and returns the authoritative profile. */
export async function completeOnboarding(payload: CompleteOnboardingPayload): Promise<CompleteOnboardingResult> {
  const response = readRecord(
    await request("/api/v1/me/onboarding/complete", { body: payload, method: "POST" }),
    "completion response",
  );
  const data = readRecord(response.data, "completion data");

  return {
    profile: parseCurrentUserProfileData(data.profile),
  };
}
