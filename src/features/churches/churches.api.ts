import { getSupabaseAccessToken } from "@/lib/supabase";

import {
  CHURCH_SERVICE_TYPES,
  NOTIFICATION_WEEKDAYS,
  type ChurchDetails,
  type ChurchScheduleStatus,
  type ChurchSearchInput,
  type ChurchServiceTime,
  type ChurchServiceType,
  type ChurchSubscription,
  type ChurchSubscriptionPreferences,
  type ChurchSummary,
  type ChurchVerificationStatus,
  type CreateChurchSubscriptionInput,
  type DioceseFilter,
  type NotificationWeekday,
  type PaginatedResponse,
  type PaginationMeta,
  type PostalCity,
  type ResolvedPostalCode,
  type UpcomingChurchService,
  type UpcomingChurchServicesInput,
} from "./churches.types";

type JsonRecord = Record<string, unknown>;

/** Preserves HTTP status and backend code so the UI can translate known church failures. */
export class ChurchApiError extends Error {
  code: string | null;
  status: number;

  /** Creates a typed church API failure without exposing backend response objects to consumers. */
  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "ChurchApiError";
    this.code = code;
    this.status = status;
  }
}

/** Narrows an unknown JSON value to a non-null object. */
function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads a required non-empty string and names invalid contract fields in the thrown error. */
function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`The church endpoint returned an invalid ${field}.`);
  }
  return value;
}

/** Reads an optional API string while normalizing blank strings to null. */
function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

