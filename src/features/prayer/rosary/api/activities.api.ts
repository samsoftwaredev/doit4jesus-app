import { getSupabaseAccessToken } from "@/lib/supabase";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export type RecordRosaryActivityResult = {
  currentLevel: number;
  points: number;
  replayed: boolean;
  totalXp: number;
};

export async function recordRosaryActivity(input: {
  completedAt: string;
  durationSeconds: number;
  idempotencyKey: string;
  occurredAt: string;
}): Promise<RecordRosaryActivityResult> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before recording a Rosary.");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/activities`, {
    body: JSON.stringify({
      activityCode: "ROSARY",
      completedAt: input.completedAt,
      durationSeconds: Math.max(0, Math.floor(input.durationSeconds)),
      metadata: {},
      occurredAt: input.occurredAt,
      quantity: 1,
    }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${await getSupabaseAccessToken()}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    method: "POST",
  });

  if (!response.ok) throw new Error(`Unable to record Rosary completion (${response.status}).`);
  const payload = (await response.json()) as unknown;
  if (!isRecord(payload) || !isRecord(payload.data) || !isRecord(payload.data.xp)) {
    throw new Error("The activity endpoint returned an unexpected Rosary response.");
  }

  const xp = payload.data.xp;
  return {
    currentLevel: typeof xp.currentLevel === "number" ? xp.currentLevel : 0,
    points: typeof xp.points === "number" ? xp.points : 0,
    replayed: payload.data.replayed === true,
    totalXp: typeof xp.totalXp === "number" ? xp.totalXp : 0,
  };
}
