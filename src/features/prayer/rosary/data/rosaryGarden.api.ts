import type {
  RosaryCompletionApiDay,
  RosaryCompletionApiResponse,
  RosaryStreakApiResponse,
} from "@/features/prayer/rosary/types";
import { getSupabaseAccessToken } from "@/lib/supabase";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The Rosary Garden endpoint returned an invalid ${field}.`);
  }
  return value;
}

function readString(value: unknown, field: string) {
  if (typeof value !== "string") {
    throw new Error(`The Rosary Garden endpoint returned an invalid ${field}.`);
  }
  return value;
}

function parseCompletionDay(value: unknown): RosaryCompletionApiDay {
  if (!isRecord(value)) throw new Error("The Rosary Garden endpoint returned an invalid day.");
  if (typeof value.completed !== "boolean" && value.completed !== null) {
    throw new Error("The Rosary Garden endpoint returned an invalid completion state.");
  }
  return {
    completed: value.completed,
    date: readString(value.date, "date"),
    day: readNumber(value.day, "day"),
  };
}

function parseCompletionPayload(value: unknown): RosaryCompletionApiResponse {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The Rosary Garden completion endpoint returned an unexpected response.");
  }
  const data = value.data;
  const rawDays = data.days;
  if (!Array.isArray(rawDays)) {
    throw new Error("The Rosary Garden completion endpoint returned an unexpected response.");
  }
  return {
    completedDays: readNumber(data.completedDays, "completed day count"),
    days: rawDays.map(parseCompletionDay),
    eligibleDays: readNumber(data.eligibleDays, "eligible day count"),
    selectedMonth: readNumber(data.selectedMonth, "selected month"),
    year: readNumber(data.year, "year"),
    yearToDatePercentage: readNumber(data.yearToDatePercentage, "year-to-date percentage"),
  };
}

function parseStreakPayload(value: unknown): RosaryStreakApiResponse {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The Rosary streak endpoint returned an unexpected response.");
  }
  const data = value.data;
  return {
    asOfDate: readString(data.asOfDate, "as-of date"),
    currentStreak: readNumber(data.currentStreak, "current streak"),
    longestStreak: readNumber(data.longestStreak, "longest streak"),
    timezone: readString(data.timezone, "timezone"),
  };
}

async function requestRosaryGarden(path: string): Promise<unknown> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading the Rosary Garden.");
  const accessToken = await getSupabaseAccessToken();

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    method: "GET",
  });
  if (!response.ok) throw new Error(`Unable to load Rosary Garden data (${response.status}).`);
  return response.json() as Promise<unknown>;
}

export async function fetchRosaryCompletion(year: number, month: number) {
  const search = new URLSearchParams({ selectedMonth: String(month), selectedYear: String(year) });
  return parseCompletionPayload(await requestRosaryGarden(`/api/v1/me/rosary/completion?${search}`));
}

export async function fetchRosaryStreak() {
  return parseStreakPayload(await requestRosaryGarden("/api/v1/me/rosary/streak"));
}
