import type { DailyLiturgyViewModel, DailyScriptureCompletion, LiturgicalColor, ReadingType } from "./liturgy.types";
import { logDevelopmentError } from "@/lib/development-logger";
import { getSupabaseAccessToken } from "@/lib/supabase";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`The liturgy endpoint returned an invalid ${field}.`);
  }

  return value;
}

/** Returns a non-empty optional API string without treating an absent localization as invalid data. */
function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Maps the app's language-formatting locale to the locale required by the liturgy text dataset. */
function resolveLiturgyLocale(locale: string): "en-US" | "es-MX" {
  return locale.toLowerCase().startsWith("es") ? "es-MX" : "en-US";
}

function readLiturgicalColor(value: unknown): LiturgicalColor {
  if (
    value === "GREEN" ||
    value === "RED" ||
    value === "WHITE" ||
    value === "VIOLET" ||
    value === "ROSE" ||
    value === "BLACK"
  ) {
    return value;
  }

  return "WHITE";
}

function readReadingType(value: unknown): ReadingType {
  if (
    value === "FIRST_READING" ||
    value === "RESPONSORIAL_PSALM" ||
    value === "SECOND_READING" ||
    value === "GOSPEL_ACCLAMATION" ||
    value === "GOSPEL"
  ) {
    return value;
  }

  throw new Error("The liturgy endpoint returned an unsupported reading type.");
}

/** Identifies the activity-backed completion resource returned after recording daily Scripture. */
function isActivityBackedDailyScriptureCompletion(value: Record<string, unknown>): boolean {
  return (
    typeof value.activityId === "string" &&
    value.activityId.length > 0 &&
    typeof value.completedAt === "string" &&
    value.completedAt.length > 0
  );
}

/** Parses date-level Scripture completion from liturgy and activity-backed endpoint payloads. */
function readDailyScriptureCompletion(value: unknown): DailyScriptureCompletion {
  if (!isRecord(value)) return { completed: false, completedAt: null };

  const completed =
    typeof value.completed === "boolean" ? value.completed : isActivityBackedDailyScriptureCompletion(value);

  return {
    completed,
    completedAt: typeof value.completedAt === "string" ? value.completedAt : null,
  };
}

function createReadingId(type: ReadingType, citation: string, index: number) {
  return `${type.toLowerCase()}:${citation.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:${index}`;
}

function createGospelExcerpt(readings: DailyLiturgyViewModel["readings"]) {
  const gospel = readings.find((reading) => reading.type === "GOSPEL");
  if (!gospel?.text.trim()) return undefined;

  const firstParagraph =
    gospel.text
      .trim()
      .split(/\n\s*\n|\n/)[0]
      ?.trim() ?? "";
  const excerpt = firstParagraph.length > 240 ? `${firstParagraph.slice(0, 237).trimEnd()}…` : firstParagraph;
  if (!excerpt) return undefined;

  return { citation: gospel.citation, text: excerpt };
}

