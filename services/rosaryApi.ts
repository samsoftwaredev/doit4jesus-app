import { apiFetch } from '@/lib/api/client';

/** Record a completed rosary. */
export const completeRosary = (onlineUsers: string[]) =>
  apiFetch('/api/rosary/complete', { method: 'POST', body: { onlineUsers } });

/** Fetch the authenticated user's current rosary streak. */
export const fetchStreak = () =>
  apiFetch<{ streak: number }>('/api/rosary/streak');

/** Fetch the global total rosary count (no auth required). */
export const fetchTotalRosaryCount = () =>
  apiFetch<{ count: number }>('/api/rosary/count');
