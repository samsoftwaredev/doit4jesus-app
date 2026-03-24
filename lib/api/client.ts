/**
 * Typed API client for frontend → Next.js API route calls.
 *
 * Automatically attaches the Supabase auth token so API routes
 * can verify the user server-side via `requireAuth`.
 */
import { supabase } from '@/classes/SupabaseDB';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Fetch wrapper that sends authenticated requests to internal API routes.
 *
 * @example
 *   const friends = await apiFetch<Friend[]>('/api/friends');
 *   await apiFetch('/api/friends/123', { method: 'DELETE' });
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { body, headers: extraHeaders, ...rest } = options;

  const res = await fetch(path, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...extraHeaders,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      (payload as Record<string, string>).error ?? res.statusText,
    );
  }

  // 204 No Content — return undefined as T
  if (res.status === 204) return undefined as T;

  return res.json();
}
