import { ProfilesDB, RosaryStatsDB } from '@/interfaces/databaseTable';
import { apiFetch } from '@/lib/api/client';

interface ProfileResponse {
  profile: ProfilesDB;
  rosaryStats: RosaryStatsDB[];
  currentStreak: number;
  provider: string | null;
}

/** Fetch the authenticated user's full profile, rosary stats, and streak. */
export const fetchProfile = () => apiFetch<ProfileResponse>('/api/profile');

/** Update the user's language preference. */
export const updateLanguage = (language: string) =>
  apiFetch('/api/profile', { method: 'PATCH', body: { language } });

/** Permanently delete the user's account. */
export const deleteAccount = () =>
  apiFetch('/api/profile/delete', { method: 'POST' });

/** Update the user's city and state (location). */
export const updateProfileLocation = (city: string, state: string) =>
  apiFetch<{
    ok: boolean;
    cityWarning: string | null;
    stateWarning: string | null;
  }>('/api/profile', { method: 'PATCH', body: { city, state } });