/** Reads a finite numeric contract field. */
function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The church endpoint returned an invalid ${field}.`);
  }
  return value;
}

/** Unwraps the repository's standard top-level data envelope. */
function unwrapData(payload: unknown): unknown {
  if (!isRecord(payload) || !("data" in payload)) {
    throw new Error("The church endpoint returned an unexpected response.");
  }
  return payload.data;
}

/** Resolves either a direct data array or a named array nested inside the data envelope. */
function readDataArray(payload: unknown, nestedKeys: readonly string[]): unknown[] {
  const data = unwrapData(payload);
  if (Array.isArray(data)) return data;
  if (isRecord(data)) {
    for (const key of nestedKeys) {
      if (Array.isArray(data[key])) return data[key];
    }
  }
  throw new Error("The church endpoint returned an unexpected response.");
}

/** Normalizes pagination metadata and safely derives a missing next offset. */
function parsePagination(
  payload: unknown,
  count: number,
  fallbackLimit: number,
  fallbackOffset: number,
): PaginationMeta {
  const rawMeta = isRecord(payload) && isRecord(payload.meta) ? payload.meta : {};
  const limit = typeof rawMeta.limit === "number" ? rawMeta.limit : fallbackLimit;
  const offset = typeof rawMeta.offset === "number" ? rawMeta.offset : fallbackOffset;
  const hasMore = typeof rawMeta.hasMore === "boolean" ? rawMeta.hasMore : count >= limit;
  const nextOffset =
    rawMeta.nextOffset === null
      ? null
      : typeof rawMeta.nextOffset === "number"
        ? rawMeta.nextOffset
        : hasMore
          ? offset + count
          : null;
  return { hasMore, limit, nextOffset, offset };
}

/** Accepts only reminder service types supported by the public subscription contract. */
function parseServiceType(value: unknown): ChurchServiceType {
  if (typeof value === "string" && CHURCH_SERVICE_TYPES.includes(value as ChurchServiceType)) {
    return value as ChurchServiceType;
  }
  throw new Error("The church endpoint returned an unsupported service type.");
}

/** Accepts only lowercase weekday values supported by reminder preferences. */
function parseWeekday(value: unknown): NotificationWeekday {
  if (typeof value === "string" && NOTIFICATION_WEEKDAYS.includes(value.toLowerCase() as NotificationWeekday)) {
    return value.toLowerCase() as NotificationWeekday;
  }
  throw new Error("The church endpoint returned an unsupported weekday.");
}

/** Maps backend directory state variants to the feature's stable verification states. */
function parseVerificationStatus(record: JsonRecord): ChurchVerificationStatus {
  const value = record.directoryVerificationStatus ?? record.verificationStatus ?? record.directoryStatus;
  if (value === "verified" || value === "candidate") return value;
  if (record.isVerified === true) return "verified";
  if (record.isVerified === false) return "candidate";
  return "unknown";
}

/** Maps schedule readiness variants to stable verified, pending, or unavailable states. */
function parseScheduleStatus(record: JsonRecord): ChurchScheduleStatus {
  const value = record.scheduleStatus ?? record.scheduleReadiness;
  if (value === "verified" || value === "pending" || value === "unavailable") return value;
  if (value === "ready" || record.scheduleReady === true || record.isScheduleVerified === true) return "verified";
  if (value === "review_pending" || value === "needs_review" || record.scheduleReady === false) return "pending";
  return "unknown";
}

/** Parses flat directory summaries and subscription summaries that nest postal fields under address. */
function parseChurchSummary(value: unknown): ChurchSummary {
  if (!isRecord(value)) throw new Error("The church endpoint returned an unexpected church summary.");
  const address = isRecord(value.address) ? value.address : null;
  const flatAddress = typeof value.address === "string" ? value.address : undefined;
  const diocese = isRecord(value.diocese) ? value.diocese : null;
  return {
    addressLine1: readString(value.addressLine1 ?? address?.line1 ?? flatAddress, "church address"),
    addressLine2: readNullableString(value.addressLine2 ?? address?.line2),
    city: readString(value.city ?? address?.city, "church city"),
    countryCode: readString(value.countryCode ?? address?.countryCode, "church country"),
    dioceseId: readNullableString(diocese?.id ?? value.dioceseId),
    dioceseName: readNullableString(diocese?.name ?? value.dioceseName),
    directoryVerificationStatus: parseVerificationStatus(value),
    distanceMiles: typeof value.distanceMiles === "number" ? value.distanceMiles : null,
    id: readString(value.id, "church ID"),
    latitude: readNumber(value.latitude, "church latitude"),
    longitude: readNumber(value.longitude, "church longitude"),
    name: readString(value.name, "church name"),
    postalCode: readNullableString(value.postalCode ?? address?.postalCode),
    regionName: readNullableString(value.regionName ?? address?.regionName),
    scheduleStatus: parseScheduleStatus(value),
    timezone: readString(value.timezone, "church timezone"),
  };
}

/** Parses one recurring weekly service time from a church details response. */
function parseServiceTime(value: unknown, index: number): ChurchServiceTime {
  if (!isRecord(value)) throw new Error("The church endpoint returned an invalid service time.");
  return {
    endTime: readNullableString(value.endTime ?? value.endsAt),
    id: readNullableString(value.id) ?? `service-${index}`,
    serviceType: parseServiceType(value.serviceType),
    startTime: readString(value.startTime ?? value.startsAt, "service start time"),
    weekday: parseWeekday(value.weekday),
  };
}

/** Parses a complete church including live and recurring schedule state. */
function parseChurchDetails(payload: unknown): ChurchDetails {
  const data = unwrapData(payload);
  if (!isRecord(data)) throw new Error("The church endpoint returned an unexpected response.");
  const liveStatus = isRecord(data.liveStatus) ? data.liveStatus : {};
  const rawTimes = Array.isArray(data.serviceTimes)
    ? data.serviceTimes
    : Array.isArray(data.schedule)
      ? data.schedule
      : [];
  return {
    ...parseChurchSummary(data),
    isActive: data.isActive !== false,
    liveStatus: {
      adorationInProgress: liveStatus.adorationInProgress === true,
      confessionInProgress: liveStatus.confessionInProgress === true,
      massInProgress: liveStatus.massInProgress === true,
    },
    serviceTimes: rawTimes.map(parseServiceTime),
  };
}

/** Parses one saved reminder subscription and its embedded church summary. */
function parseSubscription(value: unknown): ChurchSubscription {
  if (!isRecord(value)) throw new Error("The church endpoint returned an invalid subscription.");
  const parsedChurch = parseChurchSummary(value.church);
  const subscriptionScheduleStatus = parseScheduleStatus(value);
  const effectiveScheduleStatus =
    subscriptionScheduleStatus === "unknown" ? parsedChurch.scheduleStatus : subscriptionScheduleStatus;
  const church =
    parsedChurch.scheduleStatus === effectiveScheduleStatus
      ? parsedChurch
      : { ...parsedChurch, scheduleStatus: effectiveScheduleStatus };
  if (!Array.isArray(value.serviceTypes) || !Array.isArray(value.notificationWeekdays)) {
    throw new Error("The church endpoint returned an invalid subscription preference.");
  }
  return {
    church,
    churchId: readNullableString(value.churchId) ?? church.id,
    notificationWeekdays: value.notificationWeekdays.map(parseWeekday),
    scheduleReady: effectiveScheduleStatus === "verified",
    serviceTypes: value.serviceTypes.map(parseServiceType),
  };
}

/** Parses an occurrence whose embedded church contains only the identity needed by Home. */
function parseUpcomingService(value: unknown): UpcomingChurchService {
  if (!isRecord(value)) throw new Error("The church endpoint returned an invalid upcoming service.");
  const church = isRecord(value.church) ? value.church : {};
  return {
    churchId:
      readNullableString(value.churchId) ??
      readNullableString(church.id) ??
      readString(undefined, "upcoming church ID"),
    churchName:
      readNullableString(value.churchName) ??
      readNullableString(church.name) ??
      readString(undefined, "upcoming church name"),
    endsAt: readNullableString(value.endsAt ?? value.endAt),
    id: readString(value.occurrenceId ?? value.id, "upcoming service ID"),
    serviceType: parseServiceType(value.serviceType),
    startsAt: readString(value.startsAt ?? value.startAt, "upcoming service start"),
    timezone:
      readNullableString(value.timezone) ??
      readNullableString(church.timezone) ??
      readString(undefined, "upcoming timezone"),
  };
}

/** Preserves the backend's ordered census-place matches and their overlap metadata. */
function parseCities(value: unknown): PostalCity[] {
  if (!Array.isArray(value)) throw new Error("The church endpoint returned an invalid postal city list.");
  return value.map((city) => {
    if (!isRecord(city) || typeof city.isPrimary !== "boolean") {
      throw new Error("The church endpoint returned an invalid postal city.");
    }
    return {
      isPrimary: city.isPrimary,
      label: readString(city.label, "postal city label"),
      name: readString(city.name, "postal city name"),
      overlapPercent: readNumber(city.overlapPercent, "postal city overlap"),
      regionCode: readString(city.regionCode, "postal city region code"),
      status: readString(city.status, "postal city status"),
    };
  });
}

/** Preserves each diocese filter and the backend's geographic match status. */
function parseDioceses(value: unknown): DioceseFilter[] {
  if (!Array.isArray(value)) throw new Error("The church endpoint returned an invalid diocese list.");
  return value.map((diocese) => {
    if (!isRecord(diocese)) throw new Error("The church endpoint returned an invalid diocese.");
    return {
      id: readString(diocese.id, "diocese ID"),
      matchStatus: readString(diocese.matchStatus, "diocese match status"),
      name: readString(diocese.name, "diocese name"),
    };
  });
}

/** Resolves API configuration and a fresh Supabase bearer token for one request. */
async function getRequestConfig(): Promise<{ accessToken: string; apiUrl: string }> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before using church discovery.");
  return { accessToken: await getSupabaseAccessToken(), apiUrl: apiUrl.replace(/\/$/u, "") };
}

/** Executes an authenticated church request and converts non-success responses to ChurchApiError. */
async function requestChurchApi(path: string, init: RequestInit = {}): Promise<unknown> {
  const { accessToken, apiUrl } = await getRequestConfig();
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (response.status === 204) return null;
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const errorContainer =
      isRecord(payload) && isRecord(payload.error) ? payload.error : isRecord(payload) ? payload : {};
    const code = readNullableString(errorContainer.code);
    const message =
      readNullableString(errorContainer.message) ?? `Unable to complete the church request (${response.status}).`;
    throw new ChurchApiError(message, response.status, code);
  }
  return payload;
}

/** Resolves one five-digit U.S. ZIP into map, census-place, region, and diocese metadata. */
export async function resolvePostalCode(postalCode: string): Promise<ResolvedPostalCode> {
  const payload = await requestChurchApi(`/api/v1/locations/postal-codes/${encodeURIComponent(postalCode)}`);
  const data = unwrapData(payload);
  if (!isRecord(data)) throw new Error("The church endpoint returned an unexpected response.");
  if (!Array.isArray(data.regionCodes)) {
    throw new Error("The church endpoint returned an invalid postal region list.");
  }
  return {
    cities: parseCities(data.cities),
    dioceseStatus: readString(data.dioceseStatus, "diocese status"),
    dioceses: parseDioceses(data.dioceses),
    latitude: readNumber(data.latitude, "postal latitude"),
    longitude: readNumber(data.longitude, "postal longitude"),
    postalCode: readString(data.postalCode, "postal code"),
    primaryCity: readString(data.primaryCity, "primary city"),
    regionCodes: data.regionCodes.map((regionCode) => readString(regionCode, "postal region code")),
    timezone: readString(data.timezone, "postal timezone"),
  };
}

/** Searches the authenticated church directory using only explicitly supplied filters. */
export async function searchChurches(input: ChurchSearchInput): Promise<PaginatedResponse<ChurchSummary>> {
  const query = new URLSearchParams();
  if (input.postalCode) query.set("postalCode", input.postalCode);
  if (input.radiusMiles !== undefined) query.set("radiusMiles", String(input.radiusMiles));
  if (input.dioceseId) query.set("dioceseId", input.dioceseId);
  if (input.q) query.set("q", input.q);
  if (input.country) query.set("country", input.country);
  if (input.city) query.set("city", input.city);
  if (input.diocese) query.set("diocese", input.diocese);
  const limit = input.limit ?? 20;
  const offset = input.offset ?? 0;
  query.set("limit", String(limit));
  query.set("offset", String(offset));
  const payload = await requestChurchApi(`/api/v1/churches?${query}`);
  const data = readDataArray(payload, ["churches", "results"]).map(parseChurchSummary);
  return { data, meta: parsePagination(payload, data.length, limit, offset) };
}

/** Loads one church's verified directory details, recurring schedule, and live status. */
export async function getChurchDetails(churchId: string): Promise<ChurchDetails> {
  return parseChurchDetails(await requestChurchApi(`/api/v1/churches/${encodeURIComponent(churchId)}`));
}

/** Lists the authenticated user's church reminder subscriptions. */
export async function getChurchSubscriptions(): Promise<ChurchSubscription[]> {
  const payload = await requestChurchApi("/api/v1/me/church-subscriptions");
  return readDataArray(payload, ["subscriptions"]).map(parseSubscription);
}

/** Creates one church subscription with complete service and weekday preferences. */
export async function createChurchSubscription(input: CreateChurchSubscriptionInput): Promise<ChurchSubscription> {
  const payload = await requestChurchApi("/api/v1/me/church-subscriptions", {
    body: JSON.stringify({
      churchId: input.churchId,
      notificationWeekdays: input.notificationWeekdays,
      serviceTypes: input.serviceTypes,
    }),
    method: "POST",
  });
  return parseSubscription(unwrapData(payload));
}

/** Replaces all reminder preferences for an existing church subscription. */
export async function updateChurchSubscription(
  churchId: string,
  preferences: ChurchSubscriptionPreferences,
): Promise<ChurchSubscription> {
  const payload = await requestChurchApi(`/api/v1/me/church-subscriptions/${encodeURIComponent(churchId)}`, {
    body: JSON.stringify({
      notificationWeekdays: preferences.notificationWeekdays,
      serviceTypes: preferences.serviceTypes,
    }),
    method: "PATCH",
  });
  return parseSubscription(unwrapData(payload));
}

/** Removes one church subscription and resolves only after the backend returns 204. */
export async function deleteChurchSubscription(churchId: string): Promise<void> {
  await requestChurchApi(`/api/v1/me/church-subscriptions/${encodeURIComponent(churchId)}`, { method: "DELETE" });
}

/** Loads concrete upcoming occurrences for subscribed churches with optional server filters. */
export async function getUpcomingChurchServices(
  input: UpcomingChurchServicesInput = {},
): Promise<PaginatedResponse<UpcomingChurchService>> {
  const query = new URLSearchParams();
  const days = input.days ?? 7;
  const limit = input.limit ?? 50;
  const offset = input.offset ?? 0;
  query.set("days", String(days));
  query.set("limit", String(limit));
  query.set("offset", String(offset));
  if (input.churchId) query.set("churchId", input.churchId);
  if (input.serviceType) query.set("serviceType", input.serviceType);
  const payload = await requestChurchApi(`/api/v1/me/church-services/upcoming?${query}`);
  const data = readDataArray(payload, ["services", "occurrences"]).map(parseUpcomingService);
  return { data, meta: parsePagination(payload, data.length, limit, offset) };
}
