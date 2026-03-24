import { apiFetch } from '@/lib/api/client';

interface LeaderboardRow {
  user_id: string;
  user_count: number;
  first_name: string;
  last_name: string;
  picture_url: string;
}

export interface LeaderboardResponse {
  data: { data: LeaderboardRow[] };
}

/** Fetch all-time leaderboards. */
export const fetchLeaderboards = () =>
  apiFetch<LeaderboardResponse>('/api/leaderboards');
