import { getSupabaseAccessToken } from "@/lib/supabase";

export type SafetyTargetType = "user" | "prayer_intention" | "event";
export type SafetyReportReason =
  | "harassment"
  | "threats_hate"
  | "sexual_exploitative"
  | "privacy"
  | "scam_impersonation"
  | "infringement"
  | "spam_manipulation"
  | "other";

export type BlockedAccount = {
  avatarUrl: string | null;
  blockedAt: string;
  displayName: string;
  userId: string;
  username: string | null;
};

async function request(path: string, init: RequestInit = {}) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set EXPO_PUBLIC_API_URL before using community safety controls.");
  const response = await fetch(`${apiUrl.replace(/\/$/u, "")}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${await getSupabaseAccessToken()}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`Unable to complete the safety request (${response.status}).`);
  return response.status === 204 ? undefined : ((await response.json()) as unknown);
}

export async function reportContent(input: {
  details?: string;
  reason: SafetyReportReason;
  targetId: string;
  targetType: SafetyTargetType;
}) {
  return request("/api/v1/me/reports", { method: "POST", body: JSON.stringify(input) });
}

export async function blockAccount(userId: string) {
  return request(`/api/v1/me/blocks/${encodeURIComponent(userId)}`, { method: "POST" });
}

export async function unblockAccount(userId: string) {
  return request(`/api/v1/me/blocks/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

export async function fetchBlockedAccounts(): Promise<BlockedAccount[]> {
  const payload = (await request("/api/v1/me/blocks")) as { data?: BlockedAccount[] } | undefined;
  return Array.isArray(payload?.data) ? payload.data : [];
}
