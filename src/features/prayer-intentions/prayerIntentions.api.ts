import { getSupabaseAccessToken } from "@/lib/supabase";

import type {
  ApprovedPrayerIntention,
  CreatePrayerIntentionInput,
  MyPrayerIntention,
  MyPrayerIntentionsPage,
  MyPrayerIntentionsStatusFilter,
  PrayerIntentionPrayerResult,
  PrayerIntentionPrayerSummary,
  PrayerIntentionsPage,
} from "./prayerIntentions.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRecord(value: unknown, field: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`The prayer intentions endpoint returned an invalid ${field}.`);
  return value;
}

function readArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`The prayer intentions endpoint returned an invalid ${field}.`);
  return value;
}

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(`The prayer intentions endpoint returned an invalid ${field}.`);
  return value;
}

function readNullableString(value: unknown, field: string): string | null {
  return value === null ? null : readString(value, field);
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`The prayer intentions endpoint returned an invalid ${field}.`);
  }
  return value;
}

function parsePageMeta(value: unknown) {
  const meta = readRecord(value, "pagination metadata");
  const nextOffset = meta.nextOffset;
  const hasMore = meta.hasMore;
  if (typeof hasMore !== "boolean") {
    throw new Error("The prayer intentions endpoint returned an invalid has-more value.");
  }

  return {
    hasMore,
    limit: readNumber(meta.limit, "page limit"),
    nextOffset: nextOffset === null ? null : readNumber(nextOffset, "next offset"),
    offset: readNumber(meta.offset, "page offset"),
  };
}

function parseCreator(value: unknown) {
  const creator = readRecord(value, "intention creator");
  return {
    avatarUrl: readNullableString(creator.avatarUrl, "creator avatar URL"),
    countryCode: readNullableString(creator.countryCode, "creator country code"),
    displayName: readString(creator.displayName, "creator display name"),
  };
}

function parseApprovedPrayerIntention(value: unknown): ApprovedPrayerIntention {
  const intention = readRecord(value, "approved prayer intention");
  return {
    approvedAt: readString(intention.approvedAt, "approval date"),
    createdAt: readString(intention.createdAt, "creation date"),
    creator: parseCreator(intention.creator),
    description: readString(intention.description, "description"),
    expiresAt: readString(intention.expiresAt, "expiration date"),
    id: readString(intention.id, "intention ID"),
    symbol: readString(intention.symbol, "symbol"),
    title: readString(intention.title, "title"),
  };
}

function parseMyPrayerIntention(value: unknown): MyPrayerIntention {
  const intention = readRecord(value, "your prayer intention");
  const status = readString(intention.status, "status");
  if (status !== "pending" && status !== "visible" && status !== "rejected") {
    throw new Error("The prayer intentions endpoint returned an unsupported intention status.");
  }

  return {
    createdAt: readString(intention.createdAt, "creation date"),
    description: readString(intention.description, "description"),
    expiresAt: readNullableString(intention.expiresAt, "expiration date"),
    id: readString(intention.id, "intention ID"),
    reviewedAt: readNullableString(intention.reviewedAt, "review date"),
    status,
    symbol: readString(intention.symbol, "symbol"),
    title: readString(intention.title, "title"),
  };
}

async function getRequestConfig() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before loading prayer intentions.");

  return {
    accessToken: await getSupabaseAccessToken(),
    apiUrl: apiUrl.replace(/\/$/, ""),
  };
}

async function request(path: string, options: { body?: unknown; method?: "GET" | "POST" } = {}) {
  const { accessToken, apiUrl } = await getRequestConfig();
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);
  const response = await fetch(`${apiUrl}${path}`, {
    body,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    method: options.method ?? "GET",
  });

  if (!response.ok) {
    throw new Error(`Unable to complete prayer intentions request (${response.status}).`);
  }

  return response.json() as Promise<unknown>;
}

function pageQuery(limit: number, offset: number, status?: MyPrayerIntentionsStatusFilter) {
  const search = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) search.set("status", status);
  return search.toString();
}

export async function fetchApprovedPrayerIntentions({
  limit = 10,
  offset = 0,
}: { limit?: number; offset?: number } = {}): Promise<PrayerIntentionsPage> {
  const payload = readRecord(
    await request(`/api/v1/prayer-intentions?${pageQuery(Math.min(100, Math.max(1, limit)), Math.max(0, offset))}`),
    "approved prayer intentions response",
  );

  return {
    data: readArray(payload.data, "approved prayer intentions").map(parseApprovedPrayerIntention),
    meta: parsePageMeta(payload.meta),
  };
}

export async function createPrayerIntention(input: CreatePrayerIntentionInput): Promise<MyPrayerIntention> {
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title || title.length > 120) throw new Error("Title is required and must be 120 characters or fewer.");
  if (!description || description.length > 250) throw new Error("Description is required and must be 250 characters or fewer.");

  const payload = readRecord(
    await request("/api/v1/prayer-intentions", {
      body: { description, symbol: input.symbol, title },
      method: "POST",
    }),
    "create prayer intention response",
  );
  return parseMyPrayerIntention(payload.data);
}

export async function fetchMyPrayerIntentions({
  limit = 20,
  offset = 0,
  status = "all",
}: {
  limit?: number;
  offset?: number;
  status?: MyPrayerIntentionsStatusFilter;
} = {}): Promise<MyPrayerIntentionsPage> {
  const payload = readRecord(
    await request(`/api/v1/me/prayer-intentions?${pageQuery(Math.min(100, Math.max(1, limit)), Math.max(0, offset), status)}`),
    "your prayer intentions response",
  );

  return {
    data: readArray(payload.data, "your prayer intentions").map(parseMyPrayerIntention),
    meta: parsePageMeta(payload.meta),
  };
}

export async function recordPrayerForIntention(intentionId: string): Promise<PrayerIntentionPrayerResult> {
  const payload = readRecord(
    await request(`/api/v1/prayer-intentions/${encodeURIComponent(intentionId)}/prayers`, { method: "POST" }),
    "record intention prayer response",
  );
  const data = readRecord(payload.data, "recorded intention prayer");

  return {
    id: readString(data.id, "prayer event ID"),
    intentionId: readString(data.intentionId, "intention ID"),
    prayedAt: readString(data.prayedAt, "prayed date"),
    prayerCount: readNumber(data.prayerCount, "prayer count"),
  };
}

export async function fetchPrayerIntentionPrayerSummary(intentionId: string): Promise<PrayerIntentionPrayerSummary> {
  const payload = readRecord(
    await request(`/api/v1/prayer-intentions/${encodeURIComponent(intentionId)}/prayers`),
    "intention prayer summary response",
  );
  const data = readRecord(payload.data, "intention prayer summary");
  return { ...parseApprovedPrayerIntention(data), prayerCount: readNumber(data.prayerCount, "prayer count") };
}
