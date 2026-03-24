import type { FriendProfile } from '@/interfaces';
import { FriendRequestsDB, FriendsDB } from '@/interfaces/databaseTable';
import { apiFetch } from '@/lib/api/client';
import { normalizeFriendProfile } from '@/utils';

/** Fetch all friends for the authenticated user. */
export const fetchFriends = () => apiFetch<FriendsDB[]>('/api/friends');

/** End a friendship by ID. */
export const endFriendship = (id: string) =>
  apiFetch(`/api/friends/${encodeURIComponent(id)}`, { method: 'DELETE' });

/** Fetch pending friend requests for the authenticated user. */
export const fetchFriendRequests = () =>
  apiFetch<FriendRequestsDB[]>('/api/friends/requests');

/** Send a new friend request. */
export const sendFriendRequest = (body: {
  uuid1: string;
  uuid2: string;
  uuid1_accepted: boolean;
  uuid2_accepted: boolean;
}) => apiFetch('/api/friends/requests', { method: 'POST', body });

/** Approve a pending friend request. */
export const approveFriendRequest = (id: string) =>
  apiFetch(`/api/friends/requests/${encodeURIComponent(id)}`, {
    method: 'PATCH',
  });

/** Decline / cancel a friend request. */
export const declineFriendRequest = (id: string) =>
  apiFetch(`/api/friends/requests/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

/**
 * Fetch profiles by user IDs (via server-side RPC).
 * Returns normalized FriendProfile[].
 */
export const fetchProfilesByIds = async (
  userIds: string[],
): Promise<FriendProfile[]> => {
  if (userIds.length === 0) return [];
  const raw = await apiFetch<
    {
      id: string;
      first_name: string;
      last_name: string;
      picture_url: string | null;
      rosary_count: number;
    }[]
  >('/api/friends/profiles', { method: 'POST', body: { userIds } });
  return normalizeFriendProfile(raw ?? []);
};
