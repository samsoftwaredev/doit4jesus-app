import { request } from "@/features/friends/friends.api";

export interface AppNotification {
  actionUrl: string | null;
  body: string | null;
  createdAt: string;
  id: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  title: string;
  type: string;
}

/** Narrows an unknown API value to a plain record. */
function asRecord(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null) throw new Error(`Invalid ${field}.`);
  return value as Record<string, unknown>;
}

/** Parses one raw notification row returned by the notifications endpoint. */
function parseNotification(value: unknown): AppNotification {
  const row = asRecord(value, "notification");
  if (typeof row.id !== "string" || typeof row.title !== "string" || typeof row.created_at !== "string") {
    throw new Error("Invalid notification.");
  }

  return {
    actionUrl: typeof row.action_url === "string" ? row.action_url : null,
    body: typeof row.body === "string" ? row.body : null,
    createdAt: row.created_at,
    id: row.id,
    payload: typeof row.payload === "object" && row.payload !== null ? (row.payload as Record<string, unknown>) : {},
    readAt: typeof row.read_at === "string" ? row.read_at : null,
    title: row.title,
    type: typeof row.notification_type === "string" ? row.notification_type : "",
  };
}

/** Loads the newest notifications for the current user. */
export async function getNotifications(limit = 50): Promise<AppNotification[]> {
  const payload = asRecord(await request(`/api/v1/notifications?limit=${limit}`), "notifications response");
  if (!Array.isArray(payload.data)) throw new Error("Invalid notifications data.");
  return payload.data.map(parseNotification);
}

/** Returns how many notifications (including friend requests) the user has not seen yet. */
export async function getUnreadNotificationCount(): Promise<number> {
  const payload = asRecord(await request("/api/v1/notifications/unread-count"), "unread count response");
  const data = asRecord(payload.data, "unread count data");
  if (typeof data.count !== "number") throw new Error("Invalid unread count.");
  return data.count;
}

/** Marks every notification as read so the bell badge resets. */
export async function markAllNotificationsRead(): Promise<void> {
  await request("/api/v1/notifications/read-all", { method: "POST" });
}