/** Parses the API payload into stable reading IDs while favoring server-localized display citations. */
function parseDailyLiturgy(value: unknown): DailyLiturgyViewModel {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The liturgy endpoint returned an unexpected response.");
  }

  const data = value.data;
  const celebration = isRecord(data.celebration) ? data.celebration : null;
  const cycles = isRecord(data.cycles) ? data.cycles : null;
  const metadata = isRecord(data.metadata) ? data.metadata : null;
  const rawReadings = Array.isArray(data.readings) ? data.readings : [];

  if (!celebration || !cycles || !metadata) {
    throw new Error("The liturgy endpoint returned incomplete daily liturgy data.");
  }

  const readings = rawReadings.flatMap((rawReading, index) => {
    try {
      if (!isRecord(rawReading)) throw new Error("Invalid reading");
      const type = readReadingType(rawReading.type);
      const canonicalCitation = readString(rawReading.citation, "reading citation");
      const citation = readOptionalString(rawReading.localizedCitation) ?? canonicalCitation;
      return [
        {
          citation,
          id: createReadingId(type, canonicalCitation, index),
          text: readString(rawReading.text, "reading text"),
          type,
        },
      ];
    } catch (error) {
      logDevelopmentError("parsing a daily liturgy reading", error);
      // Celebration and calendar metadata remain useful when reading text is temporarily unavailable.
      return [];
    }
  });

  return {
    celebration: {
      grade: readString(celebration.grade, "celebration grade"),
      id: readString(celebration.id, "celebration ID"),
      liturgicalColor: readLiturgicalColor(Array.isArray(celebration.color) ? celebration.color[0] : undefined),
      name: readString(celebration.name, "celebration name"),
      season: readString(celebration.season, "liturgical season"),
    },
    completion: readDailyScriptureCompletion(data.completion),
    date: readString(data.date, "date"),
    highlightedVerse: createGospelExcerpt(readings),
    metadata: {
      country: readString(metadata.country, "country"),
      psalterWeek:
        cycles.psalterWeek === 1 || cycles.psalterWeek === 2 || cycles.psalterWeek === 3 || cycles.psalterWeek === 4
          ? cycles.psalterWeek
          : undefined,
      sundayCycle: cycles.sunday === "A" || cycles.sunday === "B" || cycles.sunday === "C" ? cycles.sunday : undefined,
      weekdayCycle: cycles.weekday === "I" || cycles.weekday === "II" ? cycles.weekday : undefined,
    },
    readings,
  };
}

/** Parses an aggregate-screen daily liturgy section using the standalone endpoint contract. */
export function parseDailyLiturgyData(data: unknown): DailyLiturgyViewModel {
  return parseDailyLiturgy({ data });
}

async function getRequestConfig() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading daily liturgy.");
  const accessToken = await getSupabaseAccessToken();

  return { accessToken, apiUrl: apiUrl.replace(/\/$/, "") };
}

async function requestLiturgy(path: string) {
  const { accessToken, apiUrl } = await getRequestConfig();
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    method: "GET",
  });

  if (!response.ok) throw new Error(`Unable to load daily liturgy (${response.status}).`);
  return parseDailyLiturgy((await response.json()) as unknown);
}

/** Loads today's Dallas liturgy in the selected BCP 47 locale. */
export function fetchTodayLiturgy(locale: string) {
  return requestLiturgy(
    `/api/v1/liturgy/today?${new URLSearchParams({ country: "US", diocese: "dallas", locale: resolveLiturgyLocale(locale) })}`,
  );
}

/** Loads a selected date's US liturgy in the selected BCP 47 locale. */
export function fetchLiturgyReadings(date: string, locale: string) {
  return requestLiturgy(
    `/api/v1/liturgy/readings/${encodeURIComponent(date)}?${new URLSearchParams({ country: "US", locale: resolveLiturgyLocale(locale) })}`,
  );
}

/**
 * Records one liturgical day's completed Scripture set and returns the server's authoritative state.
 * Accepts both the direct completion resource and the legacy nested completion response.
 */
export async function recordDailyScriptureCompletion(input: {
  idempotencyKey: string;
  readingDate: string;
}): Promise<DailyScriptureCompletion> {
  const { accessToken, apiUrl } = await getRequestConfig();
  const response = await fetch(`${apiUrl}/api/v1/me/daily-scripture/completions`, {
    body: JSON.stringify({ readingDate: input.readingDate }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    method: "POST",
  });

  if (!response.ok) throw new Error(`Unable to record daily Scripture completion (${response.status}).`);
  if (response.status === 200) return { completed: true, completedAt: null };

  const payload = (await response.json()) as unknown;
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new Error("The daily Scripture completion endpoint returned an unexpected response.");
  }

  const completionValue = payload.data.completion ?? payload.data;
  if (
    !isRecord(completionValue) ||
    (typeof completionValue.completed !== "boolean" && !isActivityBackedDailyScriptureCompletion(completionValue))
  ) {
    throw new Error("The daily Scripture completion endpoint returned an unexpected response.");
  }

  const completion = readDailyScriptureCompletion(completionValue);
  if (!completion.completed) throw new Error("The daily Scripture completion endpoint did not mark the day complete.");
  return completion;
}

export { parseDailyLiturgy };
